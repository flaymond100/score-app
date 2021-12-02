import React, { useEffect, useState } from 'react';
import {auth, db} from '../firebase-config';
import 'firebase/auth';

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

    if(pending){
        return <>Loading...</>
    }
    console.log(currentUser)
    return (
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