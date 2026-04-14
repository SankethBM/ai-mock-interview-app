"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import EmptyState from "./EmptyState";

function Dashboard() {
  const user = useUser();
  const [interviewList, setInterviewList] = useState([]);

  return (
    <div className="py-20 px-10 md:px-28 lg:px-44 xl:px-56">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg text-grey-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold">Welcome, {user.user?.fullName}</h2>
        </div>
        <Button className="p-6 hover:scale-105">+ Create Interview</Button>
      </div>
      {interviewList?.length == 0 && <EmptyState />}
    </div>
  );
}

export default Dashboard;
