import React from "react";
import { auth } from "../firebase-config";
import { withRouter, Redirect } from "react-router";

const UserPage = ({history}:any) => {

    const singOut = () => {
        auth.signOut()
            .then(() => <Redirect to={"/"} />
            )
        history.push('/')
        return <Redirect to={"/"} />
    }
     return (
        <>
            <h2>User page public</h2>
            <button onClick={() => singOut()}>Sign out</button>
        </>

    )
}

export default withRouter(UserPage);