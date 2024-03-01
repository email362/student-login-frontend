import React, { useContext } from 'react';
import { AdminAuthContext } from '../main';

export default function Admin() {

    const { user } = useContext(AdminAuthContext);
    console.log('user:', user);


    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    );
}