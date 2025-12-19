import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ✅ FIX 1: Import ALL Dropdown parts
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { AccountSetting } from "./AccountSetting";


export default function Dropdowns() {
  // ✅ FIX 2: Define State inside the component
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ✅ FIX 3: Define 'user' and 'handleSignOut' (or fetch them from your auth store)
  const user = { name: "Vijendra", email: "vijendra@example.com" }; 
  const handleSignOut = () => console.log("Signing out...");

  return (
    <>
      <AccountSetting
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 h-9 w-9 rounded-full border bg-muted/20">
            <Avatar className="w-full">
              <AvatarFallback className="text-primary font-bold rounded-full">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        {/* ✅ FIX 4: DropdownMenuContent is now imported correctly */}
        <DropdownMenuContent align="end" className="w-92">
          <DropdownMenuLabel>
            {user?.name || "User"}
            <div className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>Profile</DropdownMenuItem>

          {/* ✅ FIX 5: Typed the event 'e' to fix the implicit any error */}
          <DropdownMenuItem 
            onSelect={(e: Event) => {
              e.preventDefault(); 
              setIsSettingsOpen(true);
            }}
          >
            Account settings
          </DropdownMenuItem>
            
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive focus:text-destructive"
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}