import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

import '../../../public/styles/MainLayout.css'; 

const MainLayout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">
                    {children} 
                </main>
            </div>
             
        </div>
    );
};

export default MainLayout;

