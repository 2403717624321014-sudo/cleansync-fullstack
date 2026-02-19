import Link from 'next/link';
import { Button } from '@/components/UI';

export default function NotFound() {
    return (
        <div className="container section flex justify-center items-center" style={{ minHeight: '60vh', flexDirection: 'column', textAlign: 'center' }}>
            <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary)' }}>404</h1>
            <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/">
                <Button>Go Back Home</Button>
            </Link>
        </div>
    );
}
