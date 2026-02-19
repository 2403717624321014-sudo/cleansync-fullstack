"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, Button } from '@/components/UI';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    providers: 0,
    bookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, providersRes, bookingsRes] = await Promise.all([
          api.get('/customers'),
          api.get('/providers'),
          api.get('/bookings')
        ]);

        const bookings = bookingsRes.data;
        // Sort by id desc or created_at desc to get recent
        const sortedBookings = bookings.sort((a, b) => b.id - a.id).slice(0, 5);

        setStats({
          customers: customersRes.data.length,
          providers: providersRes.data.length,
          bookings: bookings.length
        });
        setRecentBookings(sortedBookings);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container section flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Dashboard</h1>

      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '3rem' }}>
        <Card title="Total Customers">
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>
            {stats.customers}
          </div>
          <Link href="/customers" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
            View all customers →
          </Link>
        </Card>

        <Card title="Service Providers">
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--secondary)' }}>
            {stats.providers}
          </div>
          <Link href="/providers" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
            View all providers →
          </Link>
        </Card>

        <Card title="Total Bookings">
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#8B5CF6' }}>
            {stats.bookings}
          </div>
          <Link href="/bookings" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
            View all bookings →
          </Link>
        </Card>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2>Recent Bookings</h2>
        <Link href="/bookings">
          <Button variant="secondary">Manage Bookings</Button>
        </Link>
      </div>

      <Card>
        {recentBookings.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.service_date}</td>
                    <td>
                      <span className={`badge badge-${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>${booking.total_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No bookings found.</p>
        )}
      </Card>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status?.toLowerCase()) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    case 'completed': return 'info';
    default: return 'secondary';
  }
}
