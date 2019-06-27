import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const LoggedOutView = (props) => {
	if (!props.currentUser) {
		return (
			<ul className="nav pull-xs-right">
				<li className="nav-item">
					<Link to="/login" className="nav-link">
						Sign in
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/register" className="nav-link">
						Sign up
					</Link>
				</li>
			</ul>
		);
	}
	return null;
};

const LoggedInView = (props) => {
	if (props.currentUser) {
		return (
			<ul className="nav">
				<li className="nav-item">
					<Link to="/wallet/new" className="nav-link">
						<i className="ion-compose" />
						&nbsp;New Wallet
					</Link>
				</li>
				<li className="nav-item dropdown">
					<Link
						to="/"
						className="nav-link dropdown-toggle"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false">
						<img src={props.currentUser.image_url} className="user-pic" alt="" />
						{props.currentUser.name}
					</Link>

					<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
						<Link to={`/@${props.currentUser.username}`} className="dropdown-item">
							Profile
						</Link>
						<Link to="/settings" className="dropdown-item">
							Settings
						</Link>
						<div className="dropdown-divider" />
						<button className="dropdown-item btn btn-outline-danger" onClick={props.logout}>
							Logout
						</button>
					</div>
				</li>
			</ul>
		);
	}

	return null;
};

@inject('userStore', 'commonStore', 'authStore')
@observer
class Header extends React.Component {
	handleClickLogout = () => this.props.authStore.logout().then(() => null);

	render() {
		return (
			<nav className="navbar navbar-light">
				<div className="container">
					<Link to="/" className="navbar-brand">
						{this.props.commonStore.appName.toLowerCase()}
					</Link>

					<LoggedOutView currentUser={this.props.userStore.currentUser} />

					<LoggedInView currentUser={this.props.userStore.currentUser} logout={this.handleClickLogout} />
				</div>
			</nav>
		);
	}
}

export default Header;
