import { UploadDropzone } from "@/lib/uploadthing";
import '@uploadthing/react/styles.css';
import { FileIcon, X } from "lucide-react";
import Image from "next/image";




interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage';
}





export const FileUpload = ({endpoint, onChange, value}:FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if(value && fileType !== 'pdf' && fileType !== 'text' && fileType !== 'video' && fileType !== 'txt') {
    return (
        <div className="relative h-20 w-20">
            <Image fill src={value} alt="Upload" className="rounded-full" />
            <button onClick={() => onChange('')} className="bg-rose-400 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" typeof="button"><X className="h-5 w-5" /></button>
        </div>
    )
  }

  if(value && fileType === 'pdf') {
    return (
      <div className="flex items-center -2 mt-2 rounded-md">
        <FileIcon className="h-10 w-10 fill-cyan-200 stroke-cyan-400" />
        <a href={value} target="_blank" rel='noopener noreferrer' className="ml-2 text-sm text-cyan-500 dark:text-cyan-400 hover:underline">
          {value}
        </a>
        <button onClick={() => onChange('')} className="bg-rose-400 text-white p-1 rounded-full -top-2 -right-2 shadow-sm" typeof="button"><X className="h-5 w-5" /></button>
      </div>
    )
  }

  if(value && fileType === 'zip') {
    return (
      <div className="flex items-center -2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-cyan-200 stroke-cyan-400" />
        <a href={value} target="_blank" rel='noopener noreferrer' className="ml-2 text-sm text-cyan-500 dark:text-cyan-400 hover:underline">
          {value}
        </a>
        <button onClick={() => onChange('')} className="bg-rose-400 text-white p-1 rounded-full -top-2 -right-2 shadow-sm" typeof="button"><X className="h-5 w-5" /></button>
      </div>
    )
  }

  return (
    <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {onChange(res?.[0].url);}} onUploadError={(error: Error) => {console.log(error)}} />
  )
}
