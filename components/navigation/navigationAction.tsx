'use client';

import { Plus } from "lucide-react";
import Image from "next/image";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div>
            <div className="group flex items-center">
                <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700">
                    <Image src='/Logo.png' alt="Logo" height={30} width={30} />
                </div>
            </div>
            <ActionTooltip side="right" align="center" label="Create A Server">
                <button className="group flex items-center pt-3" onClick={() => onOpen('createServer')}>
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-400">
                        <Plus className="group-hover:text-white transition text-emerald-400" size={35} />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}