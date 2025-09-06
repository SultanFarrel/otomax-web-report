import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { SessionList } from "@/pages/settings/components/session-list";

export default function LoginListPage() {
  return (
    <div className="flex flex-col w-full">
      <Tabs aria-label="Login Lists">
        <Tab key="agen" title="List Login Agen">
          <Card>
            <CardBody>
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
