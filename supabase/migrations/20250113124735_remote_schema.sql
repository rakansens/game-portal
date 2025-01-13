drop policy "Quests are insertable by authenticated users" on "public"."quests";

drop policy "Quests are updatable by authenticated users" on "public"."quests";

drop policy "Quests are viewable by everyone" on "public"."quests";

alter table "public"."quests" drop constraint "quests_status_check";

drop index if exists "public"."quests_category_idx";

drop index if exists "public"."quests_order_position_idx";

drop index if exists "public"."quests_status_idx";

drop index if exists "public"."quests_type_idx";

create table "public"."analytics" (
    "id" uuid not null default uuid_generate_v4(),
    "type" text,
    "reference_id" uuid,
    "total_participants" integer default 0,
    "completion_rate" double precision default 0,
    "average_time" double precision default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "period" text,
    "data_points" jsonb default '{}'::jsonb
);


alter table "public"."analytics" enable row level security;

create table "public"."audit_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "action" text not null,
    "entity_type" text not null,
    "entity_id" uuid,
    "changes" jsonb default '{}'::jsonb,
    "ip_address" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."audit_logs" enable row level security;

create table "public"."friends" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "friend_id" uuid,
    "status" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "last_interaction" timestamp with time zone,
    "shared_achievements" integer default 0
);


alter table "public"."friends" enable row level security;

create table "public"."gacha_items" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "rarity" text,
    "image_url" text,
    "drop_rate" double precision default 0,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "created_by" uuid,
    "modified_by" uuid,
    "season" text,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "daily_limit" integer,
    "total_limit" integer
);


alter table "public"."gacha_items" enable row level security;

create table "public"."game_tasks" (
    "id" uuid not null default uuid_generate_v4(),
    "game_id" uuid,
    "title" text not null,
    "description" text,
    "points" integer default 0,
    "is_completed" boolean default false,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "created_by" uuid,
    "modified_by" uuid,
    "prerequisites" uuid[]
);


alter table "public"."game_tasks" enable row level security;

create table "public"."games" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "description" text,
    "category" text,
    "image_url" text,
    "players_count" integer default 0,
    "is_active" boolean default true,
    "is_featured" boolean default false,
    "has_new_tasks" boolean default false,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "order_position" integer,
    "created_by" uuid,
    "modified_by" uuid
);


alter table "public"."games" enable row level security;

create table "public"."leaderboard" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "points" integer default 0,
    "rank" integer,
    "category" text,
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "streak" integer default 0,
    "previous_rank" integer,
    "best_rank" integer,
    "season_id" text
);


alter table "public"."leaderboard" enable row level security;

create table "public"."notifications" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "type" text,
    "title" text not null,
    "content" text,
    "is_read" boolean default false,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "priority" text default 'normal'::text,
    "action_url" text,
    "expires_at" timestamp with time zone,
    "metadata" jsonb default '{}'::jsonb
);


alter table "public"."notifications" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default uuid_generate_v4(),
    "auth_id" uuid,
    "username" text,
    "avatar_url" text,
    "points" integer default 0,
    "level" integer default 1,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "last_login" timestamp with time zone,
    "status" text default 'active'::text,
    "telegram_id" text,
    "email_verified" boolean default false,
    "notification_preferences" jsonb default '{}'::jsonb,
    "timezone" text default 'UTC'::text,
    "language" text default 'ja'::text,
    "role" text default 'user'::text,
    "permissions" jsonb default '{}'::jsonb,
    "line_id" text,
    "wallet_address" text
);


alter table "public"."profiles" enable row level security;

create table "public"."quest_participants" (
    "id" uuid not null default uuid_generate_v4(),
    "quest_id" uuid,
    "user_id" uuid,
    "joined_at" timestamp with time zone default timezone('utc'::text, now()),
    "status" text default 'active'::text,
    "last_activity" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."quest_participants" enable row level security;

create table "public"."quest_rewards" (
    "id" uuid not null default uuid_generate_v4(),
    "quest_id" uuid,
    "type" text,
    "value" integer default 0,
    "name" text,
    "rarity" text,
    "items" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "created_by" uuid,
    "modified_by" uuid,
    "expiration_date" timestamp with time zone,
    "distribution_limit" integer,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."quest_rewards" enable row level security;

create table "public"."user_activity_logs" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "action_type" text not null,
    "entity_type" text not null,
    "entity_id" uuid,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "ip_address" text
);


alter table "public"."user_activity_logs" enable row level security;

create table "public"."user_gacha_items" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "gacha_item_id" uuid,
    "quantity" integer default 1,
    "obtained_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "rarity" text,
    "equipped" boolean default false,
    "favorite" boolean default false,
    "trade_locked_until" timestamp with time zone
);


alter table "public"."user_gacha_items" enable row level security;

