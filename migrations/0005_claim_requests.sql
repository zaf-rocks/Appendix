create table if not exists claim_requests (
  id serial primary key,
  listing_id text not null,
  user_id text not null,
  email text not null,
  proof text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists claim_requests_listing_idx on claim_requests (listing_id);

alter table listings add column if not exists icon_url text not null default '';
alter table listings add column if not exists contact_email text not null default '';
alter table listings add column if not exists screenshots text not null default '';
alter table listings add column if not exists installable boolean not null default false;
alter table listings add column if not exists offline boolean not null default false;
