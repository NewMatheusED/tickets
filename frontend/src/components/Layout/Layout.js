import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../Sidenav/Sidenav';

function Layout() {
    return (
        <div style={{ display: 'flex' }}>
            <SideNav />
            <div style={{ flex: 1, marginLeft: '112px' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;