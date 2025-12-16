"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";


import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RootClientPage() {
  const dispatch= useDispatch<AppDispatch>()
  const router = useRouter();
  const {user}= useSelector((state:RootState)=>state.user)
  console.log("user---", user)
  const handleLogin=()=>{
     if(user){
      router.push("/admin")
     }else{
       router.push("/auth/signin");
     }
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center px-4">
      <section className="max-w-3xl w-full text-center py-16">
        <img
          src="/logo.svg"
          alt="Dzinly Logo"
          className="mx-auto mb-6 w-24 h-24"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Dzinly Admin Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Comprehensive Role-Based Access Control (RBAC) system with franchise
          white-labeling capabilities. Dynamic user management, granular
          permissions, and extensive customization for franchise partners.
        </p>
        <a
          onClick={handleLogin}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Go to Admin Dashboard
        </a>
      </section>
      z
      <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 mb-4 font-bold">
            RBAC
          </span>
          <h2 className="text-xl font-bold mb-2">Granular Permissions</h2>
          <p className="text-gray-600">
            Hierarchical, context-aware permissions for secure, scalable access
            control across all roles.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="inline-block bg-purple-100 text-purple-700 rounded-full px-3 py-1 mb-4 font-bold">
            White-label
          </span>
          <h2 className="text-xl font-bold mb-2">Franchise Customization</h2>
          <p className="text-gray-600">
            Full branding control: colors, logos, typography, and advanced CSS
            for franchise partners.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="inline-block bg-green-100 text-green-700 rounded-full px-3 py-1 mb-4 font-bold">
            Management
          </span>
          <h2 className="text-xl font-bold mb-2">Dynamic User Management</h2>
          <p className="text-gray-600">
            Create, manage, and monitor users, clients, and roles with real-time
            activity tracking.
          </p>
        </div>
      </section>
      <section className="max-w-4xl w-full py-12 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Why Dzinly?</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left list-disc list-inside mx-auto text-gray-700">
          <li>Enterprise-grade security & tenant isolation</li>
          <li>Real-time branding preview and customization</li>
          <li>Comprehensive audit logging & monitoring</li>
          <li>Performance-optimized for high-traffic environments</li>
          <li>Extensive documentation & support</li>
          <li>Scalable for unlimited franchises and clients</li>
        </ul>
      </section>
    </main>
  );
}
