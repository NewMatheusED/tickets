import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaSignOutAlt } from 'react-icons/fa';
import styles from './Sidenav.module.css';

export default function SideNav() {
    const [isExpanded, setIsExpanded] = useState(false);

    const links = [
        { name: 'Home', path: '/home', icon: <FaHome /> },
        { name: 'Logout', path: '/api/logout', icon: <FaSignOutAlt /> },
    ];

    const { pathname } = useLocation();

    return (
        <nav className={`${styles.nav} ${isExpanded ? styles.navExpanded : styles.navCollapsed}`}>
            <div className={styles.buttonContainer}>
                <button onClick={() => setIsExpanded(!isExpanded)} className={styles.button}>
                    <FaBars />
                </button>
            </div>
            <div className={styles.links}>
                {links.map((link) => (
                    <Link
                        to={link.path}
                        key={link.name}
                        className={`${styles.link} ${pathname === link.path ? styles.active : ''}`}
                    >
                        <div className={`${styles.icon} ${!isExpanded ? styles.collapsed : ''}`}>
                            {link.icon}
                        </div>
                        <span className={`${styles.label} ${isExpanded ? styles.visible : styles.hidden}`}>
                            {link.name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}