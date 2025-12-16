// Utility functions for blocks manager
import { BlocksModel, BlocksByCategory } from "@/types/block/Blocks";
import { BlockConfig } from "../../../../types/editor";

export const groupBlocksByCategory = (blocks: BlockConfig[]): BlocksByCategory => {
  return blocks.reduce((acc: BlocksByCategory, block) => {
    const category = block.category || "Basic";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(block);
    return acc;
  }, {} as BlocksByCategory);
};

// Helper function to get unique categories
export const getCategories = (blocksByCategory: Record<string, unknown[]>) => {
  return [
    "all",
    "favorites",
    "recent",
    ...Object.keys(blocksByCategory).sort(),
  ];
};

// Helper function to filter blocks
export const filterBlocks = (
  blocks: unknown[],
  searchTerm: string,
  activeCategory: string,
  favoritesList: string[],
  recentBlocksList: string[]
) => {
  return blocks.filter((block) => {
    if (typeof block !== 'object' || block === null) return false;
    const b = block as { id?: string; label?: string; category?: string; description?: string };
    const matchesSearch =
      (b.label && b.label.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeCategory === "all") {
      return matchesSearch;
    } else if (activeCategory === "favorites") {
      return matchesSearch && b.id !== undefined && favoritesList.includes(b.id);
    } else if (activeCategory === "recent") {
      return matchesSearch && b.id !== undefined && recentBlocksList.includes(b.id);
    } else {
      return matchesSearch && b.category === activeCategory;
    }
  });
};
