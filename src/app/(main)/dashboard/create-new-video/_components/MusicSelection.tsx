"use client";

import MusicPreviewSelection from "./MusicPreviewSelection";
import { FormState } from "../types";

interface MusicSelectionProps {
  onHandleInputChange: (fieldName: keyof FormState, fieldValue: any) => void;
  errors: string[];
}

function MusicSelection({ onHandleInputChange, errors }: MusicSelectionProps) {
  return (
    <MusicPreviewSelection
      onHandleInputChange={onHandleInputChange}
      errors={errors}
    />
  );
}

export default MusicSelection;
