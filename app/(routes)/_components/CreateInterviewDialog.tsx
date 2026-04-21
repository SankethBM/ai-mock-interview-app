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
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const formData_ = new FormData();
    if (file) formData_.append("file", file);
    if (formData?.jobTitle) formData_.append("jobTitle", formData.jobTitle);
    if (formData?.jobDescription) formData_.append("jobDescription", formData.jobDescription);

    try {
      const res = await axios.post("/api/generate-interview-questions", formData_);
      
      if (res.data?.status === 429) {
        toast.warning(res.data?.result || "No free credits left");
        return;
      }

      if (res.data?.error) {
        toast.error(res.data.error);
        return;
      }

      const { interviewId } = res.data;
      if (!interviewId) {
        toast.error("Failed to create interview session");
        return;
      }

      router.push(`/interview/${interviewId}/start`);
      toast.success("Interview created successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-6 hover:scale-105 cursor-pointer mb-12">
          + Create Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center p-4 font-bold">
            Please enter the following details!
          </DialogTitle>
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
                <ResumeUpload setFiles={(file: File) => setFile(file)} />
              </TabsContent>
              <TabsContent value="job-description">
                <JobDesription onHandleInputChange={onHandleInputChange} />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6">
          <DialogClose asChild>
            <Button variant="ghost" className="p-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="p-6 hover:scale-105"
            onClick={onSubmit}
            disabled={
              loading ||
              (!file &&
                (!formData?.jobTitle?.trim() ||
                  !formData?.jobDescription?.trim()))
            }
          >
            {loading && <Loader2Icon className="animate-spin mr-2" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;