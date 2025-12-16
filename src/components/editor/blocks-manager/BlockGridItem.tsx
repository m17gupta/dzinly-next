import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlignCenter,
  Clock,
  Filter,
  Grid2X2,
  Grid3X3,
  Image,
  Layout,
  LinkIcon,
  MapPin,
  Search,
  Star,
  Type,
  Video,
} from "lucide-react";
import React from "react";

import { BlocksModel } from "@/types/block/Blocks";
import { BlockConfig } from "../../../../types/editor";


// Block icons mapping
  const blockIcons = {
  section: <Layout className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  link: <LinkIcon className="w-4 h-4" />,
  map: <MapPin className="w-4 h-4" />,
  column1: <AlignCenter className="w-4 h-4" />,
  column2: <Grid2X2 className="w-4 h-4" />,
  column3: <Grid3X3 className="w-4 h-4" />,
};
// Helper function to get icon for any block id
export const getBlockIcon = (blockId: keyof typeof blockIcons) => {
  return blockIcons[blockId] || <Layout className="w-4 h-4" />;
};
export interface BlockGridItemProps {
  block:BlockConfig;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleSelection: (blockId: string, event: React.MouseEvent) => void;
  onToggleFavorite: (blockId: string, event: React.MouseEvent) => void;
}

export function BlockGridItem({
  block,
  isSelected,
  isFavorite,
  onToggleSelection,
  onToggleFavorite,
}: BlockGridItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors relative group ${
        isSelected ? "border-2 border-primary" : "hover:border-primary"
      }`}
      onClick={(e) => onToggleSelection(block.id??"", e)}
    >
      <CardContent className="flex flex-col items-center justify-center p-3 text-center">
        <div className="absolute z-10 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-muted"
            onClick={(e) => onToggleFavorite(block.id??"", e)}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
        <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-muted">
          {block.id && getBlockIcon(block.id as keyof typeof blockIcons)}
        </div>
        <span className="text-sm font-medium">{block.label}</span>
        <span className="mt-1 text-xs text-muted-foreground">
          {block.category || "Basic"}
        </span>
        {/* {block.premium && (
          <Badge
            variant="outline"
            className="mt-2 text-white border-0 bg-gradient-to-r from-amber-500 to-amber-300"
          >
            Premium
          </Badge>
        )} */}
      </CardContent>
    </Card>
  );
}