create table "public"."user_game_progress" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "game_id" uuid,
    "play_time" integer default 0,
    "last_played" timestamp with time zone,
    "completed_tasks" integer default 0,
    "total_points" integer default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "current_streak" integer default 0,
    "best_streak" integer default 0,
    "achievements_unlocked" text[] default ARRAY[]::text[],
    "favorite" boolean default false
);


alter table "public"."user_game_progress" enable row level security;

create table "public"."user_quest_progress" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "quest_id" uuid,
    "status" text default 'not_started'::text,
    "progress" integer default 0,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "points_earned" integer default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "verification_status" text,
    "verification_data" jsonb default '{}'::jsonb,
    "attempts_remaining" integer,
    "next_attempt_available" timestamp with time zone
);


alter table "public"."user_quest_progress" enable row level security;

create table "public"."user_rewards" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "reward_id" uuid,
    "quest_id" uuid,
    "type" text,
    "value" integer default 0,
    "claimed" boolean default false,
    "claimed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "expires_at" timestamp with time zone,
    "transferred" boolean default false,
    "transfer_history" jsonb default '{}'::jsonb
);


alter table "public"."user_rewards" enable row level security;

alter table "public"."quests" drop column "category";

alter table "public"."quests" drop column "exp_reward";

alter table "public"."quests" drop column "tags";

alter table "public"."quests" add column "completion_rate" double precision default 0;

alter table "public"."quests" add column "created_by" uuid;

alter table "public"."quests" add column "modified_by" uuid;

alter table "public"."quests" alter column "description" drop not null;

alter table "public"."quests" alter column "difficulty" drop not null;

alter table "public"."quests" alter column "id" set default uuid_generate_v4();

alter table "public"."quests" alter column "points" set default 0;

alter table "public"."quests" alter column "required_points" set default 0;

alter table "public"."quests" alter column "status" set default 'active'::text;

alter table "public"."quests" alter column "status" drop not null;

CREATE UNIQUE INDEX analytics_pkey ON public.analytics USING btree (id);

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (id);

CREATE UNIQUE INDEX friends_user_id_friend_id_key ON public.friends USING btree (user_id, friend_id);

CREATE UNIQUE INDEX gacha_items_pkey ON public.gacha_items USING btree (id);

CREATE UNIQUE INDEX game_tasks_pkey ON public.game_tasks USING btree (id);

CREATE INDEX games_category_idx ON public.games USING btree (category);

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (id);

CREATE INDEX idx_profiles_line_id ON public.profiles USING btree (line_id);

CREATE INDEX idx_profiles_wallet_address ON public.profiles USING btree (wallet_address);

CREATE INDEX idx_quest_participants_joined_at ON public.quest_participants USING btree (joined_at);

CREATE INDEX idx_quest_participants_quest_user ON public.quest_participants USING btree (quest_id, user_id);

CREATE INDEX idx_quest_rewards_quest_id ON public.quest_rewards USING btree (quest_id);

CREATE INDEX idx_quests_created_at ON public.quests USING btree (created_at);

CREATE INDEX idx_quests_dates ON public.quests USING btree (start_date, end_date);

CREATE INDEX idx_quests_participants ON public.quests USING btree (participants_limit);

CREATE INDEX idx_quests_status ON public.quests USING btree (status);

CREATE INDEX idx_quests_status_type ON public.quests USING btree (status, type);

CREATE INDEX idx_quests_type ON public.quests USING btree (type);

CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs USING btree (created_at);

CREATE INDEX idx_user_activity_logs_user_action ON public.user_activity_logs USING btree (user_id, action_type);

CREATE INDEX idx_user_quest_progress_quest_id ON public.user_quest_progress USING btree (quest_id);

CREATE INDEX idx_user_quest_progress_user_id ON public.user_quest_progress USING btree (user_id);

CREATE UNIQUE INDEX leaderboard_pkey ON public.leaderboard USING btree (id);

