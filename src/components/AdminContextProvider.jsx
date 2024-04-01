
import { useState } from 'react';
import { AdminAuthContext } from '@src/main';


export default function AdminContextProvider({ children }) {
    const [user, setUser] = useState('');
    return (
        <AdminAuthContext.Provider value={{ user, setUser }}>
            {children}
        </AdminAuthContext.Provider>
    );
}