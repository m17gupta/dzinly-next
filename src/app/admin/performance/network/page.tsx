import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Network | Dzinly Admin",
  description: "Manage network settings and configuration",
};

export default function NetworkPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Network</h2>
          <p className="text-muted-foreground">
            Manage network settings and configuration
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Management</CardTitle>
          <CardDescription>
            This section is under development. More features coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The network management interface will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
