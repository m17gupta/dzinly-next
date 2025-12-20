"use client"


import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { getAllUser } from "@/hooks/slices/user/userSlice";
// import { cookies } from "next/headers";

// async function fetchCount(path: string) {
//   try {
//     const cookieStore = await cookies();
//     const cookie = cookieStore.toString();
//     const res = await fetch(path, { cache: "no-store", headers: { cookie } });
//     if (!res.ok) return 0;
//     const data = await res.json();
//     const items = Array.isArray(data) ? data : data.items;
//     return Array.isArray(items) ? items.length : 0;
//   } catch {
//     return 0;
//   }
// }

export default async function AdminIndex() {
  const {user, alluser,hasFetched }= useSelector((state:RootState)=>state.user)
   const dispatch= useDispatch<AppDispatch>()
  
  // const [pages, posts, products, orders, categories, tags] = await Promise.all([
  //   fetchCount("/api/pages"),
  //   fetchCount("/api/posts"),
  //   fetchCount("/api/products"),
  //   fetchCount("/api/orders"),
  //   fetchCount("/api/categories"),
  //   fetchCount("/api/blog_tags"),
  // ]);

  useEffect(()=>{
    if(!alluser&&
      !hasFetched&&
      user && user.tenantId){
   dispatch(getAllUser())
    }
  },[alluser,hasFetched,user])



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Quick overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
      </div>
    </div>
  );
}
