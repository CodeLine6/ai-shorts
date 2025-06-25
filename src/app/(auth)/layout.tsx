import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-[500px] ">
                {children}
            </div>
        </div>
    )
}

export default layout