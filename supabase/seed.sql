

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_daily_backup"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- バックアップロジックをここに実装
    -- 実際のバックアップコマンドはホスティング環境に依存
    INSERT INTO audit_logs (action, entity_type, changes)
    VALUES ('backup_created', 'system', jsonb_build_object('type', 'daily_backup', 'timestamp', now()));
END;
$$;


ALTER FUNCTION "public"."create_daily_backup"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (auth_id, username, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_quest_rewards_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_quest_rewards_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."analytics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" "text",
    "reference_id" "uuid",
    "total_participants" integer DEFAULT 0,
    "completion_rate" double precision DEFAULT 0,
    "average_time" double precision DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "period" "text",
    "data_points" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "analytics_period_check" CHECK (("period" = ANY (ARRAY['daily'::"text", 'weekly'::"text", 'monthly'::"text"]))),
    CONSTRAINT "analytics_type_check" CHECK (("type" = ANY (ARRAY['quest'::"text", 'game'::"text", 'gacha'::"text"])))
);


ALTER TABLE "public"."analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "changes" "jsonb" DEFAULT '{}'::"jsonb",
    "ip_address" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "friend_id" "uuid",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "last_interaction" timestamp with time zone,
    "shared_achievements" integer DEFAULT 0,
    CONSTRAINT "friends_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'blocked'::"text"])))
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gacha_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "rarity" "text",
    "image_url" "text",
    "drop_rate" double precision DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_by" "uuid",
    "modified_by" "uuid",
    "season" "text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "daily_limit" integer,
    "total_limit" integer,
    CONSTRAINT "gacha_items_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'rare'::"text", 'epic'::"text", 'legendary'::"text"])))
);


ALTER TABLE "public"."gacha_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."game_tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "game_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "points" integer DEFAULT 0,
    "is_completed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_by" "uuid",
    "modified_by" "uuid",
    "prerequisites" "uuid"[]
);


ALTER TABLE "public"."game_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text",
    "image_url" "text",
    "players_count" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "is_featured" boolean DEFAULT false,
    "has_new_tasks" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "order_position" integer,
    "created_by" "uuid",
    "modified_by" "uuid",
    CONSTRAINT "games_category_check" CHECK (("category" = ANY (ARRAY['Action'::"text", 'Puzzle'::"text", 'Strategy'::"text", 'Educational'::"text", 'Adventure'::"text", 'Simulation'::"text"])))
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leaderboard" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "points" integer DEFAULT 0,
    "rank" integer,
    "category" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "streak" integer DEFAULT 0,
    "previous_rank" integer,
    "best_rank" integer,
    "season_id" "text",
    CONSTRAINT "leaderboard_category_check" CHECK (("category" = ANY (ARRAY['daily'::"text", 'weekly'::"text", 'monthly'::"text", 'all_time'::"text"])))
);


ALTER TABLE "public"."leaderboard" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "type" "text",
    "title" "text" NOT NULL,
    "content" "text",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "priority" "text" DEFAULT 'normal'::"text",
    "action_url" "text",
    "expires_at" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "notifications_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text"]))),
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['quest'::"text", 'reward'::"text", 'achievement'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "auth_id" "uuid",
    "username" "text",
    "avatar_url" "text",
    "points" integer DEFAULT 0,
    "level" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "last_login" timestamp with time zone,
    "status" "text" DEFAULT 'active'::"text",
    "telegram_id" "text",
    "email_verified" boolean DEFAULT false,
    "notification_preferences" "jsonb" DEFAULT '{}'::"jsonb",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "language" "text" DEFAULT 'ja'::"text",
    "role" "text" DEFAULT 'user'::"text",
    "permissions" "jsonb" DEFAULT '{}'::"jsonb",
    "line_id" "text",
    "wallet_address" "text",
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'admin'::"text", 'moderator'::"text", 'support'::"text"]))),
    CONSTRAINT "profiles_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quest_participants" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "quest_id" "uuid",
    "user_id" "uuid",
    "joined_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "status" "text" DEFAULT 'active'::"text",
    "last_activity" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "quest_participants_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'banned'::"text"])))
);

