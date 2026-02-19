"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Input, Select } from '@/components/UI';
import Modal from '@/components/Modal';

export default function ProvidersPage() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        service_type: '',
        min_rating: '',
        max_rate: '',
        available: false
    });
const { service_type, max_rate, available } = filters;

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service_type: 'Regular Cleaning',
        hourly_rate: '',
        is_available: true
    });

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            // Build query params: only include service_type (ignore "All Services"), max_rate, and available
            if (filters.service_type && filters.service_type !== '' && filters.service_type !== 'All Services') {
                params.append('service_type', filters.service_type);
            }
            if (filters.max_rate !== '' && filters.max_rate != null) {
                params.append('max_rate', String(filters.max_rate));
            }
            if (filters.available) {
                params.append('available', 'true');
            }

            const query = params.toString();
            const url = `/providers${query ? `?${query}` : ''}`;
            console.debug('[Providers] Fetching:', url, { filters });
            const res = await api.get(url);
            console.debug('[Providers] Response count:', Array.isArray(res.data) ? res.data.length : 'N/A');
            setProviders(res.data);
        } catch (error) {
            console.error("Error fetching providers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, [service_type, max_rate, available]);

    const handleFilterChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFilters({ ...filters, [e.target.name]: value });
    };

    const handleOpenModal = (provider = null) => {
        if (provider) {
            setEditingProvider(provider);
            setFormData({
                name: provider.name,
                email: provider.email,
                phone: provider.phone || '',
                service_type: provider.service_type || 'Regular Cleaning',
                hourly_rate: provider.hourly_rate || '',
                is_available: provider.is_available
            });
        } else {
            setEditingProvider(null);
            setFormData({
                name: '', email: '', phone: '',
                service_type: 'Regular Cleaning', hourly_rate: '', is_available: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProvider) {
                await api.put(`/providers/${editingProvider.id}`, formData);
            } else {
                await api.post('/providers', formData);
            }
            setIsModalOpen(false);
            fetchProviders();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this provider?')) {
            try {
                await api.delete(`/providers/${id}`);
                fetchProviders();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <div className="container section">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Service Providers</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your cleaning professionals</p>
                </div>
                <Button onClick={() => handleOpenModal()}>+ Add Provider</Button>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'end' }}>
                    <Select
                        label="Service Type"
                        name="service_type"
                        value={filters.service_type}
                        onChange={handleFilterChange}
                        options={[
                            { value: '', label: 'All Services' },
                            { value: 'Regular Cleaning', label: 'Regular Cleaning' },
                            { value: 'Deep Cleaning', label: 'Deep Cleaning' },
                            { value: 'Office Cleaning', label: 'Office Cleaning' }
                        ]}
                    />
                    <Input
                        label="Max Hourly Rate ($)"
                        type="number"
                        name="max_rate"
                        value={filters.max_rate}
                        onChange={handleFilterChange}
                    />
                    <div style={{ paddingBottom: '1rem' }}>
                        <label className="flex items-center gap-4" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="available"
                                checked={filters.available}
                                onChange={handleFilterChange}
                                style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                            <span className="input-label" style={{ marginBottom: 0 }}>Show Available Only</span>
                        </label>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
                {providers.map((p) => (
                    <Card key={p.id}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{p.name}</h3>
                            <span className={`badge badge-${p.is_available ? 'success' : 'error'}`}>
                                {p.is_available ? 'Available' : 'Busy'}
                            </span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {p.service_type}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div className="flex justify-between" style={{ marginBottom: '0.2rem' }}>
                                <span>Rate:</span>
                                <span style={{ fontWeight: 600 }}>${p.hourly_rate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rating:</span>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>★ {p.rating}</span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <Button variant="secondary" onClick={() => handleOpenModal(p)} style={{ flex: 1 }}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(p.id)} style={{ flex: 1 }}>Delete</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {!loading && providers.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    No service providers found fitting criteria.
                </p>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProvider ? 'Edit Provider' : 'New Provider'}
            >
                <form onSubmit={handleSubmit}>
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <div className="grid grid-cols-3 gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <Select
                            label="Service Type"
                            name="service_type"
                            value={formData.service_type}
                            onChange={handleChange}
                            options={[
                                { value: 'Regular Cleaning', label: 'Regular Cleaning' },
                                { value: 'Deep Cleaning', label: 'Deep Cleaning' },
                                { value: 'Office Cleaning', label: 'Office Cleaning' }
                            ]}
                        />
                        <Input label="Hourly Rate" name="hourly_rate" type="number" value={formData.hourly_rate} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                        <label className="flex items-center gap-4" style={{ cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleChange}
                                style={{ width: '1.2rem', height: '1.2rem' }}
                            />
                            <span className="input-label" style={{ marginBottom: 0 }}>Available for bookings</span>
                        </label>
                    </div>

                    <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingProvider ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