CREATE UNIQUE INDEX leaderboard_user_id_category_key ON public.leaderboard USING btree (user_id, category);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX profiles_auth_id_key ON public.profiles USING btree (auth_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX quest_participants_pkey ON public.quest_participants USING btree (id);

CREATE UNIQUE INDEX quest_participants_quest_id_user_id_key ON public.quest_participants USING btree (quest_id, user_id);

CREATE UNIQUE INDEX quest_rewards_pkey ON public.quest_rewards USING btree (id);

CREATE UNIQUE INDEX user_activity_logs_pkey ON public.user_activity_logs USING btree (id);

CREATE UNIQUE INDEX user_gacha_items_pkey ON public.user_gacha_items USING btree (id);

CREATE UNIQUE INDEX user_gacha_items_user_id_gacha_item_id_key ON public.user_gacha_items USING btree (user_id, gacha_item_id);

CREATE UNIQUE INDEX user_game_progress_pkey ON public.user_game_progress USING btree (id);

CREATE UNIQUE INDEX user_game_progress_user_id_game_id_key ON public.user_game_progress USING btree (user_id, game_id);

CREATE UNIQUE INDEX user_quest_progress_pkey ON public.user_quest_progress USING btree (id);

CREATE UNIQUE INDEX user_quest_progress_user_id_quest_id_key ON public.user_quest_progress USING btree (user_id, quest_id);

CREATE UNIQUE INDEX user_rewards_pkey ON public.user_rewards USING btree (id);

CREATE UNIQUE INDEX user_rewards_user_id_reward_id_key ON public.user_rewards USING btree (user_id, reward_id);

alter table "public"."analytics" add constraint "analytics_pkey" PRIMARY KEY using index "analytics_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."gacha_items" add constraint "gacha_items_pkey" PRIMARY KEY using index "gacha_items_pkey";

alter table "public"."game_tasks" add constraint "game_tasks_pkey" PRIMARY KEY using index "game_tasks_pkey";

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."leaderboard" add constraint "leaderboard_pkey" PRIMARY KEY using index "leaderboard_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."quest_participants" add constraint "quest_participants_pkey" PRIMARY KEY using index "quest_participants_pkey";

alter table "public"."quest_rewards" add constraint "quest_rewards_pkey" PRIMARY KEY using index "quest_rewards_pkey";

alter table "public"."user_activity_logs" add constraint "user_activity_logs_pkey" PRIMARY KEY using index "user_activity_logs_pkey";

alter table "public"."user_gacha_items" add constraint "user_gacha_items_pkey" PRIMARY KEY using index "user_gacha_items_pkey";

alter table "public"."user_game_progress" add constraint "user_game_progress_pkey" PRIMARY KEY using index "user_game_progress_pkey";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_pkey" PRIMARY KEY using index "user_quest_progress_pkey";

alter table "public"."user_rewards" add constraint "user_rewards_pkey" PRIMARY KEY using index "user_rewards_pkey";

alter table "public"."analytics" add constraint "analytics_period_check" CHECK ((period = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text]))) not valid;

alter table "public"."analytics" validate constraint "analytics_period_check";

alter table "public"."analytics" add constraint "analytics_type_check" CHECK ((type = ANY (ARRAY['quest'::text, 'game'::text, 'gacha'::text]))) not valid;

alter table "public"."analytics" validate constraint "analytics_type_check";

alter table "public"."audit_logs" add constraint "audit_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_user_id_fkey";

alter table "public"."friends" add constraint "friends_friend_id_fkey" FOREIGN KEY (friend_id) REFERENCES profiles(id) not valid;

alter table "public"."friends" validate constraint "friends_friend_id_fkey";

alter table "public"."friends" add constraint "friends_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'blocked'::text]))) not valid;

alter table "public"."friends" validate constraint "friends_status_check";

alter table "public"."friends" add constraint "friends_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."friends" validate constraint "friends_user_id_fkey";

alter table "public"."friends" add constraint "friends_user_id_friend_id_key" UNIQUE using index "friends_user_id_friend_id_key";

alter table "public"."gacha_items" add constraint "gacha_items_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."gacha_items" validate constraint "gacha_items_created_by_fkey";

alter table "public"."gacha_items" add constraint "gacha_items_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES profiles(id) not valid;

alter table "public"."gacha_items" validate constraint "gacha_items_modified_by_fkey";

alter table "public"."gacha_items" add constraint "gacha_items_rarity_check" CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text]))) not valid;

alter table "public"."gacha_items" validate constraint "gacha_items_rarity_check";

alter table "public"."game_tasks" add constraint "game_tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."game_tasks" validate constraint "game_tasks_created_by_fkey";

alter table "public"."game_tasks" add constraint "game_tasks_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE not valid;

alter table "public"."game_tasks" validate constraint "game_tasks_game_id_fkey";

alter table "public"."game_tasks" add constraint "game_tasks_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES profiles(id) not valid;

alter table "public"."game_tasks" validate constraint "game_tasks_modified_by_fkey";

alter table "public"."games" add constraint "games_category_check" CHECK ((category = ANY (ARRAY['Action'::text, 'Puzzle'::text, 'Strategy'::text, 'Educational'::text, 'Adventure'::text, 'Simulation'::text]))) not valid;

alter table "public"."games" validate constraint "games_category_check";

alter table "public"."games" add constraint "games_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."games" validate constraint "games_created_by_fkey";

alter table "public"."games" add constraint "games_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES profiles(id) not valid;

alter table "public"."games" validate constraint "games_modified_by_fkey";

alter table "public"."leaderboard" add constraint "leaderboard_category_check" CHECK ((category = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text, 'all_time'::text]))) not valid;

alter table "public"."leaderboard" validate constraint "leaderboard_category_check";

alter table "public"."leaderboard" add constraint "leaderboard_user_id_category_key" UNIQUE using index "leaderboard_user_id_category_key";

alter table "public"."leaderboard" add constraint "leaderboard_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."leaderboard" validate constraint "leaderboard_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text]))) not valid;

