import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookies";

function Tickets() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const userCookie = getCookie('user');
            if (userCookie) {
                try {
                    const user = JSON.parse(userCookie);
                    setUsername(user.username);
                    setEmail(user.email);
                    clearInterval(interval);
                } catch (error) {
                    console.error("Erro ao converter o cookie 'user':", error);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [username, email]);

    return (
        <div>
            <h1>Olá, {username}</h1>
            <p>Seu email é: {email}</p>
        </div>
    );
}

export default Tickets;