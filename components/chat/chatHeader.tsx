import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../userAvatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";


interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}



export const ChatHeader = ({serverId,name,type,imageUrl}:ChatHeaderProps) => {
    return (
        <div className="fixed dark:bg-[#313338] bg-white">
            <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
                <MobileToggle serverId={serverId} />
                {type === 'channel' && (
                    <>
                        <Hash className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mr-2" />
                        <p className="font-semibold text-md text-black dark:text-white">{name}</p>
                        <div className="md:ml-[880px] ml-9 flex items-center">
                            <SocketIndicator />
                        </div>
                    </>
                )}
                {type === 'conversation' && (
                    <>
                        <UserAvatar src={imageUrl} className="h-9 w-9 md:h-9 md:w-9 mr-2" />
                        <p className="font-semibold text-md text-black dark:text-white">{name}</p>
                        <div className="md:ml-[750px] ml-10 flex items-center">
                            <ChatVideoButton />
                            <SocketIndicator />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
};