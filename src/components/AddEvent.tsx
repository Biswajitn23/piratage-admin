import React, { useState } from 'react';

// Use production API url when deployed, otherwise localhost for local testing.
const API_URL = import.meta.env.VITE_API_URL || 'https://piratageauc.tech/api';

export default function AddEvent() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        type: 'External',
        coverImage: '',
        description: '',
        location: '',
        venue: '',
        registrationLink: ''
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
            // Add standard timestamp if only date was provided
            let finalDate = formData.date;
            if (finalDate && finalDate.length === 10) {
                finalDate += 'T10:00:00.000Z'; // default 10:00 AM UTC if missing time
            }

            const res = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, date: finalDate })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to add event');
            }

            setStatus({ type: 'success', message: 'Event successfully created!' });
            setFormData({
                title: '',
                date: '',
                type: 'External',
                coverImage: '',
                description: '',
                location: '',
                venue: '',
                registrationLink: ''
            });
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card form-card border-glow">
            <h2>Create New Event</h2>
            <p>This event will automatically show up on the Piratage website.</p>

            {status && (
                <div className={`alert ${status.type}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group row">
                    <div className="col">
                        <label>Title *</label>
                        <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Scrim #12" />
                    </div>
                    <div className="col">
                        <label>Date & Time *</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="External">External</option>
                            <option value="Internal">Internal</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Competition">Competition</option>
                        </select>
                    </div>
                    <div className="col">
                        <label>Cover Image URL (Direct Link)</label>
                        <input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label>Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Virtual / On-Campus" />
                    </div>
                    <div className="col">
                        <label>Venue</label>
                        <input name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g. Discord / Room 4" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="About this event..."></textarea>
                </div>

                <div className="form-group">
                    <label>Registration Link</label>
                    <input name="registrationLink" value={formData.registrationLink} onChange={handleChange} placeholder="https://..." />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Event'}
                </button>
            </form>
        </div>
    );
}
