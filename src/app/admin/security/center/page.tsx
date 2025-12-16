import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Center | Dzinly Admin",
  description: "Monitor and manage your website security",
};

export default function SecurityCenterPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Center</h2>
          <p className="text-muted-foreground">
            Monitor and manage your website security and threats
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Run Security Scan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95/100</div>
            <p className="text-xs text-muted-foreground">
              Excellent security rating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Valid until Dec 2024
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firewall</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Enabled</div>
            <p className="text-xs text-muted-foreground">
              All rules active
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>
              Current security status and recent activities
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              {[
                {
                  title: "SSL Certificate",
                  description: "Valid and properly configured",
                  status: "secure",
                  icon: Lock,
                },
                {
                  title: "Firewall Protection",
                  description: "Active with 15 rules configured",
                  status: "secure",
                  icon: Zap,
                },
                {
                  title: "Malware Scanner",
                  description: "Last scan: 2 hours ago - Clean",
                  status: "secure",
                  icon: Shield,
                },
                {
                  title: "Failed Login Attempts",
                  description: "3 attempts blocked in last 24h",
                  status: "warning",
                  icon: AlertTriangle,
                },
                {
                  title: "Two-Factor Authentication",
                  description: "Enabled for admin accounts",
                  status: "secure",
                  icon: CheckCircle,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={
                      item.status === "secure" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Security Actions</CardTitle>
            <CardDescription>
              Quick security management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Run Full Scan
            </Button>
            <Button variant="outline" className="justify-start">
              <Eye className="mr-2 h-4 w-4" />
              View Access Logs
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="mr-2 h-4 w-4" />
              Firewall Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Lock className="mr-2 h-4 w-4" />
              SSL Management
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}