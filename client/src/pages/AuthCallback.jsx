import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setRawToken, token } = useAuth();
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        if (!processed && !token) {
            const searchParams = new URLSearchParams(location.search);
            const receivedToken = searchParams.get('token');

            if (receivedToken) {
                setRawToken(receivedToken);
                setProcessed(true);
            } else {
                navigate('/login');
            }
        }
    }, [location, setRawToken, navigate, processed, token]);

    useEffect(() => {
        if (token && processed) {
            navigate('/home', { replace: true });
        }
    }, [token, navigate, processed]);

    return <div>Dang xu li dang nhap ... </div>;
};

export default AuthCallback;
