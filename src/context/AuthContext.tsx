import React, { useEffect, useState } from 'react';
import {auth, db} from '../firebase-config';
import 'firebase/auth';
import {collection, getDocs} from "firebase/firestore";

export const AuthContext = React.createContext({} as any);

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentRole, setCurrentRole] = useState<any>('');
    const [pending, setPending] = useState(true);
    const [users, setUsers] = useState<any>([]);

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