create table categories
(
    id         uuid primary key default gen_random_uuid(),
    name       varchar(100) not null unique,
    parent_id  uuid references categories (id),
    attributes jsonb
);

create table product_statuses
(
    id   uuid primary key,
    code varchar(40) not null unique,
    name varchar(100) not null
);

insert into product_statuses (id, code, name)
values ('00000000-0000-0000-0000-000000000001', 'DRAFT', 'Draft'),
       ('00000000-0000-0000-0000-000000000002', 'PENDING_MODERATION', 'Pending moderation'),
       ('00000000-0000-0000-0000-000000000003', 'PUBLISHED', 'Published'),
       ('00000000-0000-0000-0000-000000000004', 'REJECTED', 'Rejected'),
       ('00000000-0000-0000-0000-000000000005', 'ARCHIVED', 'Archived'),
       ('00000000-0000-0000-0000-000000000006', 'HIDDEN', 'Hidden'),
       ('00000000-0000-0000-0000-000000000007', 'DELETED', 'Deleted');

create table products
(
    id          uuid primary key default gen_random_uuid(),
    seller_id   uuid not null,
    category_id uuid not null references categories (id),
    status_id   uuid not null references product_statuses (id),
    name        varchar(150) not null,
    description varchar(2000) not null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    attributes  jsonb
);

create table product_prices
(
    id         uuid primary key default gen_random_uuid(),
    product_id uuid not null references products (id) on delete cascade,
    price      numeric(12, 2) not null check (price > 0),
    start_date timestamptz not null default now(),
    end_date   timestamptz
);

create table product_inventory
(
    id         uuid primary key default gen_random_uuid(),
    product_id uuid not null references products (id) on delete cascade,
    quantity   integer not null check (quantity >= 0),
    updated_at timestamptz not null default now(),
    constraint uq_product_inventory_product unique (product_id)
);

create index idx_products_public_category on products (category_id, created_at desc);
create index idx_products_status on products (status_id);

create table product_search_aliases
(
    product_id   uuid primary key,
    seller_id    uuid not null,
    category_id  uuid not null,
    name         varchar(150) not null,
    description  varchar(2000) not null,
    price        numeric(12, 2) not null,
    stock        integer not null,
    status       varchar(32) not null,
    created_at   timestamptz not null
);

create index idx_product_search_aliases_status_category
    on product_search_aliases (status, category_id, price);
