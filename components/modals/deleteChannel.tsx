'use client';

import qs from 'query-string';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";




export const DeleteChannel = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === 'deleteChannel';
    const {server, channel} = data;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        } catch (error) {
            console.log(error);
        } finally {setIsLoading(false);}
    };



    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-gray-950 p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete <span className="font-bold text-cyan-400">#{channel?.name}</span> Channel ?!!! &nbsp; <span className="text-[#FF1818]">THIS ACTION CAN NOT BE UNDONE AND ALL THE DATA WILL BE LOST!!!</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} variant={'cyan'} onClick={onClick}>
                            Yes Delete &nbsp; <span className="font-bold text-[#FF1818]">#{channel?.name}</span> &nbsp; Channel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};