alter table "public"."notifications" validate constraint "notifications_priority_check";

alter table "public"."notifications" add constraint "notifications_type_check" CHECK ((type = ANY (ARRAY['quest'::text, 'reward'::text, 'achievement'::text, 'system'::text]))) not valid;

alter table "public"."notifications" validate constraint "notifications_type_check";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_auth_id_fkey";

alter table "public"."profiles" add constraint "profiles_auth_id_key" UNIQUE using index "profiles_auth_id_key";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'admin'::text, 'moderator'::text, 'support'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

alter table "public"."profiles" add constraint "profiles_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_status_check";

alter table "public"."quest_participants" add constraint "quest_participants_quest_id_fkey" FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE not valid;

alter table "public"."quest_participants" validate constraint "quest_participants_quest_id_fkey";

alter table "public"."quest_participants" add constraint "quest_participants_quest_id_user_id_key" UNIQUE using index "quest_participants_quest_id_user_id_key";

alter table "public"."quest_participants" add constraint "quest_participants_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'banned'::text]))) not valid;

alter table "public"."quest_participants" validate constraint "quest_participants_status_check";

alter table "public"."quest_participants" add constraint "quest_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."quest_participants" validate constraint "quest_participants_user_id_fkey";

alter table "public"."quest_rewards" add constraint "quest_rewards_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."quest_rewards" validate constraint "quest_rewards_created_by_fkey";

alter table "public"."quest_rewards" add constraint "quest_rewards_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES profiles(id) not valid;

alter table "public"."quest_rewards" validate constraint "quest_rewards_modified_by_fkey";

alter table "public"."quest_rewards" add constraint "quest_rewards_quest_id_fkey" FOREIGN KEY (quest_id) REFERENCES quests(id) not valid;

alter table "public"."quest_rewards" validate constraint "quest_rewards_quest_id_fkey";

alter table "public"."quest_rewards" add constraint "quest_rewards_rarity_check" CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text]))) not valid;

alter table "public"."quest_rewards" validate constraint "quest_rewards_rarity_check";

alter table "public"."quest_rewards" add constraint "quest_rewards_type_check" CHECK ((type = ANY (ARRAY['points'::text, 'gacha'::text, 'badge'::text, 'nft'::text]))) not valid;

alter table "public"."quest_rewards" validate constraint "quest_rewards_type_check";

alter table "public"."quests" add constraint "check_platform_type" CHECK (((platform = ANY (ARRAY['twitter'::text, 'discord'::text, 'telegram'::text, 'x'::text, 'other'::text])) OR (platform IS NULL))) not valid;

alter table "public"."quests" validate constraint "check_platform_type";

alter table "public"."quests" add constraint "quests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."quests" validate constraint "quests_created_by_fkey";

alter table "public"."quests" add constraint "quests_modified_by_fkey" FOREIGN KEY (modified_by) REFERENCES profiles(id) not valid;

alter table "public"."quests" validate constraint "quests_modified_by_fkey";

alter table "public"."quests" add constraint "quests_platform_check" CHECK ((platform = ANY (ARRAY['twitter'::text, 'discord'::text, 'telegram'::text, 'x'::text, 'other'::text]))) not valid;

alter table "public"."quests" validate constraint "quests_platform_check";

alter table "public"."quests" add constraint "quests_type_check" CHECK ((type = ANY (ARRAY['normal'::text, 'roulette'::text, 'special'::text, 'limited_time'::text]))) not valid;

alter table "public"."quests" validate constraint "quests_type_check";

alter table "public"."user_activity_logs" add constraint "user_activity_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_activity_logs" validate constraint "user_activity_logs_user_id_fkey";

alter table "public"."user_gacha_items" add constraint "user_gacha_items_gacha_item_id_fkey" FOREIGN KEY (gacha_item_id) REFERENCES gacha_items(id) not valid;

alter table "public"."user_gacha_items" validate constraint "user_gacha_items_gacha_item_id_fkey";

alter table "public"."user_gacha_items" add constraint "user_gacha_items_rarity_check" CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'epic'::text, 'legendary'::text]))) not valid;

alter table "public"."user_gacha_items" validate constraint "user_gacha_items_rarity_check";

alter table "public"."user_gacha_items" add constraint "user_gacha_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_gacha_items" validate constraint "user_gacha_items_user_id_fkey";

alter table "public"."user_gacha_items" add constraint "user_gacha_items_user_id_gacha_item_id_key" UNIQUE using index "user_gacha_items_user_id_gacha_item_id_key";

alter table "public"."user_game_progress" add constraint "user_game_progress_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(id) not valid;

alter table "public"."user_game_progress" validate constraint "user_game_progress_game_id_fkey";

alter table "public"."user_game_progress" add constraint "user_game_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_game_progress" validate constraint "user_game_progress_user_id_fkey";

