import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ component: RouteComponent, ...rest}: any) => {
    const {currentUser, currentRole} = useContext(AuthContext);

    return (
        <Route
            {...rest}

            render={routeProps =>
                !!currentUser && currentRole === 'user' ? (
                    <RouteComponent {...routeProps} />
                ) : (
                    <Redirect to={'/'} />
                )}
        />
    );
};

export default PrivateRoute;