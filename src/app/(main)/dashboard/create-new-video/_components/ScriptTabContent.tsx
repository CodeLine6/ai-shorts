"use client"

import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { debounce} from "@/lib/utils";
import generateTtsTags from "@/actions/generateTtsTags";
import React from "react";
import { FormState } from "../types";

const debouncedHandleScriptEdit = debounce((callback: () => void) => {
  callback()
}, 2000);

function ScriptTabContent({ scriptErrors, editedScriptContent, onHandleInputChange }: { scriptErrors: string[], editedScriptContent: {editedScriptContent: string, setEditedScriptContent: (content: string) => void}, onHandleInputChange: (fieldValue: { content: string, tts_text: string } | string) => void }) {
  return (
    <Textarea
      className={`mt-2 ${scriptErrors.length > 0 ? 'border rounded border-red-500' : ''}`}
      placeholder="Enter your script"
      value={editedScriptContent.editedScriptContent}
      onChange={(e) => {
        editedScriptContent.setEditedScriptContent(e.target.value);
        debouncedHandleScriptEdit(async () => {
          const getScriptWithEmotionTags = await generateTtsTags(e.target.value);
          if (getScriptWithEmotionTags.success) {
            onHandleInputChange({ content: e.target.value, tts_text: getScriptWithEmotionTags.tts_text })
          }
          else
            toast({
              title: "Error",
              description: "Something went wrong. Please try again",
              variant: "destructive",
            })
        });
      }}
      rows={6}
    />
  );
}

export default ScriptTabContent;