-- DropConstraint
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_post_id_user_id_key";

-- AlterTable
ALTER TABLE "reactions" ADD COLUMN     "comment_id" TEXT,
ALTER COLUMN "post_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "reactions_comment_id_idx" ON "reactions"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_post_id_user_id_emoji_key" ON "reactions"("post_id", "user_id", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_comment_id_user_id_emoji_key" ON "reactions"("comment_id", "user_id", "emoji");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
