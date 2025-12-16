import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Users, MailCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Email Accounts | Dzinly Admin",
  description: "Manage email accounts and mailboxes",
};

export default function EmailAccountsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Accounts</h2>
          <p className="text-muted-foreground">
            Manage email accounts and mailboxes for your domains
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <MailCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">
              1 suspended account
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4GB</div>
            <p className="text-xs text-muted-foreground">
              of 10GB total quota
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Quota warning
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Email Accounts</CardTitle>
            <CardDescription>
              Manage your email accounts and their settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              {[
                {
                  email: "admin@demo.local",
                  name: "Admin User",
                  status: "active",
                  storage: "450MB",
                  quota: "1GB",
                },
                {
                  email: "support@demo.local",
                  name: "Support Team",
                  status: "active",
                  storage: "1.2GB",
                  quota: "2GB",
                },
                {
                  email: "noreply@demo.local",
                  name: "No Reply",
                  status: "active",
                  storage: "12MB",
                  quota: "500MB",
                },
                {
                  email: "marketing@demo.local",
                  name: "Marketing Team",
                  status: "suspended",
                  storage: "800MB",
                  quota: "1GB",
                },
              ].map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {account.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {account.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {account.storage} of {account.quota}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        account.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {account.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common email management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Quotas
            </Button>
            <Button variant="outline" className="justify-start">
              <MailCheck className="mr-2 h-4 w-4" />
              Email Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}