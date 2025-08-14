"use client"

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, SparkleIcon, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormState } from "../types";

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

function AITabContent({ onHandleInputChange, topicErrors, setEditedScriptContent, editScriptTabRef, scriptErrors,topic,scriptIndex,scripts,loading }: { 
  onHandleInputChange: (fieldName: keyof FormState, fieldValue: { content: string, tts_text: string } | string | undefined) => void, 
  topicErrors: string[], 
  setEditedScriptContent: (content: string) => void, 
  editScriptTabRef: React.RefObject<HTMLButtonElement>, 
  scriptErrors: string[] 
  topic: {selectedTopic: string, setSelectedTopic: (topic: string) => void},
  scriptIndex: {selectedScriptIndex: Number | null, setSelectedScriptIndex: (index: number | null) => void},
  scripts: {scripts: [{ content: string, tts_text: string }] | undefined, setScripts: (scripts: [{ content: string, tts_text: string }] | undefined) => void},
  loading: {loading: boolean, setLoading: (loading: boolean) => void}
}) {
  
  const { data: session } = useSession();
  const user = session?.user;

  const GenerateScript = async () => {
    if (user && user.credits <= 0) { // user is guaranteed to be defined here
      toast({
        title: "Error",
        description: "You don't have enough credits to create a video",
        variant: "destructive",
      })
      return
    };
    loading.setLoading(true)
    scriptIndex.setSelectedScriptIndex(null)
    try {
      const result = await axios.post('/api/generate-scripts', { topic: topic.selectedTopic })
      scripts.setScripts(result.data?.scripts)
    }
    catch (error) {
    }
    loading.setLoading(false)
  }

  return (
    <Tabs defaultValue="suggestions" className="">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
      </TabsList>
      <TabsContent value="suggestions" className="w-full">
        {suggestions.map((suggestion, index) => (
          <Button key={index} variant="outline"
            className={`m-2 ${topic.selectedTopic === suggestion ? 'bg-secondary ' : ''} ${topicErrors.length > 0 ? 'border border-red-500' : ''}`} onClick={() => {
              topic.setSelectedTopic(suggestion)
              onHandleInputChange('topic', suggestion)
            }}>{suggestion}</Button>
        ))}

        {topicErrors.length > 0 && (
          topicErrors.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
          ))
        )}
      </TabsContent>
      <TabsContent value="your_topic" className="w-full">
        <div>
          <h2>Enter your own topic</h2>
          <Textarea
            placeholder="Enter your own topic"
            className={`mt-2 ${topicErrors.length > 0 ? 'border border-red-500' : ''}`}
            onChange={(e) => {
              topic.setSelectedTopic(e.target.value)
              onHandleInputChange('topic', e.target.value)
            }}
            value={topic.selectedTopic}
          />
        </div>
        {topicErrors.length > 0 && (
            <p className="text-sm text-red-500 mt-2">Please enter a topic</p>
        )}
      </TabsContent>

      <Button className="mt-3 w-full" size="sm" onClick={GenerateScript} disabled={!topic.selectedTopic || loading.loading}>
        {loading.loading ? <Loader2 className="mr-2 animate-spin" /> : <SparkleIcon className="mr-2" />} Generate Script
      </Button>

      {scripts.scripts && scripts.scripts?.length > 0 &&
        <div className={`mt-3 p-4 ${scriptErrors.length > 0 ? 'border rounded border-red-500' : ''}`}>
          <h2>Select the script</h2>
          <div className="grid grid-cols-2 gap-5 mt-1">
            {scripts.scripts.map((script, index) => {
              return (
                <div key={index} className={`p-3 border rounded-lg cursor-pointer relative group ${scriptIndex.selectedScriptIndex === index ? 'bg-secondary border-white' : ''} overflow-hidden`}
                  onClick={() => {
                    scriptIndex.setSelectedScriptIndex(index)
                    onHandleInputChange('script', script)
                  }} title={`${script.content}`}>
                  <div
                    className={`absolute w-full top-0 right-0 bg-gradient-to-r from-transparent ${scriptIndex.selectedScriptIndex === index ? 'to-secondary' : 'to-black'} p-2 rounded hidden group-hover:flex justify-end`}
                  >
                    <Pencil
                      className="mr-2 h-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        editScriptTabRef.current?.focus()
                        setEditedScriptContent(script.content)
                      }}
                    />
                  </div>
                  <h2 className="line-clamp-4 text-sm text-gray-300">
                    {script.content}
                  </h2>
                </div>
              )
            })}
          </div>
        </div>}

      {scriptErrors.length ? (scripts.scripts && scripts.scripts.length ?
          <p className="text-sm text-red-500 mt-2">Please select a script</p>
        :
        <p className="text-sm text-red-500 mt-2">Please Generate a script to proceed</p>
      ) : ''}
    </Tabs>
  );
}

export default AITabContent;