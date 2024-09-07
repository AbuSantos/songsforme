"use client"
import { ArrowUpIcon, Cross1Icon } from "@radix-ui/react-icons"
import { z } from "zod"
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { useTransition } from "react"
import { MusicSchema } from "@/schemas"
export const AddMusicModal = ({ setIsOpen }) => {
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof MusicSchema>>({
        resolver: zodResolver(MusicSchema),
        defaultValues: {
            // school_id: userId || "",
            artiste_name: "",
            song_duration: 0,
            song_title: "",
            song_url: "",
            image: "",
        }
    })
    const onSubmit = () => {

    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative bg-gray-900  rounded-md w-4/6 py-2 px-4">
                <button onClick={() => setIsOpen(false)} className="text-red-700 cursor-pointer text-end" >
                    <Cross1Icon className="size-4" />
                </button>
                <div className="flex space-x-3 py-3">

                    <div className='w-2/6 border-[1.5px] border-slate-800 border-dashed h-[20rem] rounded-sm flex flex-col items-center justify-center'>
                        <div className="flex flex-col items-center ">
                            <ArrowUpIcon className=" size-8 text-slate-500" />
                            <p className="text-slate-500">Upload a cover Photo</p>
                        </div>
                    </div>

                    <div className="flex-1 px-5 ">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="artiste_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Artiste Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Satoshi Nakamoto"
                                                        type="text"
                                                        disabled={isPending}
                                                        className="py-3 border-none bg-[var(--bgSoft)] outline-none h-12"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >
                                    </FormField>
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="song_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Song Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Addicted"
                                                        type="text"
                                                        disabled={isPending}
                                                        className="py-3 border-none bg-[var(--bgSoft)] outline-none h-12"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="song_duration"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Song Duration</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="00:00 in secs"
                                                        type="text"
                                                        disabled={isPending}
                                                        className="py-3 border-none bg-[var(--bgSoft)] outline-none h-12"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
