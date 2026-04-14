import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";

function EmptyState() {
  return (
    <div className="mt-14 flex flex-col items-center gap-6 border-dashed p-4 border-4 rounded-2xl bg-gray-50">
      <Image
        src={"/EmailMarketing.gif"}
        width={400}
        height={400}
        alt="empty_interview_placeholder"
      />
      <h2 className="mt-2 text-lg text-grey-500">
        You do not have any Interview Created !
      </h2>
      <CreateInterviewDialog />
    </div>
  );
}

export default EmptyState;
