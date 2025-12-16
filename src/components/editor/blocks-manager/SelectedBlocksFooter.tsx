import { Button } from "@/components/ui/button";
import React from "react";

export interface SelectedBlocksFooterProps {
  selectedCount: number;
  onAddSelectedBlocks: () => void;
}

export function SelectedBlocksFooter({
  selectedCount,
  onAddSelectedBlocks,
}: SelectedBlocksFooterProps) {
  return (
    <div className="sticky bottom-0 p-3 mt-4 border-t bg-background">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {selectedCount} block(s) selected
        </span>
        <Button size="sm" onClick={onAddSelectedBlocks}>
          Add Selected Blocks
        </Button>
      </div>
    </div>
  );
}
