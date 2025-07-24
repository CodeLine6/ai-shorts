"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, SparkleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const suggestions = [
    'Historic Story',
    'Kids Story',
    'Movie Stories',
    'AI Innovations',
    'Space Mysteries',
    'Horror Stories',
    'Mythological Tales',
    'Tech Breakthroughs',
    'True Crime Stories',
    'Fantasy Adventures',
    'Science Experiments',
    'Motivational Stories'
]
function Topic({onHandleInputChange,formData} : {onHandleInputChange : (fieldName : string, fieldValue : {content: string, tts_text: string} | string) => void, formData : any}) {
  const [selectedTopic, setSelectedTopic] = useState(formData.topic || '');
  const [selectedScriptIndex, setSelectedScriptIndex] = useState<Number | null>(formData.script ? 0 : null);
  const { data: session } = useSession();
  const user = session?.user;
  
  const [scripts, setScripts] = useState<[{ content: string , tts_text: string}] | undefined>(()  => {
    if (formData.script) {
      return [{ content: formData.script.content, tts_text: formData.script.tts_text }];
    }
    return ;
  });
  const [loading, setLoading] = useState(false);

  const GenerateScript = async () => {
     if(user && user.credits <= 0) { // user is guaranteed to be defined here
            toast({
                title: "Error",
                description: "You don't have enough credits to create a video",
                variant: "destructive",
            })
            return
    };
     setLoading(true)
     setSelectedScriptIndex(null)
     try {
     const result = await axios.post('/api/generate-scripts', {topic: selectedTopic})
     setScripts(result.data?.scripts)
     }
     catch (error) {
    }
    setLoading(false)
  }
  return (
    <div>
      <div>
        <h2 className="mb-2">Project Title</h2>
        <Input placeholder="Enter Project Title" onChange={(e) => onHandleInputChange('title', e.target.value)} value={formData.title} />
      </div>
      <div className="mt-5">
        <h2>Video Topic</h2>
        <p className="text-sm text-gray-500">Select Topic</p>

        <Tabs defaultValue="suggestions" className="mt-2">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
            <div>
                {suggestions.map((suggestion, index) => (
                    <Button key={index} variant="outline" 
                    className={`m-2 ${selectedTopic === suggestion ? 'bg-secondary ' : ''}`} onClick={() => {
                        setSelectedTopic(suggestion)
                        onHandleInputChange('topic', suggestion)
                    }}>{suggestion}</Button>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="your_topic">
                <div>
                    <h2>Enter your own topic</h2>
                    <Textarea 
                    placeholder="Enter your own topic" 
                    className="mt-2"
                    onChange={(e) => {
                      setSelectedTopic(e.target.value)
                      onHandleInputChange('topic', e.target.value)
                    }}
                    />
                </div>
          </TabsContent>
        </Tabs>
        {scripts && scripts.length > 0 && 
        <div className="mt-3">
            <h2>Select the script</h2>
            <div className="grid grid-cols-2 gap-5 mt-1">
            {scripts.map((script, index) => {
               console.log(script.tts_text)
               return <div key={index} className={`p-3 border rounded-lg cursor-pointer ${selectedScriptIndex === index && 'bg-secondary border-white'}`} onClick={() => {
                  setSelectedScriptIndex(index)
                  onHandleInputChange('script', script)
                }} title={`${script.content}`}>
                    <h2 className="line-clamp-4 text-sm text-gray-300">
                        {script.content}
                    </h2>
                </div>
            })}    
        </div>
        
        </div>}
      </div>
      <Button className="mt-3" size="sm" onClick={GenerateScript} disabled={!selectedTopic || loading}>
       {loading ? <Loader2 className="mr-2 animate-spin" /> : <SparkleIcon className="mr-2" />} Generate Script
      </Button>
    </div>
  );
}

export default Topic;
