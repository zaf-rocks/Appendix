create table if not exists listings (
  id text primary key,
  user_id text not null,
  name text not null,
  tagline text not null,
  description text not null default '',
  url text not null,
  developer_name text not null,
  genres text not null,
  paid boolean not null default false,
  coming_soon boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists listings_user_id_idx on listings (user_id);

create table if not exists reviews (
  id serial primary key,
  user_id text not null,
  listing_id text not null,
  rating int not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);
create index if not exists reviews_listing_id_idx on reviews (listing_id);
