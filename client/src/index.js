import React from 'react';
import {render} from 'react-dom';
import './css/index.css';
import App from './App';
import {SnackbarProvider} from 'notistack';
import {MuiPickersUtilsProvider} from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/tr';
import {Provider} from "react-redux";
import {store} from "./helpers/store";
import {ConnectedRouter} from "connected-react-router";
import history from './helpers/history';
import {getToken} from "./actions/auth";
import {AUTH_LOGIN} from "./actions/types";
import jwt from 'jsonwebtoken';
import ErrorBoundary from './components/ErrorBoundary'

moment.locale('tr');

//todo move check token to actions
const token = getToken();
let user = null;
if (token) {
    const decoded = jwt.decode(token, {complete: true});
    user = jwt.decode(token, decoded.payload);
    store.dispatch({type: AUTH_LOGIN, user});
}

render((
    <ErrorBoundary user={user}>
        <Provider store={store}>

            <ConnectedRouter history={history}>
                <SnackbarProvider maxSnack={3}>
                    <MuiPickersUtilsProvider utils={MomentUtils} locale="tr" moment={moment}>

                        <App/>

                    </MuiPickersUtilsProvider>
                </SnackbarProvider>
            </ConnectedRouter>

        </Provider>
    </ErrorBoundary>
), document.getElementById('root'));


