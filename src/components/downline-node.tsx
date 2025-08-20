import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Downline } from "@/types";
import { apiClient } from "@/api/axios";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Chip, type ChipProps } from "@heroui/chip";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import cn from "clsx";

const fetchChildren = async (uplineKode: string): Promise<Downline[]> => {
  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`);
  return data.data;
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  Aktif: "success",
  Nonaktif: "default",
  Suspend: "danger",
};
const getDownlineStatus = (downline: Downline): string => {
  if (downline.suspend) return "Suspend";
  if (downline.aktif) return "Aktif";
  return "Nonaktif";
};

interface DownlineNodeProps {
  downline: Downline;
  level: number;
}

export const DownlineNode: React.FC<DownlineNodeProps> = ({
  downline,
  level,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: children, isLoading } = useQuery({
    queryKey: ["downlineChildren", downline.kode],
    queryFn: () => fetchChildren(downline.kode),
    enabled: isExpanded,
    staleTime: 5 * 60 * 1000,
  });

  const hasChildren = downline.total_downline > 0;

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

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="font-bold">{downline.nama}</p>
                <p className="text-sm text-default-500">{downline.kode}</p>
              </div>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(downline.saldo)}
              </p>
              <Chip
                color={statusColorMap[getDownlineStatus(downline)]}
                size="sm"
                variant="flat"
              >
                {getDownlineStatus(downline)}
              </Chip>
              <p className="text-sm text-default-500">
                Group: {downline.kode_level}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {isExpanded && (
        <div className="pl-6 border-l-2 border-default-200">
          {isLoading && <Spinner className="ml-4 my-2" size="sm" />}
          {children &&
            children.map((child) => (
              <DownlineNode
                key={child.kode}
                downline={child}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
};
