import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,white,#d1d5db,white,#d1d5db)]  ">
      {/* Header Section */}  
      <Header/>

      {/* Hero Section */}
      <Hero/>
    </div>

  );  
}
