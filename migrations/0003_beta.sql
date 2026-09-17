alter table listings add column if not exists platform text not null default 'web';

create table if not exists beta_testers (
  user_id text primary key,
  note text not null default '',
  created_at timestamptz not null default now()
);
