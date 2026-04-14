import Link from "next/link";
import Image from "next/image";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import path from "path";

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
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" width={50} height={50} alt="logo" />
        <h1 className="text-base font-bold md:text-2xl">PrepWise</h1>
      </div>
      <div>
        <ul className="flex gap-10">
          {MenuOption.map((option, index) => (
            <li className="text-lg hover:text-primary hover:scale-105 transition-all cursor-pointer ">
              {option.name}
            </li>
          ))}
        </ul>
      </div>
      <UserButton />
    </nav>
  );
}

export default AppHeader;
