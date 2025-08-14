"use client"

import { Input } from "@/components/ui/input";
import { FormState } from "../types";

function Title({ onHandleInputChange, errors}: { onHandleInputChange: (fieldName: keyof FormState, fieldValue: string) => void, errors: string[]}) {

  return (
    <>
        <h2 className={`${errors.length > 0 && 'text-red-500'}`}>Project Title</h2>
        <Input placeholder="Enter Project Title" onChange={(e) => onHandleInputChange('title', e.target.value)} className={`border ${errors.length > 0 ? 'border-red-500' : ''}`} />
        {errors.length > 0 && (
          errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
          ))
        )}
    </>
  );
}

export default Title;
