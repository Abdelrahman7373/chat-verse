'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import qs from 'query-string';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, } from '../ui/form';
import { Button } from '../ui/button';
import { FileUpload } from '../fileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';


const formSchema = z.object({
    fileUrl: z.string().min(1, {message: 'Attachment is required!!'}),
});



export const MessageFileModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'messageFile';
    const {apiUrl, query} = data;
    
    
    const form  = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { fileUrl: '',}
    });
    
    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    }
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            await axios.post(url, {...values, content: values.fileUrl,});

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-gray-950 p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add An Attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send your file
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField control={form.control} name='fileUrl'  
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint='messageFile' value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='px-6 py-4'>
                            <Button disabled={isLoading} variant={'cyan'}>
                                Send Attachment
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};