import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddGalleryItem() {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Hackathons',
        media: '',
        orientation: 'landscape',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await addDoc(collection(db, 'gallery'), {
                ...formData,
                createdAt: new Date().toISOString(),
                created_at: new Date().toISOString()
            });

            setStatus({ type: 'success', message: 'Photo successfully added to gallery!' });
            setFormData({
                title: '',
                category: 'Hackathons',
                media: '',
                orientation: 'landscape',
                description: ''
            });
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card form-card border-glow">
            <h2>Add New Photo</h2>
            <p>This image will be populated live into the main Gallery page.</p>

            {status && (
                <div className={`alert ${status.type}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group row">
                    <div className="col">
                        <label>Photo Title *</label>
                        <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Winner Group Photo" />
                    </div>
                    <div className="col">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Hackathons">Hackathons</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Speaker Session">Speaker Session</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL (Direct Link) *</label>
                    <input name="media" value={formData.media} onChange={handleChange} required placeholder="https://..." />
                </div>

                <div className="form-group">
                    <label>Orientation</label>
                    <select name="orientation" value={formData.orientation} onChange={handleChange}>
                        <option value="landscape">Landscape</option>
                        <option value="portrait">Portrait</option>
                        <option value="square">Square</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Brief context about this photo..."></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Adding Photo...' : 'Add Photo'}
                </button>
            </form>
        </div>
    );
}
