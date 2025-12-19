import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Globe,
  CreditCard,
  Activity,
  Blocks,
  Webhook,
  Download,
  Shield,
  Upload,
  Check,
} from "lucide-react";
import { useState, useRef } from "react";
interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSetting({ open, onOpenChange }: AccountSettingsProps) {
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none  p-0 w-[80%" style={{minWidth:"1020px", height:"80vh"}} >
        <DialogTitle className="sr-only">Account Settings</DialogTitle>
        {/* Main Tabs Container */}
        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="flex h-full w-full flex-col md:flex-row"
        >
          {/* LEFT SIDEBAR */}
          <aside className="w-full md:w-64 bg-muted/20 border-r h-full overflow-y-auto p-4 flex-shrink-0">
            <div className="mb-6 px-2 w-28">
              <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your preferences</p>
            </div>

            {/* Tab Triggers (Navigation) */}
            <TabsList className="flex flex-col h-auto bg-transparent items-stretch space-y-1 p-0">
              <TabsTrigger
                value="general"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <User size={16} /> General
              </TabsTrigger>

              <TabsTrigger
                value="domain"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Globe size={16} /> Domain & DNS
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <CreditCard size={16} /> Billing & Plans
              </TabsTrigger>

              <TabsTrigger
                value="usage"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Activity size={16} /> Usage & Limits
              </TabsTrigger>

              <TabsTrigger
                value="integrations"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Blocks size={16} /> Integrations
              </TabsTrigger>

              <TabsTrigger
                value="security"
                className="justify-start gap-2 px-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Shield size={16} /> Security
              </TabsTrigger>
            </TabsList>
          </aside> 

          {/* RIGHT CONTENT AREA */}
          <main className="flex-1 h-full overflow-y-auto bg-background p-6 md:p-10">

            {/* 1. GENERAL TAB */}
        <TabsContent value="general" className="mt-0 space-y-8">
          {/* HEADER */}
          <div>
            <h3 className="text-lg font-medium">General</h3>
            <p className="text-sm text-muted-foreground">
              Manage your basic account details.
            </p>
          </div>

          <Separator />

          {/* LOGO UPLOAD */}
      <div className="space-y-3">
  <Label>Logo</Label>

  <div className="flex items-center gap-5">
    {/* PREVIEW */}
    <div className="h-24 w-24 rounded-xl border bg-muted flex items-center justify-center overflow-hidden">
      {logo ? (
        <img
          src={logo}
          alt="Logo"
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-xs text-muted-foreground">
          No Logo
        </span>
      )}
    </div>

    {/* HIDDEN INPUT */}
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setLogo(previewUrl);
      }}
    />

    {/* UPLOAD BUTTON */}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => fileRef.current?.click()}
    >
      Upload Logo
    </Button>
  </div>

  <p className="text-xs text-muted-foreground">
    PNG, JPG, JPEG (max 2MB)
  </p>
</div>


          <Separator />

          {/* BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Company name" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="support@company.com" />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" placeholder="+91 98765 43210" />
            </div>
          </div>

          <Separator />

          {/* COLOR THEME */}
          <div className="space-y-3">
            <Label>Color Theme</Label>

            <div className="flex items-center gap-4">
              {[
                "bg-zinc-900",
                "bg-blue-600",
                "bg-violet-600",
                "bg-emerald-600",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`h-9 w-9 rounded-full ${color} cursor-pointer hover:ring-2 ring-offset-2`}
                />
              ))}
            </div>
          </div>
        </TabsContent>



            {/* 2. DOMAIN TAB */}
            <TabsContent value="domain" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Domain & DNS</h3>
                <p className="text-sm text-muted-foreground">Manage your custom domains.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Custom Domain</Label>
                    <Input placeholder="app.yourcompany.com" />
                  </div>
                  <Button>Verify</Button>
                </div>
                <div className="rounded-md border p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CNAME Record</span>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block">cname.dzinly.org</code>
                </div>
              </div>
            </TabsContent>

            {/* 3. BILLING TAB */}
            <TabsContent value="billing" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Billing</h3>
                <p className="text-sm text-muted-foreground">Manage your subscription.</p>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold">Current Plan</h3>
                  <div className="text-2xl font-bold mt-4">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <Button className="w-full mt-4">Upgrade Plan</Button>
                </div>
              </div>
            </TabsContent>

            {/* 4. USAGE TAB */}
            <TabsContent value="usage" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Usage</h3>
                <p className="text-sm text-muted-foreground">Monitor resource limits.</p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="font-medium">Storage</span><span>4.2 / 10 GB</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary w-[42%]" /></div>
                </div>
              </div>
            </TabsContent>

            {/* 5. INTEGRATIONS TAB */}
            <TabsContent value="integrations" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Integrations</h3>
                <p className="text-sm text-muted-foreground">Connect third-party tools.</p>
              </div>
              <Separator />
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center font-bold">S</div>
                    <div><p className="font-medium">Slack</p></div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>

            {/* 6. SECURITY TAB */}
            <TabsContent value="security" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">Manage password and 2FA.</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">Secure your account with an authenticator app.</p>
                </div>
                <Switch />
              </div>
            </TabsContent>

          </main>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}