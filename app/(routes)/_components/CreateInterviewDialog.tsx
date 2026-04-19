import React, { useContext, useState } from "react";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<any>();
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter()
  const saveInterviewQuestion = useMutation(
    api.interview.saveInterviewQuestion,
  );

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    // if (!file) return null;
    setLoading(true);
    const formData_ = new FormData();
    formData_.append("file", file ?? "");
    formData_?.append("jobTitle", formData?.jobTitle);
    formData_?.append("jobDescription", formData?.jobDescription);

    try {
      const res = await axios.post(
        "api/generate-interview-questions",
        formData_,
      );
      console.log(res.data);

      if(res?.data?.status == 429){
        toast.warning(res?.data?.result)
        console.log(res?.data?.result)
        return;
      }

      // save the data tot DB
      //@ts-ignore

      const questions = res.data?.questions?.[0]?.interview_questions ?? [];

      const interviewId = await saveInterviewQuestion({
        questions,
        resumeUrl: res?.data?.resumeUrl ?? null,
        uid: userDetail?._id,
        jobTitle: formData?.jobTitle ?? null,
        jobDescription: formData?.jobDescription ?? null,
      });

      // console.log(resp);

      router.push('/interview/'+interviewId)

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="p-6 hover:scale-105 cursor-pointer mb-12">
          + Create Intervieww
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center p-4 font-bold">
            Please enter the following details !
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
          <DialogClose>
            <Button variant={"ghost"} className="p-6">
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
            {" "}
            {loading && <Loader2Icon className="animate-spin" />}Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialog;
