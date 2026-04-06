-- Drop old unique constraint on reactions (postId + userId + emoji)
DROP INDEX IF EXISTS "reactions_post_id_user_id_emoji_key";

-- Change emoji column from EmojiReaction enum to TEXT with cast
ALTER TABLE "reactions" ALTER COLUMN "emoji" TYPE TEXT USING "emoji"::TEXT;

-- Add new unique constraint on reactions (postId + userId only — one reaction per user per post)
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_post_id_user_id_key" UNIQUE ("post_id", "user_id");

-- Drop the EmojiReaction enum type
DROP TYPE IF EXISTS "EmojiReaction";

-- CreateTable post_images
CREATE TABLE "post_images" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_images_post_id_idx" ON "post_images"("post_id");

-- CreateIndex for cursor pagination on comments
CREATE INDEX "comments_post_id_parent_id_created_at_idx" ON "comments"("post_id", "parent_id", "created_at");

-- AddForeignKey
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
