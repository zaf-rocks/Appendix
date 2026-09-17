create table if not exists claims (
  listing_id text primary key,
  user_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists claims_user_id_idx on claims (user_id);
