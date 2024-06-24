"use client";
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImShare } from 'react-icons/im';
import { toast } from './ui/use-toast';

const FormLinkShare = ({ shareUrl }: { shareUrl: string }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) {
        return null
    }

    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    return (
        <div className='w-full'>
            <div className='flex flex-col space-y-1.5 p-6 px-0 pb-3'>
                <h3 className="font-semibold leading-none tracking-tight">Share this form</h3>
                <p className="text-sm text-muted-foreground">Anyone with the link can view this document.</p>
            </div>
            <div className="flex flex-grow gap-2 items-center">
                <Input value={shareLink} readOnly />
                <Button className='w-[230px]' onClick={() => {
                    navigator.clipboard.writeText(shareLink)
                    toast({
                        title: 'Coppied!',
                        description: 'Link coppied to clipboard'
                    })
                }}>
                    <ImShare className="mr-2 h-4 w-4" />
                    Share link
                </Button>
            </div>
        </div>
    )
}

export default FormLinkShare