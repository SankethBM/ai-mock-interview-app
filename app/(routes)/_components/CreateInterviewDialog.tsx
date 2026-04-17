import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ResumeUpload from "./ResumeUpload";
import JobDesription from "./JobDesription";

function CreateInterviewDialog() {

    const [formData, setFormData] = useState<any>();

  const onHandleInputChange = (field:string, value:string) =>  {
    setFormData((prev:any) => ({
        ...prev,
        [field]:value
    }))
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="p-6 hover:scale-105 cursor-pointer mb-12">
          + Create Intervieww
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center p-4 font-bold" >Please enter the following details !</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="resume-upload" className="w-full mt-5">
              <div className="flex justify-center">
                <TabsList className="inline-flex gap-4">
                  <TabsTrigger value="resume-upload">Upload Resume</TabsTrigger>
                  <TabsTrigger value="job-description">
                    Job Description
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="resume-upload">
                <ResumeUpload />
              </TabsContent>
              <TabsContent value="job-description">
                <JobDesription onHandleInputChange={onHandleInputChange} />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6">
          <DialogClose>
            <Button variant={"ghost"} className="p-6">
              Cancel
            </Button>
          </DialogClose>
          <Button className="p-6 hover:scale-105">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
