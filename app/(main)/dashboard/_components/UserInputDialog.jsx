import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import { Tutors } from "@/services/options";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/_context/UserContext";


const UserInputDialog = ({children , cOptions}) => {
  const [selTut, setselTut] = useState("")
  const [topic, settopic] = useState("")
  const [loading, setloading] = useState(false)
  const [openDialog, setopenDialog] = useState(false)
  const createDiscussionRoom = useMutation(api.DiscussionRoom.createNewRoom);
  const router = useRouter();
  const userc = useContext(UserContext);
  const userData = JSON.parse(localStorage.getItem("userData"))
  // console.log("user is :",userData._id)

  const onClickNext = async()=>{
    setloading(true);
    const result = await createDiscussionRoom({
      category:cOptions,
      topic:topic,
      tutor:selTut,
      uid:userData._id
    })
    // console.log(result)
    setloading(false);
    setopenDialog(false);
    router.push(`/DiscussionRoom/${result}`)
  }
  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setopenDialog}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl font-bold"}>{cOptions}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-3">
                <h2 className="text-md text-black font-semibold mb-2">Enter a topic to master your skill in {cOptions} </h2>
                <Textarea onChange={(e)=>settopic(e.target.value)} placeholder="Enter a topic..." />

                <h2 className="text-md mb-3 text-black font-semibold mt-4">Select your Tutor </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                  {Tutors.map((expert,index)=>(
                    <div key={index} onClick={()=>setselTut(expert.name)}>
                      <Image className={`border cursor-pointer border-gray-500 shadow-md transition-all hover:scale-105 hover:shadow-lg rounded-xl ${selTut === expert.name && "border-indigo-600 border-2 p-1"} `} src={expert.avatar} alt={expert.name} width={100} height={100} />
                      <h2 className="text-xs text-center text-black font-semibold">{expert.name}</h2>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-end mt-2">
                  <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                  <Button onClick={onClickNext} disabled = {topic === "" || selTut === "" || loading}>
                    {loading && <LoaderCircle className="animate-spin" />}
                    Next</Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInputDialog;
