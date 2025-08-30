import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductApiResponse, Product } from "@/types";
import { apiClient } from "@/api/axios";
import { SortDescriptor } from "@heroui/table";

export interface ProductFilters {
  search: string;
  status: string;
}

// Fungsi untuk mengubah data dari format [columns, rows] ke [objects]
const transformProductData = (apiData: any): Product[] => {
  if (!apiData || !apiData.columns || !apiData.rows) {
    return [];
  }

  const { columns, rows } = apiData;

  return rows.map((row: any[]) => {
    const productObject: { [key: string]: any } = {};
    columns.forEach((colName: string, index: number) => {
      productObject[colName] = row[index];
    });
    return productObject as Product;
  });
};

const fetchProducts = async ({
  filters,
}: {
  filters: ProductFilters;
}): Promise<ProductApiResponse> => {
  const endpoint = "/produk";

  const params: any = {
    search: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
  };

  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key] === "") && delete params[key]
  );

  const { data } = await apiClient.get(endpoint, { params });

  const transformedData = transformProductData(data.data);

  return {
    ...data,
    data: transformedData,
  };
};

export function useProducts() {
  const [pageSize, setPageSize] = useState(10);

  const initialFilters: ProductFilters = {
    search: "",
    status: "all",
  };

  const [page, setPage] = useState(1);
  const [inputFilters, setInputFilters] =
    useState<ProductFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<ProductFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery<ProductApiResponse, Error>({
    queryKey: ["products", submittedFilters],
    queryFn: () => fetchProducts({ filters: submittedFilters }),
    staleTime: Infinity,
  });

  // Logika sorting
  const sortedData = useMemo(() => {
    const data = response?.data || [];
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Product];
      const second = b[sortDescriptor.column as keyof Product];
      let cmp = 0;

      if (first! < second!) {
        cmp = -1;
      } else if (first! > second!) {
        cmp = 1;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
  }, [response?.data, sortDescriptor]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [page, pageSize, sortedData]);

  // Gunakan rowCount dari API untuk totalItems
  const totalItems = response?.rowCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (field: keyof ProductFilters, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const onSearchSubmit = useCallback(() => {
    setPage(1);
    if (JSON.stringify(inputFilters) === JSON.stringify(submittedFilters)) {
      refetch();
    } else {
      setSubmittedFilters(inputFilters);
    }
  }, [inputFilters, submittedFilters, refetch]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSortDescriptor({ column: "kode", direction: "ascending" });
    setPageSize(10);
    setSubmittedFilters(initialFilters);
  }, [initialFilters]);

  const dataForComponent = useMemo(
    () => ({
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
    }),
    [paginatedData, totalItems, totalPages, page]
  );

  return {
    data: dataForComponent,
    allData: sortedData,
    isLoading,
    isError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