ALTER TABLE ONLY "public"."quest_participants" REPLICA IDENTITY FULL;


ALTER TABLE "public"."quest_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quest_rewards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "quest_id" "uuid",
    "type" "text",
    "value" integer DEFAULT 0,
    "name" "text",
    "rarity" "text",
    "items" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_by" "uuid",
    "modified_by" "uuid",
    "expiration_date" timestamp with time zone,
    "distribution_limit" integer,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quest_rewards_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'rare'::"text", 'epic'::"text", 'legendary'::"text"]))),
    CONSTRAINT "quest_rewards_type_check" CHECK (("type" = ANY (ARRAY['points'::"text", 'gacha'::"text", 'badge'::"text", 'nft'::"text"])))
);


ALTER TABLE "public"."quest_rewards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "type" "text",
    "platform" "text",
    "points" integer DEFAULT 0,
    "status" "text" DEFAULT 'active'::"text",
    "difficulty" integer,
    "is_important" boolean DEFAULT false,
    "is_limited" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_by" "uuid",
    "modified_by" "uuid",
    "completion_rate" double precision DEFAULT 0,
    "participant_count" integer DEFAULT 0,
    "order_position" integer,
    "estimated_time" integer,
    "required_points" integer DEFAULT 0,
    "auto_progress" boolean DEFAULT false,
    "verification_required" boolean DEFAULT false,
    "verification_type" "text",
    "max_attempts" integer,
    "cooldown_period" integer,
    "external_url" "text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "participants_limit" integer,
    "banner_url" "text",
    CONSTRAINT "check_platform_type" CHECK ((("platform" = ANY (ARRAY['twitter'::"text", 'discord'::"text", 'telegram'::"text", 'x'::"text", 'other'::"text"])) OR ("platform" IS NULL))),
    CONSTRAINT "quests_platform_check" CHECK (("platform" = ANY (ARRAY['twitter'::"text", 'discord'::"text", 'telegram'::"text", 'x'::"text", 'other'::"text"]))),
    CONSTRAINT "quests_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text"]))),
    CONSTRAINT "quests_type_check" CHECK (("type" = ANY (ARRAY['normal'::"text", 'roulette'::"text", 'special'::"text", 'limited_time'::"text"]))),
    CONSTRAINT "quests_verification_type_check" CHECK (("verification_type" = ANY (ARRAY['manual'::"text", 'automatic'::"text"])))
);


ALTER TABLE "public"."quests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_activity_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action_type" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "ip_address" "text"
);


ALTER TABLE "public"."user_activity_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_gacha_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "gacha_item_id" "uuid",
    "quantity" integer DEFAULT 1,
    "obtained_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "rarity" "text",
    "equipped" boolean DEFAULT false,
    "favorite" boolean DEFAULT false,
    "trade_locked_until" timestamp with time zone,
    CONSTRAINT "user_gacha_items_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'rare'::"text", 'epic'::"text", 'legendary'::"text"])))
);


ALTER TABLE "public"."user_gacha_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_game_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "game_id" "uuid",
    "play_time" integer DEFAULT 0,
    "last_played" timestamp with time zone,
    "completed_tasks" integer DEFAULT 0,
    "total_points" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_streak" integer DEFAULT 0,
    "best_streak" integer DEFAULT 0,
    "achievements_unlocked" "text"[] DEFAULT ARRAY[]::"text"[],
    "favorite" boolean DEFAULT false
);


