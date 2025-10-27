import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../../public/styles/Header.css'; 

import textKtx from "../../assets/images/CNC-1.png"

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-logo">
                
                <img src={textKtx} className='header-text'/></div>
            <div className="header-user-info">
                {user && (
                    <>
                        <span>Chào, {user.fullName || user.email}!</span>
                        <button onClick={logout} className="header-logout-button">Đăng xuất</button>
                    </>
                )}
            </div>
        </header>
    );
};



export default Header;

