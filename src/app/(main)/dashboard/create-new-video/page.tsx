"use client"
import { useReducer, useState } from "react";
import Content from "./_components/Topic"
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Captions from "./_components/Captions";
import { Button } from "@/components/ui/button";
import { Loader2Icon, WandSparkles } from "lucide-react";
import Preview from "./_components/Preview";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Title from "./_components/Title";
import { FormAction, FormState, ValidationRule } from "./types";
import { moveSupabaseFile } from "@/lib/utils";
import MusicSelection from "./_components/MusicSelection";


// Enhanced validation functions
function validateObjectShape(obj: Record<string, any>, shape: Record<string, string>): string[] {
    const errors: string[] = [];

    for (const [key, expectedType] of Object.entries(shape)) {
        if (!(key in obj)) {
            errors.push(`Missing property: ${key}`);
        } else if (typeof obj[key] !== expectedType) {
            errors.push(`Property ${key} must be ${expectedType}, got ${typeof obj[key]}`);
        } else if (expectedType === 'string' && obj[key].trim().length === 0) {
            errors.push(`Property ${key} cannot be empty`);
        }
    }

    return errors;
}

function validateNestedFields(value: Record<string, any>, fields: Record<string, ValidationRule[]>): string[] {
    const errors: string[] = [];

    for (const [nestedField, nestedRules] of Object.entries(fields)) {
        const nestedValue = value[nestedField];
        const nestedErrors = validateField(nestedValue, nestedRules);

        if (nestedErrors.length > 0) {
            errors.push(`${nestedField}: ${nestedErrors[0]}`);
        }
    }

    return errors;
}

function validateField<T>(value: T, rules: ValidationRule[], formState?: FormState): string[] {
    const errors: string[] = [];

    outerLoop: for (const rule of rules) {
        switch (rule.type) {
            case "required":
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    errors.push(rule.message);
                    break outerLoop;
                }
                break;

            case "conditionalRequired":
                if (rule.condition && formState) {
                    const shouldBeRequired = rule.condition(formState);
                    if (shouldBeRequired && (!value || (typeof value === 'string' && value.trim().length === 0))) {
                        errors.push(rule.message);
                        break outerLoop;
                    }
                }
                break;

            case "fieldType":
                if (value !== undefined && value !== null) {
                    if (typeof rule.value !== 'string') break;

                    if (rule.value === "email" && typeof value === "string") {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            errors.push(rule.message);
                        }
                    }
                    else if (rule.value == "object" && typeof value === "object") {
                        if (rule.objectShape) {
                            const shapeErrors = validateObjectShape(
                                value as Record<string, any>,
                                rule.objectShape as Record<string, string>
                            );
                            if (shapeErrors.length > 0) {
                                errors.push(rule.message);
                            }
                        }
                    }
                    else if (rule.value == "nested" && typeof value === "object") {
                        if (rule.objectShape) {
                            const nestedErrors = validateNestedFields(
                                value as Record<string, any>,
                                rule.objectShape as Record<string, ValidationRule[]>
                            );
                            if (nestedErrors.length > 0) {
                                errors.push(rule.message);
                            }
                        }
                    }
                    else if (typeof value !== rule.value) {
                        errors.push(rule.message);
                    }
                }
                break;

            case "minLength":
                if (value && typeof value === 'string' && typeof rule.value === 'number') {
                    if (value.length < rule.value) {
                        errors.push(rule.message);
                    }
                }
                break;

            case "maxLength":
                if (value && typeof value === 'string' && typeof rule.value === 'number') {
                    if (value.length > rule.value) {
                        errors.push(rule.message);
                    }
                }
                break;

            case "email":
                if (value && typeof value === 'string') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errors.push(rule.message);
                    }
                }
                break;
        }
    }

    return errors;
}

// Initial state with proper typing
const formFields: FormState = {
    title: {
        value: "",
        error: [],
        rules: [
            {
                type: "required",
                message: "Please enter a title"
            },
            {
                type: "fieldType",
                message: "Title must be a string",
                value: "string",
            },
            {
                type: "minLength",
                message: "Title must be at least 3 characters",
                value: 3,
            },
            {
                type: "maxLength",
                message: "Title must be at most 50 characters",
                value: 50,
            }
        ]
    },
    topic: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "fieldType",
                message: "Topic must be a string",
                value: "string",
            }
        ]
    },
    script: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "conditionalRequired",
                message: "Script is required when no audio URL is provided",
                condition: (formState) => !formState.audioUrl.value || formState.audioUrl.value.trim() === ""
            },
            {
                type: "fieldType",
                message: "Script must not be empty",
                value: "object",
                objectShape: { content: "string", tts_text: "string" }
            }
        ]
    },
    voice: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "conditionalRequired",
                message: "Voice is required when no audio URL is provided",
                condition: (formState) => !formState.audioUrl.value || formState.audioUrl.value.trim() === ""
            },
            {
                type: "fieldType",
                message: "Voice must have title and voiceId",
                value: "object",
                objectShape: { name: "string", voiceId: "string" }
            }
        ]
    },
    audioUrl: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "fieldType",
                message: "Audio URL must be a string",
                value: "string"
            }
        ]
    },
    videoStyle: {
        value: "",
        error: [],
        rules: [
            {
                type: "required",
                message: "Please select a video style"
            },
            {
                type: "fieldType",
                message: "Video style must be a string",
                value: "string"
            }
        ]
    },
    captionStyle: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "required",
                message: "Please select a caption style"
            },
            {
                type: "fieldType",
                message: "Caption style must have title and styleId",
                value: "object",
                objectShape: { name: "string", style: "string" }
            }
        ]
    },
    musicTrack: {
        value: undefined,
        error: [],
        rules: [
            {
                type: "fieldType",
                message: "Music track must have name and url",
                value: "object",
                objectShape: { name: "string", url: "string" }
            }
        ]
    }
}

