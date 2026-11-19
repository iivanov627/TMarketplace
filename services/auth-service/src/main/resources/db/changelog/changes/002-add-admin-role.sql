--liquibase formatted sql

--changeset amir:006-admin-role
insert into roles (name)
values ('ADMIN');
