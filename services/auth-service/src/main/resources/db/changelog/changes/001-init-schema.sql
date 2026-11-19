--liquibase formatted sql

--changeset amir:001-users-table
create table users
(
    id            uuid primary key default gen_random_uuid(),
    login         varchar(100) not null unique,
    password_hash text,
    created_at    timestamptz  not null default now(),
    is_active     boolean      not null default true
);

--changeset amir:002-roles-table
create table roles
(
    id   uuid primary key default gen_random_uuid(),
    name varchar(50) not null unique
);

--changeset amir:003-user-roles
create table user_roles
(
    id      uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    role_id uuid not null references roles (id) on delete cascade,
    unique (user_id, role_id)
);

--changeset amir:004-sso-users
create table sso_users
(
    id          uuid primary key default gen_random_uuid(),
    auth_system varchar(100) not null,
    external_id varchar(255) not null,
    user_id     uuid         not null references users (id) on delete cascade,
    created_at  timestamptz  not null default now(),
    unique (auth_system, external_id)
);

--changeset amir:005-insert-roles
insert into roles (name)
values ('BUYER'),
       ('SELLER');
