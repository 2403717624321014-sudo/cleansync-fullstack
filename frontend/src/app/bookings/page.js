"use client";
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Card, Button, Input, Select } from '@/components/UI';
import Modal from '@/components/Modal';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [providers, setProviders] = useState([]);

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    // Visible bookings are derived from the fetched `bookings` list and filtered client-side by exact, case-sensitive status match
    const visibleBookings = useMemo(() => {
        if (activeTab === 'All') return bookings;
        return bookings.filter(b => b.status === activeTab);
    }, [bookings, activeTab]);

    // Form State
    const [formData, setFormData] = useState({
        customer_id: '',
        provider_id: '',
        service_date: '',
        service_time: '',
        duration_hours: 2,
        special_instructions: ''
    });

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = {};
            // Status filtering is done client-side using exact, case-sensitive matches
            if (filterDate) params.service_date = filterDate;
            const res = await api.get('/bookings', { params });
            setBookings(res.data);
        } catch (error) {
            console.error("Error fetching bookings:", error.message || error?.response?.data || error);
        } finally {
            setLoading(false);
        }
    }; 

    const fetchDropdownData = async () => {
        try {
            const [custRes, provRes] = await Promise.all([
                api.get('/customers'),
                api.get('/providers/available')
            ]);
            setCustomers(custRes.data);
            setProviders(provRes.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error?.message || error?.toString?.() || error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filterDate]);

    useEffect(() => {
        if (isModalOpen) fetchDropdownData();
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings', formData);
            setIsModalOpen(false);
            fetchBookings();
            // Reset form
            setFormData({
                customer_id: '',
                provider_id: '',
                service_date: '',
                service_time: '',
                duration_hours: 2,
                special_instructions: ''
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCancel = async (id) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            await api.put(`/bookings/${id}/cancel`);
            fetchBookings(); // refresh list to show "Cancelled"
        } catch (error) {
            alert(error.message);
        }
    }
};


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container section">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Bookings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Schedule and manage service appointments</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>+ New Booking</Button>
            </div>

            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <div className="flex gap-4">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                border: 'none',
                                background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div>
                    <Input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                </div>
            </div>

            <Card>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date & Time</th>
                                    <th>Customer ID</th>
                                    <th>Provider ID</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleBookings.map((b) => (
                                    <tr key={b.id}>
                                        <td>#{b.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{b.service_date}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{b.service_time} ({b.duration_hours}h)</div>
                                        </td>
                                        <td>Cust #{b.customer_id}</td>
                                        <td>Prov #{b.provider_id}</td>
                                        <td>${b.total_cost}</td>
                                        <td>
                                            <span className={`badge badge-${getStatusBadge(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                disabled={b.status === 'Cancelled' || b.status === 'Completed'}
                                                style={{
                                                    background: 'none', border: 'none',
                                                    color: (b.status === 'Cancelled' || b.status === 'Completed') ? 'var(--text-secondary)' : 'var(--danger)',
                                                    cursor: 'pointer', fontWeight: 600
                                                }}
                                                onClick={() => handleCancel(b.id)}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {visibleBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Booking"
            >
                <form onSubmit={handleSubmit}>
                    <Select
                        label="Customer"
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                        required
                        options={[
                            { value: '', label: 'Select Customer' },
                            ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.email})` }))
                        ]}
                    />
                    <Select
                        label="Service Provider"
                        name="provider_id"
                        value={formData.provider_id}
                        onChange={handleChange}
                        required
                        options={[
                            { value: '', label: 'Select Provider' },
                            ...providers.map(p => ({ value: p.id, label: `${p.name} ($${p.hourly_rate}/hr)` }))
                        ]}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Date" name="service_date" type="date" value={formData.service_date} onChange={handleChange} required />
                        <Input label="Time" name="service_time" type="time" value={formData.service_time} onChange={handleChange} required />
                        <Select
                            label="Duration"
                            name="duration_hours"
                            value={formData.duration_hours}
                            onChange={handleChange}
                            options={[1, 2, 3, 4, 5, 6, 7, 8].map(h => ({ value: h, label: `${h} Hours` }))}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Special Instructions</label>
                        <textarea
                            name="special_instructions"
                            className="input-field"
                            value={formData.special_instructions}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Booking</Button>
                    </div>
                </form>
            </Modal>
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
