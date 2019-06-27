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
						<Route exact path="/wallet/new" component={NewWallet} />
						<Route exact path="/wallet/edit/:id" component={NewWallet} />
						<Route path="/wallet/:id" component={Wallet} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/editor/:slug?" component={Editor} />
						<Route path="/article/:id" component={Article} />
						<PrivateRoute path="/settings" component={Settings} />
						<Route path="/@:username" component={Profile} />
						<Route path="/@:username/favorites" component={Profile} />
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
