alter table listings add column if not exists status text not null default 'live';

create table if not exists link_reports (
  id serial primary key,
  listing_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists link_reports_listing_idx on link_reports (listing_id);

create table if not exists well_mod (
  listing_id text primary key,
  hidden boolean not null default false,
  dead boolean not null default false,
  updated_at timestamptz not null default now()
);
