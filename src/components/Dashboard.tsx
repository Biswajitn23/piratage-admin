import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Image as ImageIcon, LogOut, LayoutDashboard } from 'lucide-react';
import AddEvent from './AddEvent';
import AddGalleryItem from './AddGalleryItem';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
    const location = useLocation();

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <LayoutDashboard size={24} />
                    <h2>Admin Panel</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        <Calendar size={18} /> Add Event
                    </Link>
                    <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
                        <ImageIcon size={18} /> Add Gallery Photo
                    </Link>
                </nav>
                <button className="logout-button" onClick={onLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h1>{location.pathname === '/gallery' ? 'Gallery Management' : 'Event Management'}</h1>
                </header>
                <div className="content-body">
                    <Routes>
                        <Route path="/" element={<AddEvent />} />
                        <Route path="/gallery" element={<AddGalleryItem />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
