import React from "react";

import { Pagination } from "@heroui/pagination";

interface TransactionTableBottomContentProps {
  page: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BottomContent: React.FC<TransactionTableBottomContentProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="py-2 px-2 flex justify-center items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={totalPages || 1}
        onChange={onPageChange}
      />
    </div>
  );
};

export const TransactionTableBottomContent = React.memo(BottomContent);
