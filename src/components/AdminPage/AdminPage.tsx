import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {auth, db} from "../../firebase-config";
import {updateProfile} from "firebase/auth";
import { Redirect, withRouter } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const AdminPage = ({history}:any) => {
    const [users, setUsers] = useState<any>([]);
    const { currentUser } = useContext(AuthContext);
    const judgeId = currentUser.uid;
    const usersRef = collection(db, 'users');

    const user = auth.currentUser;

    // The user object has basic properties such as display name, email, etc.
    const displayName = user?.displayName;
    const email = user?.email;
    const photoURL = user?.photoURL;
    const emailVerified = user?.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user?.uid;





    if(user !== null) {
        // @ts-ignore
        updateProfile(auth.currentUser, {
            displayName: "Сидоренко Марина", photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {

        }).catch((error) => {
            // An error occurred
            // ...
        });
    }

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }

        getUsers()
    }, []);

    const createUser = async () => {
        await addDoc(usersRef, {name: 'Mark', score: 56})
    }

    const singOut = () => {
        auth.signOut()
            .then(() => <Redirect to={"/"} />
            )
        history.push('/')
        return <Redirect to={"/"} />
    }

    return (
        <>
            <h1>Admin page</h1>
            <h4>Судья: {displayName}</h4>
            <button onClick={singOut}>Sign out</button>
        </>
    );
}

export default withRouter(AdminPage);