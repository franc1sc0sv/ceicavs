-- DropForeignKey
ALTER TABLE "recordings" DROP CONSTRAINT "recordings_folder_id_fkey";

-- AlterTable
ALTER TABLE "recordings" ADD COLUMN     "cloudinary_public_id" TEXT,
ALTER COLUMN "folder_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transcriptions" ADD COLUMN     "segments" JSONB;

-- CreateIndex
CREATE INDEX "recordings_user_id_idx" ON "recordings"("user_id");

-- AddForeignKey
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