ALTER TABLE "public"."user_game_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_quest_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "quest_id" "uuid",
    "status" "text" DEFAULT 'not_started'::"text",
    "progress" integer DEFAULT 0,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "points_earned" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "verification_status" "text",
    "verification_data" "jsonb" DEFAULT '{}'::"jsonb",
    "attempts_remaining" integer,
    "next_attempt_available" timestamp with time zone,
    CONSTRAINT "user_quest_progress_status_check" CHECK (("status" = ANY (ARRAY['not_started'::"text", 'in_progress'::"text", 'completed'::"text", 'failed'::"text"]))),
    CONSTRAINT "user_quest_progress_verification_status_check" CHECK (("verification_status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."user_quest_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_rewards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "reward_id" "uuid",
    "quest_id" "uuid",
    "type" "text",
    "value" integer DEFAULT 0,
    "claimed" boolean DEFAULT false,
    "claimed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "expires_at" timestamp with time zone,
    "transferred" boolean DEFAULT false,
    "transfer_history" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "user_rewards_type_check" CHECK (("type" = ANY (ARRAY['points'::"text", 'gacha'::"text", 'badge'::"text", 'nft'::"text"])))
);


ALTER TABLE "public"."user_rewards" OWNER TO "postgres";


ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_user_id_friend_id_key" UNIQUE ("user_id", "friend_id");



ALTER TABLE ONLY "public"."gacha_items"
    ADD CONSTRAINT "gacha_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game_tasks"
    ADD CONSTRAINT "game_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leaderboard"
    ADD CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leaderboard"
    ADD CONSTRAINT "leaderboard_user_id_category_key" UNIQUE ("user_id", "category");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_id_key" UNIQUE ("auth_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quest_participants"
    ADD CONSTRAINT "quest_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quest_participants"
    ADD CONSTRAINT "quest_participants_quest_id_user_id_key" UNIQUE ("quest_id", "user_id");



ALTER TABLE ONLY "public"."quest_rewards"
    ADD CONSTRAINT "quest_rewards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activity_logs"
    ADD CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_gacha_items"
    ADD CONSTRAINT "user_gacha_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_gacha_items"
    ADD CONSTRAINT "user_gacha_items_user_id_gacha_item_id_key" UNIQUE ("user_id", "gacha_item_id");



ALTER TABLE ONLY "public"."user_game_progress"
    ADD CONSTRAINT "user_game_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_game_progress"
    ADD CONSTRAINT "user_game_progress_user_id_game_id_key" UNIQUE ("user_id", "game_id");



ALTER TABLE ONLY "public"."user_quest_progress"
    ADD CONSTRAINT "user_quest_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_quest_progress"
    ADD CONSTRAINT "user_quest_progress_user_id_quest_id_key" UNIQUE ("user_id", "quest_id");



ALTER TABLE ONLY "public"."user_rewards"
    ADD CONSTRAINT "user_rewards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_rewards"
    ADD CONSTRAINT "user_rewards_user_id_reward_id_key" UNIQUE ("user_id", "reward_id");



CREATE INDEX "games_category_idx" ON "public"."games" USING "btree" ("category");



CREATE INDEX "idx_profiles_line_id" ON "public"."profiles" USING "btree" ("line_id");



CREATE INDEX "idx_profiles_wallet_address" ON "public"."profiles" USING "btree" ("wallet_address");



CREATE INDEX "idx_quest_participants_joined_at" ON "public"."quest_participants" USING "btree" ("joined_at");



CREATE INDEX "idx_quest_participants_quest_user" ON "public"."quest_participants" USING "btree" ("quest_id", "user_id");



CREATE INDEX "idx_quest_rewards_quest_id" ON "public"."quest_rewards" USING "btree" ("quest_id");



CREATE INDEX "idx_quests_created_at" ON "public"."quests" USING "btree" ("created_at");



CREATE INDEX "idx_quests_dates" ON "public"."quests" USING "btree" ("start_date", "end_date");



CREATE INDEX "idx_quests_participants" ON "public"."quests" USING "btree" ("participants_limit");



CREATE INDEX "idx_quests_status" ON "public"."quests" USING "btree" ("status");



CREATE INDEX "idx_quests_status_type" ON "public"."quests" USING "btree" ("status", "type");



CREATE INDEX "idx_quests_type" ON "public"."quests" USING "btree" ("type");



CREATE INDEX "idx_user_activity_logs_created_at" ON "public"."user_activity_logs" USING "btree" ("created_at");



CREATE INDEX "idx_user_activity_logs_user_action" ON "public"."user_activity_logs" USING "btree" ("user_id", "action_type");



CREATE INDEX "idx_user_quest_progress_quest_id" ON "public"."user_quest_progress" USING "btree" ("quest_id");



CREATE INDEX "idx_user_quest_progress_user_id" ON "public"."user_quest_progress" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "update_quest_rewards_updated_at" BEFORE UPDATE ON "public"."quest_rewards" FOR EACH ROW EXECUTE FUNCTION "public"."update_quest_rewards_updated_at"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."gacha_items"
    ADD CONSTRAINT "gacha_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."gacha_items"
    ADD CONSTRAINT "gacha_items_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."game_tasks"
    ADD CONSTRAINT "game_tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."game_tasks"
    ADD CONSTRAINT "game_tasks_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."game_tasks"
    ADD CONSTRAINT "game_tasks_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."leaderboard"
    ADD CONSTRAINT "leaderboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."quest_participants"
    ADD CONSTRAINT "quest_participants_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quest_participants"
    ADD CONSTRAINT "quest_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quest_rewards"
    ADD CONSTRAINT "quest_rewards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."quest_rewards"
    ADD CONSTRAINT "quest_rewards_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."quest_rewards"
    ADD CONSTRAINT "quest_rewards_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");



ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."quests"
    ADD CONSTRAINT "quests_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_activity_logs"
    ADD CONSTRAINT "user_activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_gacha_items"
    ADD CONSTRAINT "user_gacha_items_gacha_item_id_fkey" FOREIGN KEY ("gacha_item_id") REFERENCES "public"."gacha_items"("id");



