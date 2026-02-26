import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Speaker {
    name: string;
    role: string;
    avatar: string;
}

// Use production API url when deployed, otherwise localhost for local testing.
const API_URL = import.meta.env.VITE_API_URL || 'https://www.piratageauc.tech/api';

export default function AddEvent() {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        date: '',
        type: 'Speaker Session',
        status: 'auto',
        coverImage: '',
        description: '',
        location: '',
        venue: '',
        registrationLink: '',
        highlightScene: ''
    });
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSpeakerChange = (index: number, field: keyof Speaker, value: string) => {
        const updatedSpeakers = [...speakers];
        updatedSpeakers[index][field] = value;
        setSpeakers(updatedSpeakers);
    };

    const addSpeaker = () => {
        setSpeakers([...speakers, { name: '', role: '', avatar: '' }]);
    };

    const removeSpeaker = (index: number) => {
        const updatedSpeakers = [...speakers];
        updatedSpeakers.splice(index, 1);
        setSpeakers(updatedSpeakers);
    };

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
                body: JSON.stringify({ ...formData, date: finalDate, speakers: formData.type === 'Speaker Session' ? speakers : [] })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to add event');
            }

            setStatus({ type: 'success', message: 'Event successfully created!' });
            setFormData({
                title: '',
                slug: '',
                date: '',
                type: 'Speaker Session',
                status: 'auto',
                coverImage: '',
                description: '',
                location: '',
                venue: '',
                registrationLink: '',
                highlightScene: ''
            });
            setSpeakers([]);
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
                        <label>URL Slug *</label>
                        <input name="slug" value={formData.slug} onChange={handleChange} required placeholder="e.g. scrim-12" />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label>Date & Time *</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="col">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="Speaker Session">Speaker Session</option>
                            <option value="Hackathon">Hackathon</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Competition">Competition</option>
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="auto">Auto (Calculate from Date)</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="past">Past</option>
                        </select>
                    </div>
                    <div className="col">
                        <label>Cover Image URL</label>
                        <input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="col">
                        <label>Highlight Scene (Optional)</label>
                        <input name="highlightScene" value={formData.highlightScene} onChange={handleChange} placeholder="e.g. cyber, nature, dark" />
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

                {formData.type === 'Speaker Session' && (
                    <div className="form-group">
                        <label className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Speakers</span>
                            <button type="button" onClick={addSpeaker} className="add-btn" style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                                <Plus size={16} /> Add Speaker
                            </button>
                        </label>
                        {speakers.length === 0 && <p className="text-muted" style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '10px' }}>No speakers added yet. Click 'Add Speaker' to include one.</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {speakers.map((speaker, index) => (
                                <div key={index} style={{ display: 'flex', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input
                                            placeholder="Speaker Name"
                                            value={speaker.name}
                                            onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)}
                                            required
                                        />
                                        <input
                                            placeholder="Speaker Role/Title"
                                            value={speaker.role}
                                            onChange={(e) => handleSpeakerChange(index, 'role', e.target.value)}
                                            required
                                        />
                                        <input
                                            placeholder="Avatar URL (Optional)"
                                            value={speaker.avatar}
                                            onChange={(e) => handleSpeakerChange(index, 'avatar', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSpeaker(index)}
                                        style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', padding: '5px' }}
                                        title="Remove Speaker"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
