"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, Button, Input } from '@/components/UI';
import Modal from '@/components/Modal';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchCustomers = async (searchTerm = '') => {
        setLoading(true);
        try {
            const endpoint = searchTerm ? `/customers/search?name=${searchTerm}` : '/customers';
            const res = await api.get(endpoint);
            setCustomers(res.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // Debounce could be added here
        if (e.target.value === '') fetchCustomers();
        else fetchCustomers(e.target.value);
    };

    const handleOpenModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || '',
                address: customer.address || ''
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: '', email: '', phone: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, formData);
            } else {
                await api.post('/customers', formData);
            }
            setIsModalOpen(false);
            fetchCustomers(search);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}`);
                fetchCustomers(search);
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
                    <h1>Customers</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your customer base</p>
                </div>
                <Button onClick={() => handleOpenModal()}>+ Add Customer</Button>
            </div>

            <Card style={{ marginBottom: '2rem' }}>
                <Input
                    placeholder="Search customers by name..."
                    value={search}
                    onChange={handleSearch}
                    style={{ marginBottom: 0 }}
                />
            </Card>

            <Card>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c) => (
                                    <tr key={c.id}>
                                        <td>#{c.id}</td>
                                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.phone || '-'}</td>
                                        <td>
                                            <div className="flex gap-4">
                                                <button
                                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                                                    onClick={() => handleOpenModal(c)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}
                                                    onClick={() => handleDelete(c.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No customers found</td>
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
                title={editingCustomer ? 'Edit Customer' : 'New Customer'}
            >
                <form onSubmit={handleSubmit}>
                    <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

                    <div className="flex justify-between" style={{ marginTop: '2rem' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingCustomer ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
