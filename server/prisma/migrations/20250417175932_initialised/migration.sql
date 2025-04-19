-- CreateEnum
CREATE TYPE "BookingCategory" AS ENUM ('EVENT', 'REGULAR', 'EXTRA', 'LABS');

-- CreateTable
CREATE TABLE "Building" (
    "buildingId" INTEGER NOT NULL,
    "floors" INTEGER,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("buildingId")
);

-- CreateTable
CREATE TABLE "Department" (
    "deptId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("deptId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" INTEGER NOT NULL,
    "deptId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL,
    "deptId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" INTEGER NOT NULL,
    "roomName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Booking" (
    "requestId" INTEGER NOT NULL,
    "category" "BookingCategory" NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "roomId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("buildingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Department"("deptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Department"("deptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("buildingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Booking"("requestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
