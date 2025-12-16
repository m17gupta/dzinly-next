import React from "react";

export function FilterOptionsDropdown() {
  return (
    <div className="absolute right-0 z-10 w-48 p-2 mt-1 border rounded-md shadow-md bg-popover text-popover-foreground">
      <div className="mb-2 text-xs font-medium">Sort By</div>
      <div className="space-y-1">
        <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
          <input type="radio" id="sort-name" name="sort" className="mr-2" />
          <label htmlFor="sort-name" className="text-xs cursor-pointer">
            Name
          </label>
        </div>
        <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
          <input type="radio" id="sort-category" name="sort" className="mr-2" />
          <label htmlFor="sort-category" className="text-xs cursor-pointer">
            Category
          </label>
        </div>
        <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
          <input
            type="radio"
            id="sort-recent"
            name="sort"
            className="mr-2"
            defaultChecked
          />
          <label htmlFor="sort-recent" className="text-xs cursor-pointer">
            Recently Used
          </label>
        </div>
      </div>
    </div>
  );
}
