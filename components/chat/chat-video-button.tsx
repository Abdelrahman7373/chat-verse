'use client';


import qs from 'query-string';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Video, VideoOff } from 'lucide-react';
import { ActionTooltip } from '../action-tooltip';



export const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isVideo = searchParams?.get('video');
    const Icon = isVideo ? VideoOff : Video;
    const toolTipLabel = isVideo ? 'End Video Call' : 'Start Video Call';

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query:{
                video: isVideo ? undefined : true,
            }
        }, {skipNull: true})
        router.push(url);
    }

    return (
        <ActionTooltip side='bottom' label={toolTipLabel}>
            <button onClick={onClick} className='hover:opacity-75 transition mr-7'>
                <Icon className='h-7 w-7 text-zinc-500 dark:text-zinc-400' />
            </button>
        </ActionTooltip>
    )
}