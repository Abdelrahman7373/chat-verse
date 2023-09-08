'use client';

import qs from 'query-string';
import { ServerWithMembersWithProfiles } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../userAvatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger, DropdownMenuSub } from '@/components/ui/dropdown-menu'
import { MemberRole } from "@prisma/client";
import axios from 'axios';
import { useRouter } from 'next/navigation';



const roleIconMap = {'MEMBER': null, 'MODERATOR': <ShieldCheck className="h-6 w-6 ml-2 text-cyan-400" />, 'ADMIN': <ShieldAlert className="h-6 w-6 text-[#FF1818]" />}




export const MembersModal = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");
    const isModalOpen = isOpen && type === 'members';
    const {server} = data as {server: ServerWithMembersWithProfiles};

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {serverId: server?.id,},
            });

            const response = await axios.patch(url, {role});

            router.refresh();
            onOpen('members', {server: response.data});
        } catch (error) {
            console.log(error);
        } finally {setLoadingId("");}
    }

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {serverId: server?.id},
            });

            const response = await axios.delete(url);
            router.refresh();
            onOpen('members', {server: response.data})
        } catch (error) {
            console.log(error);
        } finally {setLoadingId("");}
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-gray-950 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center text-zinc-500">
                    {server?.members?.length} Members
                </DialogDescription>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-2">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-6 w-6 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="h-6 w-6 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MEMBER')}>
                                                            <Shield className="h-6 w-6 mr-2" />
                                                            Member
                                                            <h1 className="pl-10"></h1>
                                                            {member.role === 'MEMBER' && (<Check className="h-6 w-6 ml-auto text-[#39FF14]" />)}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
                                                            <ShieldCheck className="h-6 w-6 mr-2" />
                                                            Moderator
                                                            <h1 className="pl-10"></h1>
                                                            {member.role === 'MODERATOR' && (<Check className="h-6 w-6 ml-auto text-[#39FF14]" />)}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className="h-6 w-6 mr-2" />
                                                Kcick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-cyan-400 ml-auto h-6 w-6" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
};