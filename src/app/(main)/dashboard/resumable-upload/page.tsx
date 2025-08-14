"use client";
import { useEffect } from "react";
import Dashboard from "@uppy/dashboard";
import Audio from '@uppy/audio';
import { useUppyWithSupabase } from "@/hooks/useUppyWithSupabase";


function App() {
    const {uppy} = useUppyWithSupabase({ bucketName: "sample" });

    useEffect(() => {
        uppy.use(Dashboard, {
            inline: true,
            target: "#drag-drop-area",
            showProgressDetails: true,
        }).use(Audio);

        return () => {
            const dashboardPlugin = uppy.getPlugin('Dashboard');
            if (dashboardPlugin) {
                uppy.removePlugin(dashboardPlugin);
            }
            const audioPlugin = uppy.getPlugin('Audio');
            if (audioPlugin) {
                uppy.removePlugin(audioPlugin);
            }
        };
    }, []);

    return (
        <>
            <div id="drag-drop-area"></div>
            <div id="record"></div> {/* Audio recorder will render here */}
        </>
    );
}

export default App;
