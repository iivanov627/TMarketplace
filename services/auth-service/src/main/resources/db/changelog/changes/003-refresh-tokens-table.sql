--liquibase formatted sql

--changeset amir:007-refresh-tokens-table
create table refresh_tokens
(
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid         not null references users (id) on delete cascade,
    token_hash varchar(64)  not null unique,
    expires_at timestamptz  not null,
    revoked    boolean      not null default false,
    created_at timestamptz  not null default now()
);

create index idx_refresh_tokens_user_id on refresh_tokens (user_id);
create index idx_refresh_tokens_expires_at on refresh_tokens (expires_at);
--rollback drop table refresh_tokens;