alter table "public"."user_game_progress" add constraint "user_game_progress_user_id_game_id_key" UNIQUE using index "user_game_progress_user_id_game_id_key";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_quest_id_fkey" FOREIGN KEY (quest_id) REFERENCES quests(id) not valid;

alter table "public"."user_quest_progress" validate constraint "user_quest_progress_quest_id_fkey";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_status_check" CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."user_quest_progress" validate constraint "user_quest_progress_status_check";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_quest_progress" validate constraint "user_quest_progress_user_id_fkey";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_user_id_quest_id_key" UNIQUE using index "user_quest_progress_user_id_quest_id_key";

alter table "public"."user_quest_progress" add constraint "user_quest_progress_verification_status_check" CHECK ((verification_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."user_quest_progress" validate constraint "user_quest_progress_verification_status_check";

alter table "public"."user_rewards" add constraint "user_rewards_quest_id_fkey" FOREIGN KEY (quest_id) REFERENCES quests(id) not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_quest_id_fkey";

alter table "public"."user_rewards" add constraint "user_rewards_reward_id_fkey" FOREIGN KEY (reward_id) REFERENCES quest_rewards(id) not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_reward_id_fkey";

alter table "public"."user_rewards" add constraint "user_rewards_type_check" CHECK ((type = ANY (ARRAY['points'::text, 'gacha'::text, 'badge'::text, 'nft'::text]))) not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_type_check";

alter table "public"."user_rewards" add constraint "user_rewards_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_user_id_fkey";

alter table "public"."user_rewards" add constraint "user_rewards_user_id_reward_id_key" UNIQUE using index "user_rewards_user_id_reward_id_key";

alter table "public"."quests" add constraint "quests_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text]))) not valid;

alter table "public"."quests" validate constraint "quests_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_daily_backup()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- バックアップロジックをここに実装
    -- 実際のバックアップコマンドはホスティング環境に依存
    INSERT INTO audit_logs (action, entity_type, changes)
    VALUES ('backup_created', 'system', jsonb_build_object('type', 'daily_backup', 'timestamp', now()));
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (auth_id, username, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_quest_rewards_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."analytics" to "anon";

grant insert on table "public"."analytics" to "anon";

grant references on table "public"."analytics" to "anon";

grant select on table "public"."analytics" to "anon";

grant trigger on table "public"."analytics" to "anon";

grant truncate on table "public"."analytics" to "anon";

grant update on table "public"."analytics" to "anon";

grant delete on table "public"."analytics" to "authenticated";

grant insert on table "public"."analytics" to "authenticated";

grant references on table "public"."analytics" to "authenticated";

grant select on table "public"."analytics" to "authenticated";

grant trigger on table "public"."analytics" to "authenticated";

grant truncate on table "public"."analytics" to "authenticated";

grant update on table "public"."analytics" to "authenticated";

grant delete on table "public"."analytics" to "service_role";

grant insert on table "public"."analytics" to "service_role";

grant references on table "public"."analytics" to "service_role";

grant select on table "public"."analytics" to "service_role";

grant trigger on table "public"."analytics" to "service_role";

grant truncate on table "public"."analytics" to "service_role";

grant update on table "public"."analytics" to "service_role";

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";

grant delete on table "public"."gacha_items" to "anon";

grant insert on table "public"."gacha_items" to "anon";

grant references on table "public"."gacha_items" to "anon";

grant select on table "public"."gacha_items" to "anon";

grant trigger on table "public"."gacha_items" to "anon";

grant truncate on table "public"."gacha_items" to "anon";

grant update on table "public"."gacha_items" to "anon";

grant delete on table "public"."gacha_items" to "authenticated";

grant insert on table "public"."gacha_items" to "authenticated";

grant references on table "public"."gacha_items" to "authenticated";

grant select on table "public"."gacha_items" to "authenticated";

grant trigger on table "public"."gacha_items" to "authenticated";

grant truncate on table "public"."gacha_items" to "authenticated";

grant update on table "public"."gacha_items" to "authenticated";

grant delete on table "public"."gacha_items" to "service_role";

grant insert on table "public"."gacha_items" to "service_role";

grant references on table "public"."gacha_items" to "service_role";

grant select on table "public"."gacha_items" to "service_role";

grant trigger on table "public"."gacha_items" to "service_role";

grant truncate on table "public"."gacha_items" to "service_role";

grant update on table "public"."gacha_items" to "service_role";

grant delete on table "public"."game_tasks" to "anon";

grant insert on table "public"."game_tasks" to "anon";

grant references on table "public"."game_tasks" to "anon";

grant select on table "public"."game_tasks" to "anon";

grant trigger on table "public"."game_tasks" to "anon";

grant truncate on table "public"."game_tasks" to "anon";

grant update on table "public"."game_tasks" to "anon";

grant delete on table "public"."game_tasks" to "authenticated";

grant insert on table "public"."game_tasks" to "authenticated";

grant references on table "public"."game_tasks" to "authenticated";

grant select on table "public"."game_tasks" to "authenticated";

grant trigger on table "public"."game_tasks" to "authenticated";

grant truncate on table "public"."game_tasks" to "authenticated";

grant update on table "public"."game_tasks" to "authenticated";

grant delete on table "public"."game_tasks" to "service_role";

grant insert on table "public"."game_tasks" to "service_role";

grant references on table "public"."game_tasks" to "service_role";

grant select on table "public"."game_tasks" to "service_role";

grant trigger on table "public"."game_tasks" to "service_role";

grant truncate on table "public"."game_tasks" to "service_role";

grant update on table "public"."game_tasks" to "service_role";

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

grant delete on table "public"."leaderboard" to "anon";

grant insert on table "public"."leaderboard" to "anon";

grant references on table "public"."leaderboard" to "anon";

grant select on table "public"."leaderboard" to "anon";

grant trigger on table "public"."leaderboard" to "anon";

grant truncate on table "public"."leaderboard" to "anon";

grant update on table "public"."leaderboard" to "anon";

grant delete on table "public"."leaderboard" to "authenticated";

grant insert on table "public"."leaderboard" to "authenticated";

grant references on table "public"."leaderboard" to "authenticated";

grant select on table "public"."leaderboard" to "authenticated";

grant trigger on table "public"."leaderboard" to "authenticated";

grant truncate on table "public"."leaderboard" to "authenticated";

grant update on table "public"."leaderboard" to "authenticated";

grant delete on table "public"."leaderboard" to "service_role";

grant insert on table "public"."leaderboard" to "service_role";

grant references on table "public"."leaderboard" to "service_role";

grant select on table "public"."leaderboard" to "service_role";

grant trigger on table "public"."leaderboard" to "service_role";

grant truncate on table "public"."leaderboard" to "service_role";

grant update on table "public"."leaderboard" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."quest_participants" to "anon";

grant insert on table "public"."quest_participants" to "anon";

grant references on table "public"."quest_participants" to "anon";

grant select on table "public"."quest_participants" to "anon";

grant trigger on table "public"."quest_participants" to "anon";

grant truncate on table "public"."quest_participants" to "anon";

grant update on table "public"."quest_participants" to "anon";

grant delete on table "public"."quest_participants" to "authenticated";

grant insert on table "public"."quest_participants" to "authenticated";

grant references on table "public"."quest_participants" to "authenticated";

grant select on table "public"."quest_participants" to "authenticated";

grant trigger on table "public"."quest_participants" to "authenticated";

grant truncate on table "public"."quest_participants" to "authenticated";

grant update on table "public"."quest_participants" to "authenticated";

grant delete on table "public"."quest_participants" to "service_role";

grant insert on table "public"."quest_participants" to "service_role";

grant references on table "public"."quest_participants" to "service_role";

grant select on table "public"."quest_participants" to "service_role";

grant trigger on table "public"."quest_participants" to "service_role";

grant truncate on table "public"."quest_participants" to "service_role";

grant update on table "public"."quest_participants" to "service_role";

grant delete on table "public"."quest_rewards" to "anon";

grant insert on table "public"."quest_rewards" to "anon";

grant references on table "public"."quest_rewards" to "anon";

grant select on table "public"."quest_rewards" to "anon";

grant trigger on table "public"."quest_rewards" to "anon";

grant truncate on table "public"."quest_rewards" to "anon";

grant update on table "public"."quest_rewards" to "anon";

grant delete on table "public"."quest_rewards" to "authenticated";

grant insert on table "public"."quest_rewards" to "authenticated";

grant references on table "public"."quest_rewards" to "authenticated";

grant select on table "public"."quest_rewards" to "authenticated";

grant trigger on table "public"."quest_rewards" to "authenticated";

grant truncate on table "public"."quest_rewards" to "authenticated";

grant update on table "public"."quest_rewards" to "authenticated";

grant delete on table "public"."quest_rewards" to "service_role";

grant insert on table "public"."quest_rewards" to "service_role";

grant references on table "public"."quest_rewards" to "service_role";

grant select on table "public"."quest_rewards" to "service_role";

grant trigger on table "public"."quest_rewards" to "service_role";

grant truncate on table "public"."quest_rewards" to "service_role";

grant update on table "public"."quest_rewards" to "service_role";

grant delete on table "public"."user_activity_logs" to "anon";

grant insert on table "public"."user_activity_logs" to "anon";

grant references on table "public"."user_activity_logs" to "anon";

grant select on table "public"."user_activity_logs" to "anon";

grant trigger on table "public"."user_activity_logs" to "anon";

grant truncate on table "public"."user_activity_logs" to "anon";

grant update on table "public"."user_activity_logs" to "anon";

grant delete on table "public"."user_activity_logs" to "authenticated";

grant insert on table "public"."user_activity_logs" to "authenticated";

grant references on table "public"."user_activity_logs" to "authenticated";

grant select on table "public"."user_activity_logs" to "authenticated";

grant trigger on table "public"."user_activity_logs" to "authenticated";

grant truncate on table "public"."user_activity_logs" to "authenticated";

grant update on table "public"."user_activity_logs" to "authenticated";

grant delete on table "public"."user_activity_logs" to "service_role";

grant insert on table "public"."user_activity_logs" to "service_role";

grant references on table "public"."user_activity_logs" to "service_role";

grant select on table "public"."user_activity_logs" to "service_role";

grant trigger on table "public"."user_activity_logs" to "service_role";

grant truncate on table "public"."user_activity_logs" to "service_role";

grant update on table "public"."user_activity_logs" to "service_role";

grant delete on table "public"."user_gacha_items" to "anon";

grant insert on table "public"."user_gacha_items" to "anon";

grant references on table "public"."user_gacha_items" to "anon";

grant select on table "public"."user_gacha_items" to "anon";

grant trigger on table "public"."user_gacha_items" to "anon";

grant truncate on table "public"."user_gacha_items" to "anon";

grant update on table "public"."user_gacha_items" to "anon";

grant delete on table "public"."user_gacha_items" to "authenticated";

grant insert on table "public"."user_gacha_items" to "authenticated";

grant references on table "public"."user_gacha_items" to "authenticated";

grant select on table "public"."user_gacha_items" to "authenticated";

grant trigger on table "public"."user_gacha_items" to "authenticated";

grant truncate on table "public"."user_gacha_items" to "authenticated";

grant update on table "public"."user_gacha_items" to "authenticated";

grant delete on table "public"."user_gacha_items" to "service_role";

grant insert on table "public"."user_gacha_items" to "service_role";

grant references on table "public"."user_gacha_items" to "service_role";

grant select on table "public"."user_gacha_items" to "service_role";

grant trigger on table "public"."user_gacha_items" to "service_role";

grant truncate on table "public"."user_gacha_items" to "service_role";

grant update on table "public"."user_gacha_items" to "service_role";

grant delete on table "public"."user_game_progress" to "anon";

grant insert on table "public"."user_game_progress" to "anon";

grant references on table "public"."user_game_progress" to "anon";

grant select on table "public"."user_game_progress" to "anon";

grant trigger on table "public"."user_game_progress" to "anon";

grant truncate on table "public"."user_game_progress" to "anon";

grant update on table "public"."user_game_progress" to "anon";

grant delete on table "public"."user_game_progress" to "authenticated";

grant insert on table "public"."user_game_progress" to "authenticated";

grant references on table "public"."user_game_progress" to "authenticated";

grant select on table "public"."user_game_progress" to "authenticated";

grant trigger on table "public"."user_game_progress" to "authenticated";

grant truncate on table "public"."user_game_progress" to "authenticated";

grant update on table "public"."user_game_progress" to "authenticated";

grant delete on table "public"."user_game_progress" to "service_role";

grant insert on table "public"."user_game_progress" to "service_role";

grant references on table "public"."user_game_progress" to "service_role";

grant select on table "public"."user_game_progress" to "service_role";

grant trigger on table "public"."user_game_progress" to "service_role";

grant truncate on table "public"."user_game_progress" to "service_role";

grant update on table "public"."user_game_progress" to "service_role";

grant delete on table "public"."user_quest_progress" to "anon";

grant insert on table "public"."user_quest_progress" to "anon";

grant references on table "public"."user_quest_progress" to "anon";

grant select on table "public"."user_quest_progress" to "anon";

grant trigger on table "public"."user_quest_progress" to "anon";

grant truncate on table "public"."user_quest_progress" to "anon";

grant update on table "public"."user_quest_progress" to "anon";

grant delete on table "public"."user_quest_progress" to "authenticated";

grant insert on table "public"."user_quest_progress" to "authenticated";

grant references on table "public"."user_quest_progress" to "authenticated";

grant select on table "public"."user_quest_progress" to "authenticated";

grant trigger on table "public"."user_quest_progress" to "authenticated";

grant truncate on table "public"."user_quest_progress" to "authenticated";

grant update on table "public"."user_quest_progress" to "authenticated";

grant delete on table "public"."user_quest_progress" to "service_role";

grant insert on table "public"."user_quest_progress" to "service_role";

grant references on table "public"."user_quest_progress" to "service_role";

grant select on table "public"."user_quest_progress" to "service_role";

grant trigger on table "public"."user_quest_progress" to "service_role";

grant truncate on table "public"."user_quest_progress" to "service_role";

grant update on table "public"."user_quest_progress" to "service_role";

grant delete on table "public"."user_rewards" to "anon";

grant insert on table "public"."user_rewards" to "anon";

grant references on table "public"."user_rewards" to "anon";

grant select on table "public"."user_rewards" to "anon";

grant trigger on table "public"."user_rewards" to "anon";

grant truncate on table "public"."user_rewards" to "anon";

grant update on table "public"."user_rewards" to "anon";

grant delete on table "public"."user_rewards" to "authenticated";

grant insert on table "public"."user_rewards" to "authenticated";

grant references on table "public"."user_rewards" to "authenticated";

grant select on table "public"."user_rewards" to "authenticated";

grant trigger on table "public"."user_rewards" to "authenticated";

grant truncate on table "public"."user_rewards" to "authenticated";

grant update on table "public"."user_rewards" to "authenticated";

grant delete on table "public"."user_rewards" to "service_role";

grant insert on table "public"."user_rewards" to "service_role";

grant references on table "public"."user_rewards" to "service_role";

grant select on table "public"."user_rewards" to "service_role";

grant trigger on table "public"."user_rewards" to "service_role";

grant truncate on table "public"."user_rewards" to "service_role";

grant update on table "public"."user_rewards" to "service_role";

create policy "Users can manage their own friend requests"
on "public"."friends"
as permissive
for insert
to public
with check ((auth.uid() = ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = friends.user_id))));


create policy "Users can update their own friend relationships"
on "public"."friends"
as permissive
for update
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = friends.user_id)
UNION
 SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = friends.friend_id))));