ALTER TABLE ONLY "public"."user_gacha_items"
    ADD CONSTRAINT "user_gacha_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_game_progress"
    ADD CONSTRAINT "user_game_progress_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id");



ALTER TABLE ONLY "public"."user_game_progress"
    ADD CONSTRAINT "user_game_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_quest_progress"
    ADD CONSTRAINT "user_quest_progress_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");



ALTER TABLE ONLY "public"."user_quest_progress"
    ADD CONSTRAINT "user_quest_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_rewards"
    ADD CONSTRAINT "user_rewards_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id");



ALTER TABLE ONLY "public"."user_rewards"
    ADD CONSTRAINT "user_rewards_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "public"."quest_rewards"("id");



ALTER TABLE ONLY "public"."user_rewards"
    ADD CONSTRAINT "user_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Admins can manage all quests" ON "public"."quests" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."auth_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can manage game tasks" ON "public"."game_tasks" USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can manage games" ON "public"."games" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."auth_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))
 LIMIT 1)));



CREATE POLICY "Admins can manage quest rewards" ON "public"."quest_rewards" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."auth_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all logs" ON "public"."user_activity_logs" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."auth_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all participants" ON "public"."quest_participants" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."auth_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all progress" ON "public"."user_game_progress" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Anyone can view game tasks" ON "public"."game_tasks" FOR SELECT USING (true);



CREATE POLICY "Anyone can view leaderboard" ON "public"."leaderboard" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable delete for admins only" ON "public"."profiles" FOR DELETE USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Enable read access for everyone" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."profiles" FOR UPDATE USING (("auth_id" = "auth"."uid"()));



CREATE POLICY "Games are editable by admins only" ON "public"."games" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."auth_id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text"))
 LIMIT 1)));



CREATE POLICY "Games are viewable by everyone when active" ON "public"."games" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public games are viewable by everyone" ON "public"."games" FOR SELECT USING (("is_active" = true));



CREATE POLICY "System can insert logs" ON "public"."user_activity_logs" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can update leaderboard" ON "public"."leaderboard" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "leaderboard"."user_id"))));



CREATE POLICY "Users can join quests" ON "public"."quest_participants" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "quest_participants"."user_id"))));



