import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function useAuth() {
    const navigate = useNavigate();
    const location = useLocation(); // Obtém a rota atual

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch('/api/check-login', {
                    method: 'GET',
                });

                if (response.status === 401 || response.status === 404) {
                    // Permite navegação apenas entre "/" e "/register"
                    if (location.pathname !== '/' && location.pathname !== '/register') {
                        document.cookie = "session=; path=/; max-age=0";
                        navigate('/'); // Redireciona para o login
                    }
                } else if (response.ok) {
                    const data = await response.json();
                    if (!data) {
                        document.cookie = "session=; path=/; max-age=0";
                        navigate('/'); // Redireciona para o login
                        return;
                    }
                    document.cookie = `user=${JSON.stringify(data)}; path=/; max-age=${7 * 24 * 60 * 60}`;
                    if (location.pathname === '/') {
                        navigate('/home');
                    }
                }
            } catch (error) {
                console.error('Error checking login:', error);
                if (location.pathname !== '/' && location.pathname !== '/register') {
                    navigate('/'); // Redireciona para o login em caso de erro
                }
            }
        };

        checkLogin();
    }, [navigate, location.pathname]);
}

export default useAuth;