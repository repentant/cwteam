import React, {Component, Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './components/pages/Login';
import {connect} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import {doLogin, doLogout} from "./actions/auth";
import PrivateRoute from './components/PrivateRoute'
import Register from "./components/pages/Register";
import {getAllProjects} from "./actions/project";
import {getAllUsers} from "./actions/user";
import {compose} from "recompose";
import {withStyles} from '@material-ui/core/styles';
import {push} from 'connected-react-router';
import Library from "./components/pages/Library";
import Accounting from "./components/pages/Accounting";
import Passwords from "./components/pages/Passwords";
import Settings from "./components/pages/Settings";
import {withSnackbar} from 'notistack';
import ZReport from "./components/pages/ZReport";

import Navigation from "./components/Navigation";
import Application from "./components/Application";

const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
});

class App extends Component {


    render() {

        const {ui, auth, classes, doLogout, doLogin} = this.props;

        return (


                <div className={classes.root}>
                    <Fragment>
                        <CssBaseline/>
                        {!ui.isGanttFullscreen &&

                        <div>
                            {auth.isLoggedIn && <Navigation auth={auth} doLogout={doLogout}/>

                            }
                        </div>
                        }
                        <main className={classes.content}>

                            <Switch>
                                <Route exact path='/login' render={props => <Login doLogin={doLogin} {...props} />}/>
                                <Route exact path='/register' component={Register}/>
                                <Route exact path='/library' component={Library}/>
                                <Route exact path='/accounting' component={Accounting}/>
                                <Route exact path='/passwords' component={Passwords}/>
                                <Route exact path='/settings' component={Settings}/>
                                <Route path='/z-report' component={ZReport} />
                                <PrivateRoute path='/' component={Application} auth={auth} />

                            </Switch>
                        </main>

                    </Fragment>
                </div>

        )

    }
}

const mapStateToProps = (state) => {

    return {
        auth: state.auth,
        ui: state.ui,
    };
};

export default compose(
    connect(
        mapStateToProps,
        {doLogout, doLogin, getAllProjects, getAllUsers, push},
        null,
        {
            pure: false,
            areStatesEqual: (next, prev) => {
                return next.auth === prev.auth
            }
        }
    ),
    withStyles(styles),
    withSnackbar
)(App);