CREATE POLICY "Users can manage their own friend requests" ON "public"."friends" FOR INSERT WITH CHECK (("auth"."uid"() = ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "friends"."user_id"))));



CREATE POLICY "Users can manage their own gacha items" ON "public"."user_gacha_items" USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_gacha_items"."user_id"))));



CREATE POLICY "Users can manage their own progress" ON "public"."user_game_progress" USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_game_progress"."user_id"))));



CREATE POLICY "Users can manage their own progress" ON "public"."user_quest_progress" USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_quest_progress"."user_id"))));



CREATE POLICY "Users can manage their own rewards" ON "public"."user_rewards" USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_rewards"."user_id"))));



CREATE POLICY "Users can update their own friend relationships" ON "public"."friends" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "friends"."user_id")
UNION
 SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "friends"."friend_id"))));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "notifications"."user_id"))));



CREATE POLICY "Users can view active gacha items" ON "public"."gacha_items" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Users can view active quests" ON "public"."quests" FOR SELECT USING (("status" = 'active'::"text"));



CREATE POLICY "Users can view quest rewards" ON "public"."quest_rewards" FOR SELECT USING (true);



CREATE POLICY "Users can view their own activity" ON "public"."user_activity_logs" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_activity_logs"."user_id"))));



CREATE POLICY "Users can view their own friends" ON "public"."friends" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "friends"."user_id")
UNION
 SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "friends"."friend_id"))));



CREATE POLICY "Users can view their own gacha items" ON "public"."user_gacha_items" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_gacha_items"."user_id"))));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "notifications"."user_id"))));



CREATE POLICY "Users can view their own participation" ON "public"."quest_participants" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "quest_participants"."user_id"))));



CREATE POLICY "Users can view their own rewards" ON "public"."user_rewards" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."auth_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "user_rewards"."user_id"))));



ALTER TABLE "public"."analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gacha_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."game_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leaderboard" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quest_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quest_rewards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_activity_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_gacha_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_game_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_quest_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_rewards" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."quest_participants";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."create_daily_backup"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_daily_backup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_daily_backup"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_quest_rewards_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_quest_rewards_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_quest_rewards_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."analytics" TO "anon";
GRANT ALL ON TABLE "public"."analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON TABLE "public"."gacha_items" TO "anon";
GRANT ALL ON TABLE "public"."gacha_items" TO "authenticated";
GRANT ALL ON TABLE "public"."gacha_items" TO "service_role";



GRANT ALL ON TABLE "public"."game_tasks" TO "anon";
GRANT ALL ON TABLE "public"."game_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."game_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON TABLE "public"."leaderboard" TO "anon";
GRANT ALL ON TABLE "public"."leaderboard" TO "authenticated";
GRANT ALL ON TABLE "public"."leaderboard" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quest_participants" TO "anon";
GRANT ALL ON TABLE "public"."quest_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."quest_participants" TO "service_role";



GRANT ALL ON TABLE "public"."quest_rewards" TO "anon";
GRANT ALL ON TABLE "public"."quest_rewards" TO "authenticated";
GRANT ALL ON TABLE "public"."quest_rewards" TO "service_role";



GRANT ALL ON TABLE "public"."quests" TO "anon";
GRANT ALL ON TABLE "public"."quests" TO "authenticated";
GRANT ALL ON TABLE "public"."quests" TO "service_role";



GRANT ALL ON TABLE "public"."user_activity_logs" TO "anon";
GRANT ALL ON TABLE "public"."user_activity_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."user_activity_logs" TO "service_role";



GRANT ALL ON TABLE "public"."user_gacha_items" TO "anon";
GRANT ALL ON TABLE "public"."user_gacha_items" TO "authenticated";
GRANT ALL ON TABLE "public"."user_gacha_items" TO "service_role";



GRANT ALL ON TABLE "public"."user_game_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_game_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_game_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_quest_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_quest_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_quest_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_rewards" TO "anon";
GRANT ALL ON TABLE "public"."user_rewards" TO "authenticated";
GRANT ALL ON TABLE "public"."user_rewards" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
