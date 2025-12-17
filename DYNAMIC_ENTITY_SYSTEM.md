# Dynamic Entity System

## Overview
This system provides a dynamic, scalable approach to managing entities (category, brand, attribute, etc.) with a single API route and page component instead of duplicating code for each entity.

## File Structure

```
src/
├── lib/
│   └── entities/
│       └── entityConfig.ts          # Entity operations registry
├── components/
│   └── admin/
│       └── EntityRegistry.tsx       # Entity component registry
├── app/
│   ├── admin/
│   │   └── [entity]/
│   │       └── page.tsx             # Dynamic entity page
│   └── api/
│       └── admin/
│           └── [entity]/
│               └── route.ts         # Dynamic API routes
```

## How It Works

### 1. Entity Configuration (`src/lib/entities/entityConfig.ts`)

This file centralizes all entity operations (CRUD) in one place:

```typescript
export const entityConfig: Record<string, EntityOperations> = {
  category: {
    create: createCategory,
    list: listCategories,
    getById: getCategoryById,
    update: updateCategory,
    delete: deleteCategory,
  },
  brand: { /* ... */ },
  attribute: { /* ... */ },
};
```

**Benefits:**
- Single source of truth for entity operations
- Type-safe with TypeScript
- Easy to add new entities
- No code duplication

### 2. API Routes (`src/app/api/admin/[entity]/route.ts`)

All HTTP methods (GET, POST, PATCH, DELETE) are handled dynamically:

```typescript
export async function GET(req: NextRequest, ctx: any) {
  const { entity } = await ctx?.params ?? {};
  
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Unsupported entity" }, { status: 400 });
  }
  
  // Dynamic operation based on entity
  const items = await entityConfig[entity].list(websiteId);
  return NextResponse.json({ items });
}
```

**Features:**
- Validates entity before processing
- Consistent error handling
- Supports query parameters (id, websiteId)
- Handles both single item and list requests

### 3. Entity Component Registry (`src/components/admin/EntityRegistry.tsx`)

Maps entity names to their React components:

```typescript
export const entityComponents: Record<string, React.ComponentType> = {
  category: CategoryHome,
  brand: BrandHome,
  attribute: AttributeHome,
};
```

### 4. Dynamic Page (`src/app/admin/[entity]/page.tsx`)

Renders the appropriate component based on the entity:

```typescript
const EntityComponent = entityComponents[entity];
return <EntityComponent />;
```

**Features:**
- Validates entity exists
- Shows error message for invalid entities
- Dynamically renders correct component
- No conditional logic needed

## Adding a New Entity

To add a new entity (e.g., "product"), follow these steps:

### Step 1: Create Entity Operations (in `src/lib/material/product.ts`)

```typescript
export async function createProduct(data: any) { /* ... */ }
export async function listProducts(websiteId: string) { /* ... */ }
export async function getProductById(id: string) { /* ... */ }
export async function updateProduct(id: string, data: any) { /* ... */ }
export async function deleteProduct(id: string) { /* ... */ }
```

### Step 2: Add to Entity Config (`src/lib/entities/entityConfig.ts`)

```typescript
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/material/product";

export const entityConfig: Record<string, EntityOperations> = {
  // ... existing entities
  product: {
    create: createProduct,
    list: listProducts,
    getById: getProductById,
    update: updateProduct,
    delete: deleteProduct,
  },
};
```

### Step 3: Create Entity Component (`src/components/admin/product/ProductHome.tsx`)

```typescript
"use client"
import React from "react";
import GetAllProduct from "./productList/GetAllProduct";
import ProductTable from "./productList/ProductTable";

const ProductHome = () => {
  return (
    <>
      <GetAllProduct />
      <ProductTable />
    </>
  );
};

export default ProductHome;
```

### Step 4: Register Component (`src/components/admin/EntityRegistry.tsx`)

```typescript
import ProductHome from "./product/ProductHome";

export const entityComponents: Record<string, React.ComponentType> = {
  // ... existing entities
  product: ProductHome,
};
```

### Step 5: Access Your New Entity

Navigate to: `/admin/product`

**That's it!** No changes needed to API routes or page components.

## API Endpoints

### GET `/api/admin/[entity]`
**Get all items:**
```
GET /api/admin/category?websiteId=123
```

**Get single item:**
```
GET /api/admin/category?id=abc123
```

### POST `/api/admin/[entity]`
**Create new item:**
```json
POST /api/admin/brand
{
  "name": "Nike",
  "logo": "https://...",
  "websiteId": "123"
}
```

### PATCH `/api/admin/[entity]`
**Update item:**
```json
PATCH /api/admin/attribute
{
  "id": "abc123",
  "name": "Updated Name"
}
```

### DELETE `/api/admin/[entity]`
**Delete item:**
```
DELETE /api/admin/category?id=abc123
```

## Type Safety

The system uses TypeScript for type safety:

```typescript
export interface EntityOperations {
  create: (data: any) => Promise<any>;
  list: (websiteId: string) => Promise<any>;
  getById: (id: string) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
}
```

For better type safety, you can make these more specific per entity.

## Error Handling

Both API and UI handle invalid entities gracefully:

**API Response:**
```json
{
  "error": "Unsupported entity: invalid-entity",
  "status": 400
}
```

**UI Display:**
```
Entity "invalid-entity" not found
Please check the entity name or add it to the EntityRegistry.
```

## Benefits of This Approach

1. **DRY (Don't Repeat Yourself):** No code duplication
2. **Scalability:** Easy to add new entities
3. **Maintainability:** Changes in one place affect all entities
4. **Type Safety:** TypeScript ensures correctness
5. **Consistency:** All entities follow the same pattern
6. **Reduced Bugs:** Less code means fewer potential bugs
7. **Clear Structure:** Easy for new developers to understand

## Migration Notes

### Before (Old Approach):
- 3 separate API routes or large switch statements
- 3 separate if-checks in page component
- Lots of duplicated code
- Hard to maintain consistency

### After (New Approach):
- 1 dynamic API route for all entities
- 1 dynamic page component
- Centralized configuration
- Easy to extend

## Future Enhancements

Consider adding:

1. **Entity Metadata:**
```typescript
export interface EntityMeta {
  label: string;
  icon: string;
  permissions: string[];
}
```

2. **Validation Schemas:**
```typescript
export const entityValidation = {
  category: categorySchema,
  brand: brandSchema,
};
```

3. **Custom Actions:**
```typescript
export const entityActions = {
  category: {
    bulkImport: importCategories,
    export: exportCategories,
  },
};
```

4. **Middleware:**
```typescript
export const entityMiddleware = {
  category: [authMiddleware, tenantMiddleware],
};
```

## Testing

Test with different entities:

```bash
# Test category
curl http://localhost:3000/api/admin/category

# Test brand
curl http://localhost:3000/api/admin/brand

# Test attribute
curl http://localhost:3000/api/admin/attribute

# Test invalid entity (should return 400)
curl http://localhost:3000/api/admin/invalid
```

## Conclusion

This dynamic entity system significantly reduces code duplication and makes your application more maintainable and scalable. Adding new entities is now a straightforward process that doesn't require touching core route handlers.
