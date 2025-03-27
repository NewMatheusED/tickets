import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Bolt } from 'lucide-react';
import { getCookie } from '../../utils/cookies';
import styles from './Sidenav.module.css';

export default function SideNav() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ username: '', profile_picture: 'default.jpg' });

    useEffect(() => {
        const pollInterval = setInterval(() => {
            const userCookie = getCookie('user');
            if (userCookie) {
                try {
                    const user = JSON.parse(userCookie);
                    const newUsername = user.username || '';
                    const newPicture = user.profile_picture || 'default.jpg';
                    // Atualiza o estado somente se houver alteração
                    setUserInfo(prev => {
                        if (prev.username !== newUsername || prev.profile_picture !== newPicture) {
                            return { username: newUsername, profile_picture: newPicture };
                        }
                        return prev;
                    });
                } catch (error) {
                    console.error("Erro ao converter o cookie 'user':", error);
                }
            }
        }, 100);
        
        return () => clearInterval(pollInterval);
    }, []);

    const links = [
        { name: 'Home', path: '/home', icon: <FaHome size={18} /> },
        { name: 'Configuração', path: '/config', icon: <Bolt size={18} /> },
        { name: 'Logout', path: '/api/logout', icon: <FaSignOutAlt size={18} /> },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            navigate('/');
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    return (
        <nav className={`${styles.nav} ${isExpanded ? styles.navExpanded : styles.navCollapsed}`}>
            <div className={styles.buttonContainer}>
                <button onClick={() => setIsExpanded(!isExpanded)} className={styles.button}>
                    <FaBars />
                </button>
            </div>
            <div className={styles.profileSection}>
                <img
                    src={`/media/${userInfo.profile_picture.split('.')[0]}`}
                    alt="Profile"
                    className={styles.profileImage}
                />
                {isExpanded && <span className={styles.profileName}>{userInfo.username}</span>}
            </div>
            <div className={styles.links}>
                {links.map((link) => (
                    <Link
                        to={link.path}
                        key={link.name}
                        className={`${styles.link} ${pathname === link.path ? styles.active : ''}`}
                        onClick={link.name === 'Logout' ? handleLogout : () => setIsExpanded(false)}
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