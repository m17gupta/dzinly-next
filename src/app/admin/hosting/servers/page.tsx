import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Activity, HardDrive, Cpu, MemoryStick, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Server Management | Dzinly Admin",
  description: "Manage your hosting servers and infrastructure",
};

export default function ServerManagementPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Server Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your hosting infrastructure
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Server
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23%</div>
            <p className="text-xs text-muted-foreground">
              Average across all servers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">
              8.2GB of 12GB used
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Server List</CardTitle>
            <CardDescription>
              Your active hosting servers and their current status
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              {[
                {
                  name: "Production Server",
                  location: "US East",
                  status: "online",
                  cpu: "45%",
                  memory: "78%",
                  disk: "34%",
                },
                {
                  name: "Staging Server",
                  location: "US West",
                  status: "online",
                  cpu: "12%",
                  memory: "45%",
                  disk: "23%",
                },
                {
                  name: "Development Server",
                  location: "EU Central",
                  status: "online",
                  cpu: "8%",
                  memory: "32%",
                  disk: "18%",
                },
              ].map((server, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <Server className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {server.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {server.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        CPU: {server.cpu} | RAM: {server.memory} | Disk: {server.disk}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {server.status}
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
              Common server management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <Activity className="mr-2 h-4 w-4" />
              Monitor Performance
            </Button>
            <Button variant="outline" className="justify-start">
              <HardDrive className="mr-2 h-4 w-4" />
              Backup Servers
            </Button>
            <Button variant="outline" className="justify-start">
              <Server className="mr-2 h-4 w-4" />
              Server Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Cpu className="mr-2 h-4 w-4" />
              Resource Monitor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}