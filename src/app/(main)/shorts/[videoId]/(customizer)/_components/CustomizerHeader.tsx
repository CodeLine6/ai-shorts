import { Button } from "@/components/ui/button";
import { Download, HomeIcon, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { QueueVideo } from "@/actions/generateVideo";
import { useState } from "react";
import { Id } from "@/../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabItems } from "../config";


const CustomizerHeader = ({ activeTab, onTabChange, videoData }: { activeTab: string, onTabChange: (tab: string) => void, videoData: any }) => {

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lastModified = videoData?.lastModified;
  const renderStartedAt = videoData?.renderStartedAt;
  const downloadUrl = videoData?.downloadUrl;
  const videoTitle = videoData?.title;
  const videoStatus = videoData?.status;

  const needsRender = !renderStartedAt || (lastModified && renderStartedAt && lastModified > renderStartedAt);

  const handleRender = async () => {
    setLoading(true);
    const result = await QueueVideo(videoData._id as Id<"videoData">);
    setLoading(false);
    if (result.ok) {
      toast({
        title: "Success",
        description: "Video queued for processing",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  const buttonText = needsRender ? "Render" : "Download";
  const buttonAction = needsRender ? handleRender : handleDownload;
  const exportDisabled = !videoTitle || loading || videoStatus === "Rendering" || videoStatus === "Queued";

  return (
    <header className="py-4 px-8">
      <div className="grid grid-cols-3">
        <div className="flex gap-4 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/dashboard">
                <Button variant={"outline"}>
                  <HomeIcon />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Dashboard</p>
            </TooltipContent>
          </Tooltip>
          {videoTitle ? <h2 className="text-xl">{videoTitle}</h2> : <h2 className="text-2xl bg-gray-800 animate-pulse rounded-md p-3 w-80" />}
        </div>
        <Tabs value={activeTab} onValueChange={onTabChange} className="mx-auto">
          <TabsList>
            {TabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="capitalize">
                <tab.icon className="mr-2 w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center">
          <Button onClick={buttonAction} disabled={exportDisabled} className="ml-auto">
            {loading ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
            {buttonText}
          </Button>
          {needsRender && downloadUrl && (
            <Link href={downloadUrl} className="ml-4 text-sm text-gray-500 hover:text-gray-400">
              Download anyway
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomizerHeader;
