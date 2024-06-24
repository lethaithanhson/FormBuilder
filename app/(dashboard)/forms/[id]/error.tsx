"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react'

const ErrorPage = ({ error }: { error: Error }) => {
    useEffect(() => {
        console.log(error);
    }, [error]);


    return (
        <div className='flex flex-col h-full w-full justify-center items-center gap-4'>
            <h2 className='text-destructive text-3xl'>Something went wrong!</h2>
            <Button asChild>
                <Link href={'/'}>
                    Go back to home
                </Link>
            </Button>
        </div>
    )
}

export default ErrorPage