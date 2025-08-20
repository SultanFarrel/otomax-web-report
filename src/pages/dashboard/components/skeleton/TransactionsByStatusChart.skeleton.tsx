import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card"; // Pastikan path impor benar

export const TransactionsByStatusChartSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <CardHeader className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </CardHeader>
      <CardBody>
        <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </CardBody>
    </Card>
  );
};