create policy "Users can view their own friends"
on "public"."friends"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = friends.user_id)
UNION
 SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = friends.friend_id))));


create policy "Users can view active gacha items"
on "public"."gacha_items"
as permissive
for select
to public
using ((is_active = true));


create policy "Admins can manage game tasks"
on "public"."game_tasks"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.role = 'admin'::text))));


create policy "Anyone can view game tasks"
on "public"."game_tasks"
as permissive
for select
to public
using (true);


create policy "Admins can manage games"
on "public"."games"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.auth_id = auth.uid()) AND (profiles.role = 'admin'::text))
 LIMIT 1)));


create policy "Games are editable by admins only"
on "public"."games"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.auth_id = auth.uid()) AND (p.role = 'admin'::text))
 LIMIT 1)));


create policy "Games are viewable by everyone when active"
on "public"."games"
as permissive
for select
to public
using ((is_active = true));


create policy "Public games are viewable by everyone"
on "public"."games"
as permissive
for select
to public
using ((is_active = true));


create policy "Anyone can view leaderboard"
on "public"."leaderboard"
as permissive
for select
to authenticated
using (true);


create policy "System can update leaderboard"
on "public"."leaderboard"
as permissive
for insert
to authenticated
with check ((auth.uid() = ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = leaderboard.user_id))));


