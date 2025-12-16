import React from "react";
import { Button } from "@/components/ui/button";

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
// You may need to import getBlockIcon from its source
import { getBlockIcon } from "./blocks-manager";
import { BlocksModel } from "@/types/block/Blocks";
import { BlockConfig } from "../../../../types/editor";

interface BlockListItemProps {
  block: BlockConfig;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleSelection: (blockId: string, event: React.MouseEvent) => void;
  onToggleFavorite: (blockId: string, event: React.MouseEvent) => void;
}

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
const BlockListItem: React.FC<BlockListItemProps> = ({
  block,
  isSelected,
  isFavorite,
  onToggleSelection,
  onToggleFavorite,
}) => {
  return (
    <div
      className={`flex items-center p-2 rounded-md cursor-pointer group ${
        isSelected ? "bg-accent" : "hover:bg-accent"
      }`}
      onClick={(e) => onToggleSelection(block?.id??"", e)}
    >
      <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-muted">
        {block.id && getBlockIcon(block.id as keyof typeof blockIcons)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{block.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
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
        <span className="block text-xs truncate text-muted-foreground">
          {block.category || "Basic"}
        </span>
      </div>
    </div>
  );
};

export default BlockListItem;
