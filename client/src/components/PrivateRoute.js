import React from 'react';
import {Redirect, Route} from 'react-router-dom'

const PrivateRoute = ({component: Component, auth, ...rest}) => (

    <Route
        {...rest}
        render={props =>

            auth.isLoggedIn ? (
                <Component auth={auth} {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login"
                    }}

                />
            )
        }
    />
);

export default PrivateRoute;