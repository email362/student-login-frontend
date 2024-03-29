
import { useContext, useState } from "react";
import { AdminAuthContext } from "../main";
import { useNavigate } from "react-router-dom";


export default function AdminLogin() {

    const { setUser } = useContext(AdminAuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === import.meta.env.VITE_ADMIN_USER && password === import.meta.env.VITE_ADMIN_PASSWORD) {
            // console.log('username:', username);
            setUser("admin");
            // console.log('user:', user);
            navigate('/admin');
        }
    }

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input value={username} onChange={(e) => handleUsername(e)} type="text" placeholder="Username" />
                <input value={password} onChange={(e) => handlePassword(e)} type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}