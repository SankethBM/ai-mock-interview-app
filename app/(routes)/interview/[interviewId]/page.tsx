import React from "react";
import Image from "next/image";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Interview() {
  return (
    <div className="flex flex-col justify-center items-center mt-14">
      <div className="max-w-3xl w-full">
        <Image
          src={"/interview.svg"}
          alt="interview placeholder"
          width={400}
          height={200}
          className="w-full h-[300px]"
        />
        <div className="p-6 flex flex-col items-center space-y-5">
          <h2 className="font-bold text-3xl text-center ">
            Ready to Start Interview !
          </h2>
          <p className="text-gray-600 text-center">
            Your Interview Session is ready, the interview will last in 30
            minutes. Are you ready to begin ?
          </p>
          <Button className="p-6 font-bold hover:scale-105 transition:all cursor-pointer">
            Start Interview
            <ArrowRight />
          </Button>

          <hr />

          <div className="p-12 bg-gray-50 rounded-2xl">
            <h2 className="font-semibold text-2xl">
              Want to send Interview link to someone ?
            </h2>
            <div className="flex gap-5 mt-6 items-center jystify-center w-full max-w-xl">
              <Input
                placeholder="Enter E-Mail Address"
                className="p-6 w-full"
              />
              <Button className="p-6 hover:scale-105 transition:all cursor-pointer">
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
