do $$
begin
    if to_regclass('public.product_search_aliases') is not null then
        create schema if not exists catalog_legacy;
        alter table public.product_search_aliases set schema catalog_legacy;
    end if;
end;
$$;
