'use client';

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
    const {isConnected} = useSocket();

    if(!isConnected) {
        return (
            <Badge variant='outline' className="bg-yellow-500 text-white">
                Fallback: Low Messaging Speed
            </Badge>
        )
    }

    return (
        <Badge variant='outline' className="bg-emerald-500 text-white">
            Live: Fast Messaging Speed 🔥
        </Badge>
    )
};