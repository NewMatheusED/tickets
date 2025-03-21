import React, { useState } from 'react';
import styles from './Login.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                console.log('response', response);
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Email ou senha inválidos');
            })
            .then((data) => {
                document.cookie = `user=${data}; path=/`;
                navigate('/home');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h1 className={styles.title}>Login</h1>
                {error && <p className={styles.error}>{error}</p>}
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                />
                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                />
                <Button type="submit">
                    Entrar
                </Button>
                <p>Ainda não tem conta, pegue <a href='/register'>aqui</a></p>
            </form>
        </div>
    );
}

export default Login;