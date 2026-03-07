-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MakeupCategory" AS ENUM ('FACE', 'EYES', 'LIPS', 'CHEEKS', 'BROWS');

-- CreateEnum
CREATE TYPE "HairstyleCategory" AS ENUM ('CUT', 'UPDO', 'BRAID', 'COLOR', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "ArAssetType" AS ENUM ('MAKEUP_OVERLAY', 'FACE_MESH', 'HAIR_MODEL', 'ACCESSORY_MODEL');

-- CreateEnum
CREATE TYPE "FeaturedType" AS ENUM ('PRODUCT', 'LOOK', 'HAIRSTYLE', 'COLLECTION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "photo_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "skin_tone" TEXT,
    "skin_undertone" TEXT,
    "face_shape" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "makeup_products" (
    "id" TEXT NOT NULL,
    "category" "MakeupCategory" NOT NULL,
    "subcategory" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color_hex" TEXT,
    "color_name" TEXT,
    "finish" TEXT,
    "intensity" TEXT,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "makeup_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "makeup_looks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "style" TEXT NOT NULL,
    "occasion" TEXT,
    "difficulty" TEXT,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "makeup_looks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "look_products" (
    "id" TEXT NOT NULL,
    "look_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "look_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hairstyles" (
    "id" TEXT NOT NULL,
    "category" "HairstyleCategory" NOT NULL,
    "subcategory" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "length" TEXT,
    "texture" TEXT,
    "color_hex" TEXT,
    "color_name" TEXT,
    "image_url" TEXT,
    "thumbnail_url" TEXT,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hairstyles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT,
    "hairstyle_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "look_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "look_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "look_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_looks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "look_data" JSONB NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_looks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_looks" (
    "id" TEXT NOT NULL,
    "saved_look_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "share_code" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_looks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "entity_type" TEXT,
    "user_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_tone_recommendations" (
    "id" TEXT NOT NULL,
    "skin_tone" TEXT NOT NULL,
    "skin_undertone" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "match_score" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "notes" TEXT,

    CONSTRAINT "skin_tone_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_assets" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "hairstyle_id" TEXT,
    "asset_type" "ArAssetType" NOT NULL,
    "model_url" TEXT NOT NULL,
    "texture_url" TEXT,
    "thumbnail_url" TEXT,
    "anchor_point" TEXT,
    "blend_mode" TEXT,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "scale" JSONB,
    "offset" JSONB,
    "metadata" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "file_size_bytes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ar_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featured_items" (
    "id" TEXT NOT NULL,
    "type" "FeaturedType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "section" TEXT NOT NULL DEFAULT 'trending',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "featured_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_customer_id_key" ON "subscriptions"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "makeup_products_category_subcategory_idx" ON "makeup_products"("category", "subcategory");

-- CreateIndex
CREATE INDEX "makeup_products_tier_idx" ON "makeup_products"("tier");

-- CreateIndex
CREATE INDEX "makeup_looks_style_idx" ON "makeup_looks"("style");

-- CreateIndex
CREATE UNIQUE INDEX "look_products_look_id_product_id_key" ON "look_products"("look_id", "product_id");

-- CreateIndex
CREATE INDEX "hairstyles_category_subcategory_idx" ON "hairstyles"("category", "subcategory");

-- CreateIndex
CREATE INDEX "hairstyles_tier_idx" ON "hairstyles"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_product_id_key" ON "favorites"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_hairstyle_id_key" ON "favorites"("user_id", "hairstyle_id");

-- CreateIndex
CREATE INDEX "look_history_user_id_created_at_idx" ON "look_history"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "saved_looks_user_id_idx" ON "saved_looks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "shared_looks_share_code_key" ON "shared_looks"("share_code");

-- CreateIndex
CREATE INDEX "shared_looks_share_code_idx" ON "shared_looks"("share_code");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_entity_id_idx" ON "analytics_events"("event_type", "entity_id");

-- CreateIndex
CREATE INDEX "analytics_events_entity_type_created_at_idx" ON "analytics_events"("entity_type", "created_at");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE INDEX "device_tokens_user_id_idx" ON "device_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "skin_tone_recommendations_skin_tone_skin_undertone_product__key" ON "skin_tone_recommendations"("skin_tone", "skin_undertone", "product_id");

-- CreateIndex
CREATE INDEX "skin_tone_recommendations_skin_tone_skin_undertone_idx" ON "skin_tone_recommendations"("skin_tone", "skin_undertone");

-- CreateIndex
CREATE INDEX "ar_assets_product_id_idx" ON "ar_assets"("product_id");

-- CreateIndex
CREATE INDEX "ar_assets_hairstyle_id_idx" ON "ar_assets"("hairstyle_id");

-- CreateIndex
CREATE INDEX "ar_assets_asset_type_idx" ON "ar_assets"("asset_type");

-- CreateIndex
CREATE INDEX "featured_items_section_is_active_idx" ON "featured_items"("section", "is_active");

-- CreateIndex
CREATE INDEX "featured_items_type_idx" ON "featured_items"("type");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "look_products" ADD CONSTRAINT "look_products_look_id_fkey" FOREIGN KEY ("look_id") REFERENCES "makeup_looks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "look_products" ADD CONSTRAINT "look_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "makeup_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "makeup_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_hairstyle_id_fkey" FOREIGN KEY ("hairstyle_id") REFERENCES "hairstyles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "look_history" ADD CONSTRAINT "look_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_looks" ADD CONSTRAINT "saved_looks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_looks" ADD CONSTRAINT "shared_looks_saved_look_id_fkey" FOREIGN KEY ("saved_look_id") REFERENCES "saved_looks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_looks" ADD CONSTRAINT "shared_looks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
