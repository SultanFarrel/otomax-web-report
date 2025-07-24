import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";

export const TransactionsByProductChartSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <CardHeader className="flex items-center justify-between">
        {/* Skeleton untuk Judul */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

        {/* Skeleton untuk Tombol Dropdown */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        {/* Skeleton untuk Area Chart */}
        <div className="h-48 w-48 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        {/* Skeleton untuk Legend */}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4 w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
        </div>
      </CardBody>
    </Card>
  );
};
