"use client"
import { useUppyWithSupabase } from "@/hooks/useUppyWithSupabase";
import { UppyContextProvider } from "@uppy/react"
import { createContext } from "react";

export const FilesContext = createContext({
    url: '',
    fileName: ''
});

const NewVideoLayout = ({ children }: { children: React.ReactNode }) => {
    const { uppy,uploadedFile } = useUppyWithSupabase({ bucketName: "sample" });
    return   <UppyContextProvider uppy={uppy}>
        <FilesContext.Provider value={uploadedFile}>{children}</FilesContext.Provider>
    </UppyContextProvider>
}

export default NewVideoLayout