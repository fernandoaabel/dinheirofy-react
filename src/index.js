import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';

import ReactDOM from 'react-dom';
import promiseFinally from 'promise.prototype.finally';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import App from './components/App';

import articlesStore from './stores/articlesStore';
import commentsStore from './stores/commentsStore';
import authStore from './stores/authStore';
import commonStore from './stores/commonStore';
import editorStore from './stores/editorStore';
import userStore from './stores/userStore';
import newWalletStore from './stores/newWalletStore';
import profileStore from './stores/profileStore';
import walletsStore from './stores/walletStore';
import { configure } from 'mobx';

const stores = {
	articlesStore,
	commentsStore,
	authStore,
	commonStore,
	editorStore,
	userStore,
	newWalletStore,
	profileStore,
	walletsStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();

configure({
	enforceActions: 'always'
});

ReactDOM.render(
	<Provider {...stores}>
		<Router>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
);
