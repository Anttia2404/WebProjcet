// File: client/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import '../../../public/styles/Sidebar.css'; // Import CSS

const Sidebar = () => {
    const getNavLinkClass = ({ isActive }) =>
        isActive ? "sidebar-link active" : "sidebar-link";

    return (
        <aside className="sidebar">
            <nav>
                <ul className="sidebar-nav-list">
                    <li className="sidebar-nav-item">
                        <NavLink to="/home" className={getNavLinkClass}>
                            <HomeIcon sx={{ width: 20, height: 20 }} />
                            <span className="sidebar-link-text">Trang chủ</span>
                        </NavLink>
                    </li>

                    <li className="sidebar-nav-item">
                        <NavLink to="/forum" className={getNavLinkClass}>
                            <NewspaperIcon sx={{ width: 20, height: 20 }} />
                            <span className="sidebar-link-text">Diễn đàn</span>
                        </NavLink>
                    </li>

                    <li className="sidebar-nav-item">
                        <NavLink to="/marketplace" className={getNavLinkClass}>
                            <ShoppingBagIcon sx={{ width: 20, height: 20 }} />
                            <span className="sidebar-link-text">Pass đồ</span>
                        </NavLink>
                    </li>

                    <li className="sidebar-nav-item">
                        <NavLink to="/chatbot" className={getNavLinkClass}>
                            <SmartToyIcon sx={{ width: 20, height: 20 }} />
                            <span className="sidebar-link-text">Chatbot KTX</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
