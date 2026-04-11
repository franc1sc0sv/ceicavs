-- CreateEnum
CREATE TYPE "SummaryStatus" AS ENUM ('none', 'generating', 'completed', 'failed');

-- AlterTable
ALTER TABLE "transcriptions" ADD COLUMN     "summary_status" "SummaryStatus" NOT NULL DEFAULT 'none';
