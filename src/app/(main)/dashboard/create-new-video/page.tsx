"use client"
import { useState } from "react";
import Topic from "./_components/Topic"
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Captions from "./_components/Captions";
import { Button } from "@/components/ui/button";
import { Loader2Icon, WandSparkles } from "lucide-react";
import Preview from "./_components/Preview";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function page() {
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
    const { data: session, status, update } = useSession();
    const user = session?.user;

    const onHandleInputChange = (fieldName : string, fieldValue : string | {}) => {
        setFormData({
            ...formData,
            [fieldName]: fieldValue,
        });
    }

    const GenerateVideo = async () => {

        if(user.credits <= 0) { // user is guaranteed to be defined here
            toast({
                title: "Error",
                description: "You don't have enough credits to create a video",
                variant: "destructive",
            })
            return
        };

        if(!formData.title || !formData.topic || !formData.script || !formData.voice.voiceId || !formData.videoStyle || !formData.captionStyle) {
            return console.error("Please fill all the fields")
        }

        setLoading(true);

        // Save to database
        const resp = await CreateInitialVideoRecord({
            title: formData.title,
            topic: formData.topic,
            script: formData.script,
            videoStyle: formData.videoStyle,
            caption: formData.captionStyle,
            voice: formData.voice,
            //@ts-ignore
            uid: user._id,
            createdBy: user.email,
            credits: user.credits // This is the credits *before* decrement
        });

        // Fetch the updated user data from Convex to get the new credit balance
        //@ts-ignore
        const updatedUser = await convex.mutation(api.user.GetUserById, { userId: user._id });

        if (updatedUser) {
            await update({
                user: {
                    ...user,
                    credits: updatedUser.credits, // Use the actual updated credits from the database
                },
            });
        } else {
            console.error("Failed to fetch updated user data after video creation.");
        }
        
        const result = await axios.post('/api/generate-video-data', {
            ...formData,
            recordId: resp,
        }) 
        setLoading(false);
        console.log(result)
    }
  
  return (
    <div>
        <h2 className="text-3xl">Create New Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-7">
            <div className="col-span-2 p-7 border rounded-xl h-[70vh] overflow-auto">
                {/* Topic & Script */}
                <Topic onHandleInputChange={onHandleInputChange} formData={formData}/>
                {/* Video Image Style */}
                <VideoStyle onHandleInputChange={onHandleInputChange} formData={formData}/>
                {/* Voice */}
                <Voice onHandleInputChange={onHandleInputChange} formData={formData}/>
                {/* Captions */}
                <Captions onHandleInputChange={onHandleInputChange} formData={formData}/>
                <Button disabled={loading} className="w-full mt-5" onClick={GenerateVideo}>
                    {loading ? <Loader2Icon className="animate-spin"/> : <WandSparkles/>} Generate Video
                </Button>
            </div>
            <div className="col-span-1">
                <Preview formData={formData}/>
            </div>
        </div>
    </div>
  )
}

export default page
