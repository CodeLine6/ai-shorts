"use client"

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, SparkleIcon, Pencil, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSession } from "next-auth/react";
import { FormState } from "../types";
import { Input } from "@/components/ui/input";
import { useCustomTopics } from "@/hooks/useCustomTopics"; // Adjust the path as needed

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

function AITabContent({ onHandleInputChange, topicErrors, setEditedScriptContent, editScriptTabRef, scriptErrors, topic, scriptIndex, scripts, loading }: {
  onHandleInputChange: (fieldName: keyof FormState, fieldValue: { content: string, tts_text: string } | string | undefined) => void,
  topicErrors: string[],
  setEditedScriptContent: (content: string) => void,
  editScriptTabRef: React.RefObject<HTMLButtonElement>,
  scriptErrors: string[]
  topic: { selectedTopic: string, setSelectedTopic: (topic: string) => void },
  scriptIndex: { selectedScriptIndex: Number | null, setSelectedScriptIndex: (index: number | null) => void },
  scripts: { scripts: [{ content: string, tts_text: string }] | undefined, setScripts: (scripts: [{ content: string, tts_text: string }] | undefined) => void },
  loading: { loading: boolean, setLoading: (loading: boolean) => void }
}) {

  const { data: session } = useSession();
  const user = session?.user;
  const { customTopics, addCustomTopic, deleteCustomTopic } = useCustomTopics();
  
  // Combine default suggestions with custom topics
  const suggestionItems = [...suggestions, ...customTopics];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const newTopic = target.value.trim();
      
      if (newTopic && !customTopics.includes(newTopic) && !suggestions.includes(newTopic)) {
        addCustomTopic(newTopic);
        
        // Clear the input
        target.value = '';
        
        // Optionally select the new topic
        topic.setSelectedTopic(newTopic);
        onHandleInputChange('topic', newTopic);
      }
    }
  }

  const handleDeleteCustomTopic = (topicToDelete: string) => {
    deleteCustomTopic(topicToDelete);
    
    // If the deleted topic was selected, clear the selection
    if (topic.selectedTopic === topicToDelete) {
      topic.setSelectedTopic('');
      onHandleInputChange('topic', '');
    }
  };

  const GenerateScript = async () => {
    if (user && user.credits <= 0) {
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
    <>
      <div className="flex flex-wrap">
        {suggestionItems.map((suggestion, index) => {
          const isCustomTopic = customTopics.includes(suggestion);
          return (
            <div key={index} className="relative m-2 group">
              <Button 
                variant="outline"
                className={`${topic.selectedTopic === suggestion ? 'bg-secondary ' : ''} ${topicErrors.length > 0 ? 'border border-red-500' : ''} ${isCustomTopic ? 'pr-8' : ''}`} 
                onClick={() => {
                  topic.setSelectedTopic(suggestion)
                  onHandleInputChange('topic', suggestion)
                }}
              >
                {suggestion}
              </Button>
              
              {isCustomTopic && (
                <Button
                  variant={"outline"}
                  className="absolute -top-2 -right-2  text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustomTopic(suggestion);
                  }}
                  title="Delete custom topic"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='m-2'><Plus /></Button>
          </PopoverTrigger>
          <PopoverContent side="top">
            <Input placeholder="Enter your own topic" onKeyDown={handleKeyDown} />
          </PopoverContent>
        </Popover>
      </div>
      
      {topicErrors.length > 0 && (
        topicErrors.map((error, index) => (
          <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
        ))
      )}

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
                  }} title={`${script.tts_text}`}>
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
                    {script.tts_text}
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
    </>
  );
}

export default AITabContent;