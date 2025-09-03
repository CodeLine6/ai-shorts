"use client";

import supabase from "@/lib/supabase";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { useEffect, useState } from "react";

const deleteFileFromSupabase = async (bucketName: string, fileName: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const useUppyWithSupabase = ({ bucketName }: { bucketName: string }) => {
    const [uppy] = useState(() => new Uppy({
        restrictions: {
            maxNumberOfFiles: 1,
            allowedFileTypes: ['audio/*'],
        },
        autoProceed: true
    }   
    ));

    const [uploadedFile, setUploadedFiles] = useState<{url: string, fileName: string}>({
        url: '',
        fileName: ''
    });

    useEffect(() => {
        const uploadSuccess = (file: any, response : any) => {
                // Store the uploaded file URL
                if (file && response) {
                    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${file.name}`;
                    //@ts-ignore
                    setUploadedFiles(prev => {
                        return { url: fileUrl, fileName: file.name }
                    });
                    
                    console.log('File uploaded/updated successfully:', fileUrl);
                }
            }

        const handleFileRemove = async (file : any) => {
                // Delete from Supabase when file is removed from Uppy
                if (file && file.name) {
                    const success = await deleteFileFromSupabase(bucketName, file.name);
                    if (success) {
                        // Remove from uploaded files state
                        setUploadedFiles({ url: '', fileName: '' });
                        console.log(`File ${file.name} deleted successfully`);
                    }
                }
            }

        const initializeUppy = async () => {
            
            // Remove existing Tus plugin if it exists
            const existingTusPlugin = uppy.getPlugin('Tus');
            if (existingTusPlugin) {
                uppy.removePlugin(existingTusPlugin);
            }

            uppy.use(Tus, {
                endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/storage/v1/upload/resumable`,
                retryDelays: [0, 3000, 5000, 10000, 20000],
                headers: {
                    authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
                    "x-upsert": "true", // This header enables overwriting existing files
                },
                uploadDataDuringCreation: true,
                removeFingerprintOnSuccess: true,
                chunkSize: 6 * 1024 * 1024,
                allowedMetaFields: [
                    "bucketName",
                    "objectName",
                    "contentType",
                    "cacheControl",
                    "metadata",
                ],
                onError: (error) => console.error("Upload error:", error),
            }).on("file-added", (file) => {
                console.log(`Attempting to upload/update file: ${file.name} with x-upsert: true`);
                file.meta = {
                    ...file.meta,
                    bucketName,
                    objectName: file.name,
                    contentType: file.type,
                    metadata: JSON.stringify({
                        yourCustomMetadata: true,
                    }),
                };
            });
            uppy.on('file-removed', handleFileRemove);
            uppy.on('upload-success', uploadSuccess );  
        };

        initializeUppy();

         // Cleanup
        return () => {
            uppy.off('file-removed', handleFileRemove);
            uppy.off('upload-success', uploadSuccess);
        };
        
    }, [uppy, bucketName]);

        return { uppy, uploadedFile };
;
};
