'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileUpload } from '../fileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';


const formSchema = z.object({
    name: z.string().min(1, {message: 'Server name is required!!'}),
    imageUrl: z.string().min(1, {message: 'Server image is required!!'}),
});



export const CreateServerModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'createServer';

    
    const form  = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {name: '', imageUrl: '',}
    });
    
    const isLoading = form.formState.isSubmitting;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-gray-950 p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Elevate your server's essence with a unique name and stunning image
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField control={form.control} name='imageUrl'  
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint='serverImage' value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField control={form.control} name='name' 
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>Server Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} className='bg-zinc-100/50 border-0 focus-visible:ring-0 text-gray-950 focus-visible:ring-offset-0' placeholder='Enter Server Name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='px-6 py-4'>
                            <Button disabled={isLoading} variant={'cyan'}>
                                Create Server
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};