import React, { useState } from "react";
import { DownlineTree } from "@/types";
import { Card, CardBody } from "@heroui/card";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import cn from "clsx";

interface DownlineNodeProps {
  downline: DownlineTree;
  level: number;
}

export const DownlineNode: React.FC<DownlineNodeProps> = ({
  downline,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = downline.downline && downline.downline.length > 0;

  const handleToggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 20}px` }} className="my-2">
      <Card
        isPressable={hasChildren}
        onPress={handleToggleExpand}
        className={cn("mb-2 w-full", {
          "hover:bg-default-100": hasChildren,
        })}
        onClick={handleToggleExpand}
      >
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="w-6">
              {hasChildren && (
                <ChevronRightIcon
                  className={cn(
                    "h-5 w-5 transition-transform text-default-500",
                    {
                      "rotate-90": isExpanded,
                    }
                  )}
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-bold">{downline.nama}</p>
              <p className="text-sm text-default-500">{downline.kode}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {isExpanded && hasChildren && (
        <div className="pl-6 border-l-2 border-default-200">
          {downline.downline.map((child) => (
            <DownlineNode key={child.kode} downline={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
