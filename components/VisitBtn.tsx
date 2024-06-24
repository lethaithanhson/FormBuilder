"use client";
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const VisitBtn = ({ shareUrl }: { shareUrl: string }) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) {
        return null
    }

    const shareLink = `${window.location.origin}/submit/${shareUrl}`

    return (
        <Button
            className='w-[200px] bg-gradient-to-r from-red-500 to-amber-500 uppercase font-extrabold tracking-widest text-white'
            onClick={() => {
                window.open(shareLink, "_blank");
            }}>
            Visit
        </Button>
    )
}

export default VisitBtn