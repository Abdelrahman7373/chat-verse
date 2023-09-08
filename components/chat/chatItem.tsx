'use client';

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberRole, Memeber, Profile } from "@prisma/client";
import { UserAvatar } from "../userAvatar";
import { useRouter, useParams } from 'next/navigation';
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useModal } from '@/hooks/use-modal-store';
import ChatContentStyle from '../chat-content-style';



interface ChatItemProps {
    id: string;
    content: string;
    member: Memeber & {profile: Profile;};
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Memeber;
    isUpdated: boolean;
    socketUrl: string
    socketQuery: Record<string, string>;
}


const roleIconMap = {'MEMBER': null, 'MODERATOR': <ShieldCheck className="h-6 w-6 ml-2 text-cyan-400" />, 'ADMIN': <ShieldAlert className="h-6 w-6 ml-2 text-[#FF1818]" />}

const formSchema = z.object({
    content: z.string().min(1),
});



export const ChatItem = ({id,content,member,timestamp,fileUrl,deleted,currentMember,isUpdated,socketUrl,socketQuery}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const params = useParams();
    const router = useRouter();
    const {onOpen} = useModal();
    const fileType = fileUrl?.split('.').pop();
    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: {content: content} });
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && (isAdmin || isOwner) && !fileUrl;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;
    const isZip = fileType === 'zip' && fileUrl;


    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`, query: socketQuery,
            });

            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    const onMemberClick = () => {
        if(member.id === currentMember.id) {return;}

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }



    useEffect(() => {
        form.reset({content: content,});
    }, [content]);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if(event.key === 'Escape' || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);



    return (
        <div className="relative group flex items-center rounded-full hover:bg-gray-50 dark:hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">{member.profile.name}</p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image fill src={fileUrl} alt={content} className="object-cover" />
                        </a>
                    )}
                    {isPDF && (
                        <div className="flex items-center -2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-cyan-200 stroke-cyan-400" />
                            <a href={fileUrl} target="_blank" rel='noopener noreferrer' className="ml-2 text-sm text-cyan-500 dark:text-cyan-400 hover:underline">
                                <ActionTooltip label={fileUrl} side='left'>
                                    PDF file
                                </ActionTooltip>
                            </a>
                        </div>
                    )}
                    {isZip && (
                        <div className="flex items-center -2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-cyan-200 stroke-cyan-400" />
                            <a href={fileUrl} rel='noopener noreferrer' className="ml-2 text-sm text-cyan-500 dark:text-cyan-400 hover:underline">
                                <ActionTooltip label={fileUrl} side='left'>
                                    ZIP file
                                </ActionTooltip>
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn('text-sm text-zinc-600 dark:text-zinc-300', deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1')}>
                            <ChatContentStyle text={content} maxWordsPerLine={50} />
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center w-full gap-x-2 pt-2'>
                                <FormField control={form.control} name='content'
                                    render={({field}) => (
                                        <FormItem className='flex-1'>
                                            <FormControl>
                                                <div className='relative w-full'>
                                                    <Input disabled={isLoading} className='p-2 bg-gray-100 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200' placeholder='Edit' {...field} />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size='sm' variant={'cyan'} disabled={isLoading}>
                                    Save
                                </Button>
                            </form>
                            <span className='text[10px] mt-1 text-zinc-400'>
                                Press Escape to Cancel, Press Enter to Save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                        </ActionTooltip>
                    )}
                    <Separator className='h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
                    <ActionTooltip label="Delete">
                        <Trash onClick={() => onOpen('deleteMessage', {apiUrl: `${socketUrl}/${id}`, query: socketQuery})} className="cursor-pointer ml-auto w-5 h-5 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}