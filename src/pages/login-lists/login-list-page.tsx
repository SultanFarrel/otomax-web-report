import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs"; // Asumsi Anda memiliki komponen Tabs
import { SessionList } from "@/pages/settings/components/session-list";

export default function LoginListPage() {
  return (
    <div className="flex flex-col w-full">
      <Tabs aria-label="Login Lists">
        <Tab key="agen" title="List Login Agen">
          <Card>
            <CardBody>
              {/* Kita akan gunakan kembali SessionList dengan prop */}
              <SessionList isAdminView={true} sessionType="user" />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="admin" title="List Login Admin">
          <Card>
            <CardBody>
              <SessionList isAdminView={true} sessionType="admin" />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

// Catatan: Jika Anda tidak memiliki komponen Tabs, Anda bisa menggunakan
// dua Card terpisah dengan judul h2 untuk sementara.
