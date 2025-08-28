import { DownlineNode } from "@/components/downline-node";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody } from "@heroui/card";
import { useDownlineTree } from "@/hooks/useDownlineTree";

export default function DownlineTreePage() {
  const { data: downlineTree, isLoading, error } = useDownlineTree();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner label="Memuat data jaringan..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <CardBody>
          <p className="text-danger-700">
            {error?.message?.trim() ? error.message : "Gagal memuat data"}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {downlineTree && <DownlineNode downline={downlineTree} level={0} />}
    </div>
  );
}
