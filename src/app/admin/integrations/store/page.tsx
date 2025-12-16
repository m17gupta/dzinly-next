import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Download, Star, Puzzle, ExternalLink, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "App Store | Dzinly Admin",
  description: "Browse and install apps and integrations",
};

export default function AppStorePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">App Store</h2>
          <p className="text-muted-foreground">
            Discover and install apps to extend your website functionality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Browse Categories
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Installed Apps</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              2 updates available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Apps</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Puzzle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              All categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "Google Analytics",
            description: "Track website visitors and analyze traffic patterns",
            category: "Analytics",
            rating: 4.9,
            installs: "10K+",
            status: "installed",
            icon: "📊",
          },
          {
            name: "Stripe Payments",
            description: "Accept online payments with Stripe integration",
            category: "E-commerce",
            rating: 4.8,
            installs: "5K+",
            status: "available",
            icon: "💳",
          },
          {
            name: "Mailchimp",
            description: "Email marketing and newsletter management",
            category: "Marketing",
            rating: 4.7,
            installs: "8K+",
            status: "installed",
            icon: "📧",
          },
          {
            name: "Slack Notifications",
            description: "Send website notifications to Slack channels",
            category: "Communication",
            rating: 4.6,
            installs: "3K+",
            status: "available",
            icon: "💬",
          },
          {
            name: "SEO Optimizer",
            description: "Optimize your website for search engines",
            category: "SEO",
            rating: 4.9,
            installs: "12K+",
            status: "available",
            icon: "🔍",
          },
          {
            name: "Social Media Feed",
            description: "Display social media posts on your website",
            category: "Social",
            rating: 4.5,
            installs: "6K+",
            status: "installed",
            icon: "📱",
          },
        ].map((app, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <CardDescription>{app.category}</CardDescription>
                </div>
                <Badge 
                  variant="secondary" 
                  className={
                    app.status === "installed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {app.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{app.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {app.installs} installs
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant={app.status === "installed" ? "outline" : "default"}
                >
                  {app.status === "installed" ? (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Configure
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Install
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}