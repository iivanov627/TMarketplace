--liquibase formatted sql

--changeset amir:001-profiles-table
create table profiles
(
    id          uuid primary key     default gen_random_uuid(),
    last_name   varchar(100),
    first_name  varchar(100),
    middle_name varchar(100),
    user_id     uuid        not null unique,
    created_at  timestamptz not null default now()
);