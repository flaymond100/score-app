import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import 'firebase/auth';
import { Spin } from "antd";

export const AuthContext = React.createContext({} as any);

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentRole, setCurrentRole] = useState<any>('');
    const [pending, setPending] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user:any) => {
            if (user && user.uid === process.env.REACT_APP_ADMIN_TOKEN) {
                setCurrentRole('admin');
            } else {
                setCurrentRole('user');
            }
            setCurrentUser(user)
            setPending(false)

        });
    }, []);

    return (
        pending ? <div style={{display: 'flex', alignItems:'center', justifyContent:'center', height:'50%'}}>
                <Spin /></div>:
        <AuthContext.Provider
            value={{
                currentUser,
                currentRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};