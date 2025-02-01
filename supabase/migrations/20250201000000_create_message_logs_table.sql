create table if not exists message_logs (
  id uuid default uuid_generate_v4() primary key,
  message_type text not null,
  message_content jsonb not null,
  target_users jsonb,
  status text not null,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id)
);
