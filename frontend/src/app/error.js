"use client"; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/UI';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="container section flex justify-center items-center" style={{ minHeight: '60vh', flexDirection: 'column', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Something went wrong!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                We apologized for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()}>Try again</Button>
                <Button variant="secondary" onClick={() => window.location.href = "/"}>Go Home</Button>
            </div>
        </div>
    );
}