// Enhanced reducer with proper typing
const reducer = (state: FormState, action: FormAction): FormState => {
    let newState: FormState;
    switch (action.type) {
        case "reset":
            return formFields; // Use formFields instead of initialState

        case "set":
            if (!action.payload) return state;

            const { fieldName, fieldValue } = action.payload;
            newState = { ...state };
            const field = newState[fieldName];

            // Update the field
            const updatedField = {
                ...field,
                value: fieldValue,
                error: validateField(fieldValue, field.rules, { ...newState, [fieldName]: { ...field, value: fieldValue } })
            };

            newState[fieldName] = updatedField;

            return newState;

        case "validate":
            newState = { ...state };
            (Object.keys(newState) as Array<keyof FormState>).forEach(key => {
                const field = newState[key];
                field.error = validateField(field.value, field.rules, newState);
            });
            return newState;

        default:
            return state;
    }
};

// Error interface for components
interface FieldErrors {
    title: string[];
    topic: string[];
    script: string[];
}

function Page() {
    const [formData, dispatch] = useReducer(reducer, formFields);
    const [loading, setLoading] = useState<boolean>(false);
    const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();

    const onHandleInputChange = (fieldName: keyof FormState, fieldValue: any): void => {
        dispatch({
            type: "set",
            payload: {
                fieldName,
                fieldValue
            }
        });
    }

    const hasFormErrors = (): boolean => {
        const validatedData = { ...formData };
        (Object.keys(validatedData) as Array<keyof FormState>).forEach(key => {
            const field = validatedData[key];
            field.error = validateField(field.value, field.rules, validatedData);
        });

        // Exclude musicTrack from required validation if it's optional
        const fieldsToCheck = Object.values(validatedData).filter(field => field !== validatedData.musicTrack);

        return fieldsToCheck.some(field => field.error.length > 0);
    }

    const handleSubmit = (): void => {

        // Update state with validation results
        dispatch({ type: "validate" });

        if (!(hasFormErrors())) {
            GenerateVideo();
        } else {
            toast({
                title: "Validation Error",
                description: "Please fix all errors before submitting",
                variant: "destructive",
            });
        }
    }

    const GenerateVideo = async (): Promise<void> => {
        if (user && user.credits <= 0) {
            toast({
                title: "Error",
                description: "You don't have enough credits to create a video",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Save to database
            const resp = await CreateInitialVideoRecord({
                title: formData.title.value,
                topic: formData.topic.value,
                videoStyle: formData.videoStyle.value,
                caption: formData.captionStyle.value,
                voice: formData.voice.value,
                musicTrack: formData.musicTrack.value, // Add musicTrack to the record
                //@ts-ignore
                uid: user._id,
                createdBy: user?.email || "Unknown",
            });
            
            const newAudioUrl = formData.audioUrl.value ? await moveSupabaseFile(formData.title.value,formData.audioUrl.value, resp) : '';

            const result = await axios.post('/api/generate-video-data', {
                ...Object.fromEntries(
                    Object.entries(
                        { ...formData , 
                            audioUrl: {...formData.audioUrl,value:newAudioUrl}
                        }
                    ).map(([key, value]) => [key, value.value])
                ),
                recordId: resp,
            });

            if (result.data?.error) {
                toast({
                    title: "Error",
                    description: result.data.error,
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Success",
                description: "Video generation in progress. Check your dashboard for updates.",
            });

            // Redirect to video page
            router.push(`/dashboard`);

            console.log(result);
        } catch (error) {
            console.error('Error generating video:', error);
            toast({
                title: "Error",
                description: "Failed to generate video. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className="text-3xl">Create New Video</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-7">
                <div className="col-span-2 p-7 border rounded-xl h-[70vh] overflow-auto">

                    <Title
                        onHandleInputChange={onHandleInputChange}
                        errors={formData.title.error}
                    />
                    <Content
                        onHandleInputChange={onHandleInputChange}
                        errors={{
                            topic: formData.topic.error,
                            script: formData.script.error
                        }}
                    />
                    <Voice
                        onHandleInputChange={onHandleInputChange}
                        errors={formData.voice.error}
                    />
                    <VideoStyle
                        onHandleInputChange={onHandleInputChange}
                        errors={formData.videoStyle.error}
                    />
                    <Captions
                        onHandleInputChange={onHandleInputChange}
                        errors={formData.captionStyle.error}
                    />
                    <MusicSelection
                        onHandleInputChange={onHandleInputChange}
                        errors={formData.musicTrack.error}
                    />
                    <Button
                        disabled={loading}
                        className="w-full mt-5"
                        onClick={handleSubmit}
                    >
                        {loading ? <Loader2Icon className="animate-spin" /> : <WandSparkles />}
                        Generate Video
                    </Button>
                </div>
                <div className="col-span-1">
                    <Preview formData={{
                        videoStyle: formData.videoStyle.value,
                        captionStyle: formData.captionStyle.value
                    }} />
                </div>
            </div>
        </div>
    );
}

export default Page;
