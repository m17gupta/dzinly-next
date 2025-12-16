import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Star, Clock } from "lucide-react";
import React from "react";

export interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  setActiveCategory,
}: CategoryTabsProps) {
  return (
    <Tabs
      defaultValue="all"
      value={activeCategory}
      onValueChange={setActiveCategory}
    >
      <div className="mb-4 overflow-x-auto">
        <TabsList className="inline-flex w-auto p-1 h-9 bg-muted/50">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-3 py-1.5 text-xs whitespace-nowrap flex items-center gap-1"
            >
              {category === "all" ? (
                <>
                  <Layout className="w-3 h-3" />
                  <span>All Blocks</span>
                </>
              ) : category === "favorites" ? (
                <>
                  <Star className="w-3 h-3" />
                  <span>Favorites</span>
                </>
              ) : category === "recent" ? (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Recent</span>
                </>
              ) : (
                <span className="capitalize">{category}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
