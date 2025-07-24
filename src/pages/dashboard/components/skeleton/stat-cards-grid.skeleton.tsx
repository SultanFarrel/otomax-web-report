import React from "react";
import { Card, CardBody } from "@heroui/card";

export const StatCardsGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardBody className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
