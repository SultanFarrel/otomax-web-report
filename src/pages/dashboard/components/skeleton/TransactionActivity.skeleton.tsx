import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";

export const TransactionActivitySkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex border-b border-default-200 w-full">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/4 rounded-t-md mr-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/4 rounded-t-md"></div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4 px-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
