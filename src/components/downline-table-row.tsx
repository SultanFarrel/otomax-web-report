import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Downline } from "@/types";
import apiClient from "@/api/axios";
import { Spinner } from "@heroui/spinner";
import { Chip, type ChipProps } from "@heroui/chip";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import cn from "clsx";

// Fungsi untuk mengambil anak dari sebuah downline
const fetchChildren = async (uplineKode: string): Promise<Downline[]> => {
  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`);
  return data.data;
};

// Helper untuk status
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

interface DownlineRowProps {
  downline: Downline;
  level: number;
}

export const DownlineTableRow: React.FC<DownlineRowProps> = ({
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

  return (
    <>
      {/* Baris Tabel Palsu */}
      <div className="grid grid-cols-8 gap-4 px-6 py-4 border-b border-default-200 text-sm">
        {/* Kolom Nama dengan Indentasi dan Tombol Expand */}
        <div
          style={{ paddingLeft: `${level * 24}px` }}
          className="flex items-center gap-3 col-span-2"
        >
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-default-200"
            >
              <ChevronRightIcon
                className={cn("h-4 w-4 transition-transform text-default-500", {
                  "rotate-90": isExpanded,
                })}
              />
            </button>
          ) : (
            <div className="w-6 flex-shrink-0" /> // Placeholder untuk alignment
          )}
          <span className="truncate" title={downline.nama}>
            {downline.nama}
          </span>
        </div>

        {/* Kolom lainnya */}
        <div className="truncate" title={downline.kode}>
          {downline.kode}
        </div>
        <div className="text-right">
          {new Intl.NumberFormat("id-ID").format(downline.saldo)}
        </div>
        <div className="truncate" title={downline.alamat}>
          {downline.alamat}
        </div>
        <div>{downline.kode_level}</div>
        <div>
          <Chip
            color={statusColorMap[getDownlineStatus(downline)]}
            size="sm"
            variant="flat"
          >
            {getDownlineStatus(downline)}
          </Chip>
        </div>
        <div className="truncate" title={downline.keterangan || ""}>
          {downline.keterangan || "-"}
        </div>
      </div>

      {/* Baris Anak (Rekursif) */}
      {isExpanded && (
        <>
          {isLoading && (
            <div className="p-4 text-center">
              <Spinner size="sm" />
            </div>
          )}
          {children &&
            children.map((child) => (
              <DownlineTableRow
                key={child.kode}
                downline={child}
                level={level + 1}
              />
            ))}
        </>
      )}
    </>
  );
};
