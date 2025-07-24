import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";

export const TopResellersWidgetSkeleton: React.FC = () => {
  return (
    <Card className="p-4 animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </CardHeader>
      <CardBody className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
