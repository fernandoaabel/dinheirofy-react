import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateRoute from './PrivateRoute';
import LoadingSpinner from './LoadingSpinner';
import Banner from './Home/Banner';

import Article from './Article';
import Editor from './Editor';
import Home from './Home/Home';
import Login from './Login';
import Profile from './Profile';
import Register from './Register';
import Settings from './Settings';
import Wallet from './Wallet/Wallet';
import NewWallet from './Wallet/NewWallet';

@withRouter
@inject('userStore', 'commonStore')
@observer
class App extends React.Component {
	componentDidMount() {
		if (this.props.commonStore.token) {
			this.props.userStore.setUserByToken(this.props.commonStore.token);
		}

		this.props.commonStore.setAppLoaded();
	}

	render() {
		if (this.props.commonStore.appLoaded) {
			return (
				<div>
					<Header />
					<Switch>
						<Route exact path="/" component={Home} />
						<PrivateRoute exact path="/wallet/new" component={NewWallet} />
						<PrivateRoute exact path="/wallet/edit/:id" component={NewWallet} />
						<PrivateRoute path="/wallet/:id" component={Wallet} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<PrivateRoute path="/editor/:slug?" component={Editor} />
						<PrivateRoute path="/article/:id" component={Article} />
						<PrivateRoute path="/settings" component={Settings} />
						<PrivateRoute path="/@:username" component={Profile} />
						<PrivateRoute path="/@:username/favorites" component={Profile} />
						<Route
							render={() => (
								<div>
									<Banner appName={'Page not found'} phrase={'What are you looking for?'} />
								</div>
							)}
						/>
					</Switch>
				</div>
			);
		} else {
			return <LoadingSpinner />;
		}
	}
}

export default App;
