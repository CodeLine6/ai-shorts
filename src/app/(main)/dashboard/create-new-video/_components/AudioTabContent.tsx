"use client"

import { Button } from "@/components/ui/button";
import { FileAudio, Mic, Square, Play, Pause } from "lucide-react";
import { FilesGrid, UppyContext, useDropzone, useFileInput} from '@uppy/react'
import { useContext, useState, useRef, useEffect} from "react";
import { FilesContext } from "../layout";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import '@uppy/audio/dist/style.min.css';
import { FormState } from "../types";

function AudioTabContent({onHandleInputChange,clearScriptandTopic}: {onHandleInputChange: (fieldName: keyof FormState, fieldValue: string | undefined) => void, clearScriptandTopic: () => void}) {
    const { uppy, progress, status } = useContext(UppyContext);
    const uploadedFile = useContext(FilesContext)
    const { getRootProps, getInputProps } = useDropzone({ noClick: true});
    const { getButtonProps, getInputProps: getFileInputProps } = useFileInput({
        accept: 'audio/*',
        multiple: false,
    });

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Start recording function
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                    ? 'audio/webm;codecs=opus' 
                    : 'audio/webm'
            });
            
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { 
                    type: mediaRecorder.mimeType 
                });
                setAudioBlob(blob);
                setHasRecorded(true);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
            setRecordingTime(0);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    // Stop recording function
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    // Play/pause recorded audio
    const togglePlayback = () => {
        if (!audioBlob) return;

        if (!audioRef.current) {
            audioRef.current = new Audio(URL.createObjectURL(audioBlob));
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // Upload recorded audio to Uppy
    const uploadRecordedAudio = () => {
        if (!audioBlob) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `recorded-audio-${timestamp}.webm`;
        
        const file = new File([audioBlob], fileName, {
            type: audioBlob.type,
        });

        try {
          uppy?.getFiles().forEach(file => uppy.removeFile(file.id));
          uppy.addFile({
                name: fileName,
                type: audioBlob.type,
                data: file,
                source: 'audio-recorder',
                isRemote: false
            });

            // Reset recording state
            setAudioBlob(null);
            setHasRecorded(false);
            setRecordingTime(0);
            if (audioRef.current) {
                URL.revokeObjectURL(audioRef.current.src);
                audioRef.current = null;
            }
        } catch (error) {
            console.error('Error adding file to Uppy:', error);
        }
    };

    // Cancel recording
    const cancelRecording = () => {
        setAudioBlob(null);
        setHasRecorded(false);
        setRecordingTime(0);
        setIsPlaying(false);
        
        if (audioRef.current) {
            URL.revokeObjectURL(audioRef.current.src);
            audioRef.current = null;
        }
    };

    // Format time display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioRef.current) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            uppy?.getFiles().forEach((file) => uppy?.removeFile(file.id))
            onHandleInputChange('audioUrl', undefined);
        };
    }, []);

    useEffect(() => {
        if (uploadedFile.url) {
            onHandleInputChange('audioUrl', uploadedFile.url);
            onHandleInputChange('script', undefined);
            onHandleInputChange('voice', undefined);
            onHandleInputChange('topic', undefined);
            clearScriptandTopic();
        }
        else {
            onHandleInputChange('audioUrl', undefined);
        }
    }, [uploadedFile]);

    return (
        <div className="grid grid-cols-2 min-h-32 gap-2">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg transition-colors duration-200 relative">
                <div className={`absolute inset-0 h-full w-full rounded-md bg-slate-900 z-0`}
                    style={{ clipPath: `inset(0 0 calc(100% - ${progress}%) 0)`, transition: progress  ?  "clip-path 0.3s ease-in-out" : "none" }}
                ></div>
                <input {...getInputProps()} className="hidden" />
                
                {status === 'init' && <>
                    <div {...getRootProps()} className="h-full" >
                        <input {...getFileInputProps()} className="hidden" />
                        <button
                            {...getButtonProps()}
                            className="transition-colors p-2 rounded-md text-sm h-full w-full z-10"
                        >
                            <div className="flex justify-center z-10">
                                <FileAudio />
                            </div>
                            Drop File Here or Click to Add
                        </button>
                    </div>
                </> }
                <div className="relative z-10 px-6">
                    <FilesGrid columns={1} />   
                </div> 
             
                {status === 'uploading' && 
                    <div className="relative z-10 text-center p-2">
                        Uploading {progress}%
                    </div>
                }
            </div> 

            {/* Audio Recording Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center gap-3">
                {!hasRecorded ? (
                    <>
                        {!isRecording ? (
                            <Button 
                                onClick={startRecording} 
                                variant="outline" 
                                className="border-0 h-full w-full py-4 [&_svg]:size-6"
                            >
                                <Mic className="mr-2" /> 
                                Start Recording
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2 text-red-500">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
                                </div>
                                <Button 
                                    onClick={stopRecording} 
                                    variant="destructive" 
                                    size="sm"
                                >
                                    <Square className="mr-2" fill="currentColor" /> 
                                    Stop Recording
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col p-4 items-center gap-2 w-full">
                        <div className="text-sm text-gray-600 mb-2">
                            Recording: {formatTime(recordingTime)}
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                            <Button 
                                onClick={togglePlayback} 
                                variant="outline" 
                                size="sm"
                            >
                                {isPlaying ? <Pause /> : <Play />}
                            </Button>
                        </div>

                        <div className="flex gap-2 w-full">
                            <Button 
                                onClick={cancelRecording} 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={uploadRecordedAudio} 
                                variant="default" 
                                size="sm"
                                className="flex-1"
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AudioTabContent;