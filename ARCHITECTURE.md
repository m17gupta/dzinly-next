# Dynamic Entity System Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Request                            │
│              /admin/category or /admin/brand                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           src/app/admin/[entity]/page.tsx                    │
│                   (Dynamic Page)                             │
│                                                              │
│  1. Validates entity via EntityRegistry                      │
│  2. Dynamically selects component                           │
│  3. Renders: <EntityComponent />                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│       src/components/admin/EntityRegistry.tsx                │
│                                                              │
│  entityComponents = {                                        │
│    category: CategoryHome,    ◄── Component Mapping         │
│    brand: BrandHome,                                         │
│    attribute: AttributeHome,                                 │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                      API Request                             │
│    GET/POST/PATCH/DELETE /api/admin/[entity]                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         src/app/api/admin/[entity]/route.ts                  │
│                   (Dynamic API)                              │
│                                                              │
│  1. Validates entity                                         │
│  2. Gets operations from entityConfig                        │
│  3. Executes: entityConfig[entity].create(data)             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          src/lib/entities/entityConfig.ts                    │
│                                                              │
│  entityConfig = {                                            │
│    category: {                                               │
│      create: createCategory,      ◄── CRUD Operations       │
│      list: listCategories,                                   │
│      getById: getCategoryById,                               │
│      update: updateCategory,                                 │
│      delete: deleteCategory,                                 │
│    },                                                        │
│    brand: { ... },                                           │
│    attribute: { ... },                                       │
│  }                                                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              src/lib/material/*.ts                           │
│         (Actual Database Operations)                         │
│                                                              │
│  • category.ts    ◄── MongoDB operations                    │
│  • product_brand.ts                                          │
│  • product_attribute.ts                                      │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Frontend Request Flow
```
User visits /admin/category
    │
    ▼
page.tsx checks EntityRegistry
    │
    ├─► Valid? → Render CategoryHome
    │
    └─► Invalid? → Show error message
```

### API Request Flow
```
POST /api/admin/category
    │
    ▼
route.ts validates entity
    │
    ├─► Valid?
    │    │
    │    ▼
    │   Get entityConfig[category]
    │    │
    │    ▼
    │   Execute entityConfig[category].create(data)
    │    │
    │    ▼
    │   Return response
    │
    └─► Invalid? → Return 400 error
```

## 📦 Component Structure

```
src/
├── app/
│   ├── admin/
│   │   └── [entity]/
│   │       └── page.tsx ━━━━━━━━┓
│   │                             ┃
│   └── api/                      ┃
│       └── admin/                ┃
│           └── [entity]/         ┃
│               └── route.ts ━━━┓ ┃
│                               ┃ ┃
├── components/                 ┃ ┃
│   └── admin/                  ┃ ┃
│       ├── EntityRegistry.tsx ◄┛ ┃  (Links to page.tsx)
│       ├── category/             ┃
│       ├── brand/                ┃
│       └── attribute/            ┃
│                                 ┃
└── lib/                          ┃
    └── entities/                 ┃
        └── entityConfig.ts ◄━━━━━┛  (Links to route.ts)
```

## 🎯 Key Components

### 1. Entity Config (Backend)
```typescript
entityConfig = {
  [entity]: {
    create    → POST
    list      → GET (no id)
    getById   → GET (with id)
    update    → PATCH
    delete    → DELETE
  }
}
```

### 2. Entity Registry (Frontend)
```typescript
entityComponents = {
  [entity]: ComponentName
}
```

### 3. Dynamic Route (API)
```typescript
if (isValidEntity(entity)) {
  result = entityConfig[entity][operation](data)
}
```

### 4. Dynamic Page (UI)
```typescript
if (isValidEntityComponent(entity)) {
  <EntityComponent />
}
```

## 🔐 Type Safety Flow

```
User Input (entity: string)
    │
    ▼
isValidEntity() checks entityConfig
    │
    ├─► true: TypeScript knows entity is keyof entityConfig
    │         Safe to access entityConfig[entity]
    │
    └─► false: Return error, prevent execution
```

## 🚀 Adding New Entity (Visual)

```
Step 1: Create Operations          Step 2: Register Backend
┌──────────────────────┐          ┌──────────────────────┐
│  product.ts          │          │  entityConfig.ts     │
│  ─────────────       │   ──►    │  ─────────────       │
│  createProduct()     │          │  product: {          │
│  listProducts()      │          │    create,           │
│  getProductById()    │          │    list,             │
│  updateProduct()     │          │    getById,          │
│  deleteProduct()     │          │    update,           │
│                      │          │    delete,           │
└──────────────────────┘          │  }                   │
                                  └──────────────────────┘

Step 3: Create Component          Step 4: Register Frontend
┌──────────────────────┐          ┌──────────────────────┐
│  ProductHome.tsx     │          │  EntityRegistry.tsx  │
│  ─────────────       │   ──►    │  ─────────────       │
│  const ProductHome   │          │  entityComponents = {│
│    = () => {         │          │    ...               │
│      return (        │          │    product:          │
│        <div>...</div>│          │      ProductHome,    │
│      )               │          │  }                   │
│  }                   │          └──────────────────────┘
└──────────────────────┘

                    ▼
        ┌────────────────────┐
        │   ✅ Ready to use!  │
        │  /admin/product    │
        └────────────────────┘
```

## 💡 Benefits Visualization

### Before: Manual Switching
```
route.ts (233 lines)
┌────────────────────────┐
│ switch(entity) {       │
│   case "category":     │ ◄─ Repetitive
│     createCategory()   │
│     break              │
│   case "brand":        │ ◄─ Repetitive
│     createBrand()      │
│     break              │
│   case "attribute":    │ ◄─ Repetitive
│     createAttribute()  │
│     break              │
│ }                      │
└────────────────────────┘
     ❌ Hard to maintain
     ❌ Lots of duplication
     ❌ Error-prone
```

### After: Dynamic System
```
route.ts (137 lines)
┌────────────────────────┐
│ if (isValidEntity()) { │
│   entityConfig[entity] │
│     .create(data)      │
│ }                      │
└────────────────────────┘
     ✅ Clean & simple
     ✅ No duplication
     ✅ Easy to extend
```

## 📊 Code Metrics

```
┌─────────────────┬─────────┬─────────┬──────────┐
│     Metric      │ Before  │  After  │  Change  │
├─────────────────┼─────────┼─────────┼──────────┤
│ API Lines       │   233   │   137   │   -41%   │
│ Switch Cases    │    12   │    0    │  -100%   │
│ If Statements   │    3    │    1    │   -67%   │
│ Maintainability │   Low   │  High   │    ↑     │
│ Extensibility   │   Hard  │  Easy   │    ↑     │
└─────────────────┴─────────┴─────────┴──────────┘
```

## 🎓 Learning Path

1. **Understand the Config**
   - Check `entityConfig.ts` to see available entities
   - Each entity has 5 operations (CRUD + list)

2. **See It In Action**
   - Visit `/admin/category`, `/admin/brand`, or `/admin/attribute`
   - Open DevTools → Network to see API calls

3. **Add Your Own Entity**
   - Follow the 4-step process in DYNAMIC_ENTITY_SYSTEM.md
   - Test immediately at `/admin/your-entity`

4. **Extend Further**
   - Add middleware
   - Add validation schemas
   - Add custom actions per entity

## 🔮 Future Possibilities

```
┌─────────────────────────────────────────────────┐
│  entityConfig = {                               │
│    product: {                                   │
│      // CRUD operations                         │
│      create, list, getById, update, delete,     │
│                                                 │
│      // Validation                              │
│      schema: productSchema,                     │
│                                                 │
│      // Permissions                             │
│      permissions: ['admin', 'editor'],          │
│                                                 │
│      // Custom actions                          │
│      actions: {                                 │
│        bulkImport: importProducts,              │
│        export: exportProducts,                  │
│      },                                         │
│                                                 │
│      // Metadata                                │
│      meta: {                                    │
│        label: 'Products',                       │
│        icon: '📦',                              │
│      }                                          │
│    }                                            │
│  }                                              │
└─────────────────────────────────────────────────┘
```

---

**This architecture provides a solid foundation for building a scalable, maintainable entity management system!** 🚀
