do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'categories'
          and column_name = 'id'
          and data_type = 'bigint'
    ) then
        create schema if not exists catalog_legacy;

        if to_regclass('public.categories') is not null then
            alter table public.categories set schema catalog_legacy;
        end if;
        if to_regclass('public.products') is not null then
            alter table public.products set schema catalog_legacy;
        end if;
        if to_regclass('public.product_search_alias') is not null then
            alter table public.product_search_alias set schema catalog_legacy;
        end if;
    end if;
end;
$$;
