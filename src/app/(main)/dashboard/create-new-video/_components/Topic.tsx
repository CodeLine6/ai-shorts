"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AITabContent from "./AITabContent";
import ScriptTabContent from "./ScriptTabContent";
import AudioTabContent from "./AudioTabContent";
import { useEffect, useRef, useState } from "react";
import { FormState } from "../types";

function Topic({ onHandleInputChange, errors }: { onHandleInputChange: (fieldName: keyof FormState, fieldValue: { content: string, tts_text: string } | string | undefined) => void, errors: { topic: string[], script: string[] } },) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedScriptIndex, setSelectedScriptIndex] = useState<Number | null>(null);
  const [scripts, setScripts] = useState<[{ content: string, tts_text: string }] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [editedScriptContent, setEditedScriptContent] = useState<string>(''); // New state for edited script
  const editScriptTabRef = useRef<HTMLButtonElement>(null);
  const { topic: topicErrors, script: scriptErrors } = errors


  return (
    <div className="mt-5">
      <h2 className={`${topicErrors.length > 0 && 'text-red-500'}`}>Content</h2>
      <p className="text-sm text-gray-500">Use either AI, write your own script or upload an audio file</p>
      <Tabs defaultValue="AI" className="mt-2">
        <TabsList className="grid grid-cols-3" >
          <TabsTrigger value="AI" >GENERATE WITH AI</TabsTrigger>
          <TabsTrigger value="SCRIPT" ref={editScriptTabRef} >WRITE SCRIPT</TabsTrigger>
          <TabsTrigger value="AUDIO">AUDIO</TabsTrigger>
        </TabsList>
        <TabsContent value="AI">
          <AITabContent
            onHandleInputChange={onHandleInputChange}
            topicErrors={topicErrors}
            scriptErrors={scriptErrors}
            setEditedScriptContent={setEditedScriptContent}
            editScriptTabRef={editScriptTabRef}
            topic={{ selectedTopic, setSelectedTopic }}
            scriptIndex={{ selectedScriptIndex, setSelectedScriptIndex }}
            scripts={{ scripts, setScripts }}
            loading={{ loading, setLoading }}
          />
        </TabsContent>
        <TabsContent value="SCRIPT">
          <ScriptTabContent
            scriptErrors={scriptErrors}
            editedScriptContent={{ editedScriptContent, setEditedScriptContent }}
            onHandleInputChange={(value) => {
              onHandleInputChange('script', value)
              onHandleInputChange('topic', '')
              setSelectedTopic('')
              setSelectedScriptIndex(null)
            }}
          />
          {scriptErrors.length > 0 &&
            scriptErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
            ))
          }
        </TabsContent>
        <TabsContent value="AUDIO">
          <AudioTabContent
            onHandleInputChange={onHandleInputChange}
            clearScriptandTopic={() => {
              setSelectedTopic('')
              setSelectedScriptIndex(null)
              setEditedScriptContent('')
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Topic;