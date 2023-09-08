'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";




export const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const origin = useOrigin();
    const isModalOpen = isOpen && type === 'invite';
    const {server} = data;
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
        onClose();
    }

    const onNewLink = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen('invite', {server: response.data});
        } catch (error) {
            console.log(error);
        } finally {setIsLoading(false);}
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-gray-950 p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Invite Link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="bg-gray-50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 space-x-64" value={inviteUrl} />
                        <Button disabled={isLoading} onClick={onCopy} size='icon' variant={'ghost'}>
                            {isCopied ? <Check className="h-6 w-6 text-[#39FF14]" /> : <Copy className="h-6 w-6" />}
                        </Button>
                    </div>
                    <Button onClick={onNewLink} disabled={isLoading} variant={'link'} className="pr-52 text-cyan-500 pt-10">
                        Generate A New Link
                        <RefreshCcw className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
};