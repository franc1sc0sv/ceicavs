-- AlterTable
ALTER TABLE "tools" ADD COLUMN "slug" TEXT;

-- Backfill slug from name for any existing rows (normalize: lowercase, spaces to hyphens)
UPDATE "tools" SET "slug" = lower(regexp_replace(name, '\s+', '-', 'g')) WHERE "slug" IS NULL;

-- SetNotNull
ALTER TABLE "tools" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tools_slug_key" ON "tools"("slug");
