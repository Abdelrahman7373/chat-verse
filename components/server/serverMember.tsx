'use client';

import { cn } from "@/lib/utils";
import { MemberRole, Memeber, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../userAvatar";


interface ServerMemberProps {
    member: Memeber & {profile: Profile};
    server: Server;
}

const roleIconMap = {
    [MemberRole.MEMBER]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-6 w-6 text-cyan-400" />,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-6 w-6 text-[#FF1818]" />
};


export const ServerMember = ({member,server}:ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    return (
        <button onClick={onClick} className={cn('group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition mb-1', params?.memberId === member.id && 'bg-gray-200 dark:bg-zinc-700')}>
            <UserAvatar src={member.profile.imageUrl} className="h-9 w-9 md:h-9 md:w-9" />
            <p className={cn('font-semibold text-sm  text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition', params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white')}>{member.profile.name}</p>
            {icon}
        </button>
    )
}