create policy "Users can update their own notifications"
on "public"."notifications"
as permissive
for update
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = notifications.user_id))));


create policy "Users can view their own notifications"
on "public"."notifications"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = notifications.user_id))));


create policy "Enable delete for admins only"
on "public"."profiles"
as permissive
for delete
to public
using (((auth.jwt() ->> 'role'::text) = 'admin'::text));


create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Enable read access for everyone"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."profiles"
as permissive
for update
to public
using ((auth_id = auth.uid()));


create policy "Admins can view all participants"
on "public"."quest_participants"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.auth_id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "Users can join quests"
on "public"."quest_participants"
as permissive
for insert
to public
with check ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = quest_participants.user_id))));


create policy "Users can view their own participation"
on "public"."quest_participants"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = quest_participants.user_id))));


create policy "Admins can manage quest rewards"
on "public"."quest_rewards"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.auth_id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "Users can view quest rewards"
on "public"."quest_rewards"
as permissive
for select
to public
using (true);


create policy "Admins can manage all quests"
on "public"."quests"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.auth_id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "Users can view active quests"
on "public"."quests"
as permissive
for select
to public
using ((status = 'active'::text));


create policy "Admins can view all logs"
on "public"."user_activity_logs"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.auth_id = auth.uid()) AND (profiles.role = 'admin'::text)))));


create policy "System can insert logs"
on "public"."user_activity_logs"
as permissive
for insert
to public
with check (true);


create policy "Users can view their own activity"
on "public"."user_activity_logs"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_activity_logs.user_id))));


create policy "Users can manage their own gacha items"
on "public"."user_gacha_items"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_gacha_items.user_id))));


create policy "Users can view their own gacha items"
on "public"."user_gacha_items"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_gacha_items.user_id))));


create policy "Admins can view all progress"
on "public"."user_game_progress"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.role = 'admin'::text))));


create policy "Users can manage their own progress"
on "public"."user_game_progress"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_game_progress.user_id))));


create policy "Users can manage their own progress"
on "public"."user_quest_progress"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_quest_progress.user_id))));


create policy "Users can manage their own rewards"
on "public"."user_rewards"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_rewards.user_id))));


create policy "Users can view their own rewards"
on "public"."user_rewards"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT profiles.auth_id
   FROM profiles
  WHERE (profiles.id = user_rewards.user_id))));


CREATE TRIGGER update_quest_rewards_updated_at BEFORE UPDATE ON public.quest_rewards FOR EACH ROW EXECUTE FUNCTION update_quest_rewards_updated_at();


