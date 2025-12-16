import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ip-blocking | Dzinly Admin",
  description: "Manage ip-blocking settings and configuration",
};

export default function IpblockingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ip-blocking</h2>
          <p className="text-muted-foreground">
            Manage ip-blocking settings and configuration
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ip-blocking Management</CardTitle>
          <CardDescription>
            This section is under development. More features coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The ip-blocking management interface will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
