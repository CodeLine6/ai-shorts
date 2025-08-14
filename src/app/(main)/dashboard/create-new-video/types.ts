// TypeScript Interfaces
export interface ValidationRule {
    type: 'required' | 'fieldType' | 'minLength' | 'maxLength' | 'email' | 'conditionalRequired';
    message: string;
    value?: string | number;
    objectShape?: Record<string, string> | Record<string, ValidationRule[]>;
    condition?: (formState: FormState) => boolean; // New property for conditional validation
}

export interface FormField<T = any> {
    value: T;
    error: string[];
    rules: ValidationRule[];
}

export interface VoiceConfig {
    name: string;
    voiceId: string;
}

export interface CaptionConfig {
    name: string;
    style: string;
}

export interface ScriptConfig {
    content: string;
    tts_text: string;
}

export interface FormState {
    title: FormField<string>;
    topic: FormField<string | undefined>;
    script: FormField<ScriptConfig | undefined>;
    voice: FormField<VoiceConfig | undefined>;
    audioUrl: FormField<string | undefined>;
    videoStyle: FormField<string>;
    captionStyle: FormField<CaptionConfig | undefined>;
}

export interface FormAction {
    type: 'set' | 'validate' | 'reset';
    payload?: {
        fieldName: keyof FormState;
        fieldValue: any;
    };
}