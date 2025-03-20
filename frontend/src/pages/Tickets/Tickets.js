import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookies";
import SideNav from "../../components/Sidenav/Sidenav";

function Tickets() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const userCookie = getCookie('user');
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                setUsername(user.username);
                setEmail(user.email);
            } catch (error) {
                console.error("Erro ao converter o cookie 'user':", error);
            }
        }
    }, [])

    return (
        <div>
            <SideNav />
            <h1>Olá {username} !</h1>
            <p>Seu email é {email}</p>
        </div>
    );
}

export default Tickets;