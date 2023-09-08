'use client';


import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { MobileToggle } from "./mobile-toggle";


interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}


export const MediaRoom = ({chatId, video, audio}: MediaRoomProps) => {
    const {user} = useUser();
    const [token, setToken] = useState("");


    useEffect(() => {
        if(!user?.firstName || !user?.lastName) return;

        const name = `${user.firstName} ${user.lastName}`;

        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        })()
    }, [user?.firstName, user?.lastName, chatId]);

    if(token === '') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-10 w-10 text-zinc-500 animate-spin my-4 mt-64" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Starting Voice Call...</p>
            </div>
        )
    }


    return (
        <LiveKitRoom className="mt-16" data-lk-theme='default' serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={token} connect={true} video={video} audio={audio}>
            <VideoConference />
        </LiveKitRoom>
    )
}