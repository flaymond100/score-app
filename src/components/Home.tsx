import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../context/AuthContext";
import {app, auth} from "../firebase-config";

const Home = ({ history }: any) => {
    const { currentUser, currentRole } = useContext(AuthContext);

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            try {
                await app
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value);

                history.push('/')
            } catch (error) {
                alert(error);
            }
        },
        [history]
    );

    if (currentUser) {
        if (currentRole == 'admin') {
            return <Redirect to={"/adminPage"} />;
        } else {
            return <Redirect to={"/userPage"} />;
        }
    }

    return (
        <div>
            <h1>Авторизируйтесь</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Log in</button>
            </form>
        </div>
    );
};

export default withRouter(Home);
