import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Email | Dzinly Admin",
  description: "Manage email settings and configuration",
};

export default function EmailPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email</h2>
          <p className="text-muted-foreground">
            Manage email settings and configuration
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Management</CardTitle>
          <CardDescription>
            This section is under development. More features coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The email management interface will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
