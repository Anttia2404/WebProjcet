import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

// SVG Icons (Đơn giản)
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
);

const FacebookIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1.5.5-1.5 1.5V12h3l-.5 3h-2.5v7.8c4.56-.93 8-4.96 8-9.8z" fill="#ffffffff"/></svg>
);


const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState(''); // State mới cho Họ và tên
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                if (password !== confirmPassword) {
                    setError('Mật khẩu xác nhận không khớp.');
                    return;
                }
                await api.post('/auth/register', { email, password, fullName });
                await login(email, password);
            } else {
                await login(email, password);
            }
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `http://localhost:3000/api/auth/${provider}`;
    };

    return (
        <div className='auth-form-container'>
            <form onSubmit={handleSubmit} className="auth-form">
            <h2>{isRegistering ? 'Đăng Ký' : 'Đăng Nhập'}</h2>
            <div className='container'>
                <div className='container-login'>
                    {isRegistering && (
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            className="auth-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            className="auth-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-icon">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {isRegistering && (
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Xác nhận mật khẩu"
                                className="auth-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    )}

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-button">
                        {isRegistering ? 'Đăng Ký' : 'Đăng Nhập'}
                    </button>
                </div>

                <div className="oauth-buttons">
                    <button type="button" className="oauth-button google" onClick={() => handleOAuthLogin('google')}>
                        <GoogleIcon /><span>Đăng nhập với Google</span>
                    </button>
                    <button type="button" className="oauth-button facebook" onClick={() => handleOAuthLogin('facebook')}>
                        <FacebookIcon /><span>Đăng nhập với Facebook</span>
                    </button>
                </div>
            </div>
            <a
                href="#"
                className="auth-toggle"
                onClick={() => setIsRegistering(!isRegistering)}
            >
                {isRegistering ? 'Đã có tài khoản?  Đăng nhập' : 'Chưa có tài khoản?  Đăng ký'}
            </a>
        </form>
        </div>
    );
};

export default AuthPage;

