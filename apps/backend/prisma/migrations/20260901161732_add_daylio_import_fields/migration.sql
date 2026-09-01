-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "daylio_id" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "daylio_id" INTEGER;

-- AlterTable
ALTER TABLE "moods" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "daylio_id" INTEGER,
ADD COLUMN     "mood_group_id" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "color" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "activities_daylio_id_key" ON "activities"("daylio_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_daylio_id_key" ON "groups"("daylio_id");

-- CreateIndex
CREATE UNIQUE INDEX "moods_daylio_id_key" ON "moods"("daylio_id");
