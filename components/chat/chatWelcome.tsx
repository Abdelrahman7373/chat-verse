import { Hash } from "lucide-react";
import { UserAvatar } from "../userAvatar";

interface ChatWelcomeProps {
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string;
}



export const ChatWelcome = ({name,type,imageUrl}: ChatWelcomeProps) => {
    return (
        <div className="space-y-4 px-4 mb-7 mt-[490px] md:mt-[380px]">
            {type === 'channel' && (
                <div className="h-[75px] w-[75px] rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            )}

            {type === 'conversation' && (
                <UserAvatar src={imageUrl} className="h-40 w-40" />
            )}

            <p className="text-xl md:text-3xl font-bold">
                {type === 'channel' ? 'Welcome To #':''}{name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === "channel" ? `This is the start of #${name} channel.`: `This is the start of your conversation with ${name}`}
            </p>
        </div>
    )
}