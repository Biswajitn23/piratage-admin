import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


export default function Login({ onLogin }: { onLogin: (status: boolean) => void }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use an environment variable or simple hardcoded password for now
        if (password === 'hackers@123') {
            onLogin(true);
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Piratage Admin</h2>
                <p>Enter the admin password to continue</p>
                <form onSubmit={handleSubmit}>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
