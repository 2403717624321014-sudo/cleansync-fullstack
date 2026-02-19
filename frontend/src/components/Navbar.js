"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path ? 'active' : '';

    return (
        <nav style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        C
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                        CleanSync
                    </span>
                </Link>
                <div className="flex gap-4">
                    <Link href="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link>
                    <Link href="/customers" className={`nav-link ${isActive('/customers')}`}>Customers</Link>
                    <Link href="/providers" className={`nav-link ${isActive('/providers')}`}>Providers</Link>
                    <Link href="/bookings" className={`nav-link ${isActive('/bookings')}`}>Bookings</Link>
                </div>
            </div>
        </nav>
    );
}
