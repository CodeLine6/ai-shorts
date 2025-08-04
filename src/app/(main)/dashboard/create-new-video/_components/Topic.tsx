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
import { FormState } from "../page";

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
function Topic({ onHandleInputChange, errors}: { onHandleInputChange: (fieldName: keyof FormState, fieldValue: { content: string, tts_text: string } | string) => void, errors: { title: string[], topic: string[], script: string[]}}) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedScriptIndex, setSelectedScriptIndex] = useState<Number | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  const [scripts, setScripts] = useState<[{ content: string, tts_text: string }] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { title, topic, script: scriptErrors } = errors

  const GenerateScript = async () => {
    if (user && user.credits <= 0) { // user is guaranteed to be defined here
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
      const result = await axios.post('/api/generate-scripts', { topic: selectedTopic })
      setScripts(result.data?.scripts)
    }
    catch (error) {
    }
    setLoading(false)
  }
  return (
    <div>
      <div>
        <h2 className={`${title.length > 0 && 'text-red-500'}`}>Project Title</h2>
        <Input placeholder="Enter Project Title" onChange={(e) => onHandleInputChange('title', e.target.value)} className={`border ${title.length > 0 ? 'border-red-500' : ''}`} />
        {title.length > 0 && (
          title.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
          ))
        )}
      </div>
      <div className="mt-5">
        <h2 className={`${topic.length > 0 && 'text-red-500'}`}>Video Topic</h2>
        <p className="text-sm text-gray-500">Select Topic</p>

        <Tabs defaultValue="suggestions" className="mt-2">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestions">
              {suggestions.map((suggestion, index) => (
                <Button key={index} variant="outline"
                  className={`m-2 ${selectedTopic === suggestion ? 'bg-secondary ' : ''} ${topic.length > 0 && 'border border-red-500'}`} onClick={() => {
                    setSelectedTopic(suggestion)
                    onHandleInputChange('topic', suggestion)
                  }}>{suggestion}</Button>
              ))}
          </TabsContent>
          <TabsContent value="your_topic">
            <div>
              <h2>Enter your own topic</h2>
              <Textarea
                placeholder="Enter your own topic"
                className={`mt-2 ${topic.length > 0 ? 'border border-red-500' : ''}`}
                onChange={(e) => {
                  setSelectedTopic(e.target.value)
                  onHandleInputChange('topic', e.target.value)
                }}
                value={selectedTopic}
              />
            </div>
          </TabsContent>
        </Tabs>
        
          {topic.length > 0 && (
            topic.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
            ))
          )}
        
        {scripts && scripts?.length > 0 &&
          <div className={`mt-3 p-4 ${scriptErrors.length > 0 ? 'border rounded border-red-500' : ''}`}>
            <h2>Select the script</h2>
            <div className="grid grid-cols-2 gap-5 mt-1">
              {scripts.map((script, index) => {
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
          
              {scriptErrors.length ? (scripts && scripts.length ? 
                scriptErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
                ))
                : 
                <p className="text-sm text-red-500 mt-2">Please Generate a script to proceed</p>
               ) : ''}
      </div>
      <Button className="mt-3" size="sm" onClick={GenerateScript} disabled={!selectedTopic || loading}>
        {loading ? <Loader2 className="mr-2 animate-spin" /> : <SparkleIcon className="mr-2" />} Generate Script
      </Button>
    </div>
  );
}

export default Topic;
