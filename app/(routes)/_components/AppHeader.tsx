"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const MenuOption = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Upgrade",
    path: "/upgrade",
  },
  {
    name: "How It Works",
    path: "/how-it-works",
  },
];

function AppHeader() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 bg-white">
      <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" width={50} height={50} alt="logo" />
        <h1 className="text-base font-bold md:text-2xl text-neutral-900">PrepWise</h1>
      </Link>
      
      <div>
        <ul className="flex gap-10">
          {MenuOption.map((option, index) => {
            const isActive = pathname === option.path;
            
            return (
              <Link key={index} href={option.path}>
                <li
                  className={`text-lg transition-all hover:text-primary hover:scale-105 cursor-pointer ${
                    isActive ? "text-neutral-900 font-semibold" : "text-neutral-500"
                  } ${option.name === "Upgrade" ? "text-amber-600 font-medium" : ""}`}
                >
                  {option.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      
      <UserButton />
    </nav>
  );
}

export default AppHeader;