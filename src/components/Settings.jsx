import ListErrors from './ListErrors';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore')
@observer
class SettingsForm extends React.Component {
	constructor() {
		super();

		this.state = {
			name: '',
			username: '',
			email: '',
			password: '',
			image_url: ''
		};

		this.updateState = (field) => (ev) => {
			const state = this.state;
			const newState = Object.assign({}, state, { [field]: ev.target.value });
			this.setState(newState);
		};

		this.submitForm = (ev) => {
			ev.preventDefault();

			const user = Object.assign({}, this.state);
			if (!user.password) {
				delete user.password;
			}

			this.props.onSubmitForm(user);
		};
	}

	componentWillMount() {
		if (this.props.userStore.currentUser) {
			Object.assign(this.state, {
				image_url: this.props.userStore.currentUser.image_url || '',
				name: this.props.userStore.currentUser.name,
				username: this.props.userStore.currentUser.username,
				email: this.props.userStore.currentUser.email
			});
		}
	}

	render() {
		return (
			<form onSubmit={this.submitForm}>
				<fieldset>
					<fieldset className="form-group">
						<input
							className="form-control form-control-md"
							type="text"
							placeholder="Name"
							value={this.state.name}
							onChange={this.updateState('name')}
						/>
					</fieldset>

					<fieldset className="form-group">
						<input
							className="form-control form-control-md"
							type="text"
							placeholder="Username (Unique)"
							value={this.state.username}
							onChange={this.updateState('username')}
						/>
					</fieldset>

					<fieldset className="form-group">
						<input
							className="form-control form-control-md"
							type="email"
							placeholder="Email"
							value={this.state.email}
							onChange={this.updateState('email')}
						/>
					</fieldset>

					<fieldset className="form-group">
						<input
							className="form-control"
							type="text"
							placeholder="URL of profile picture"
							value={this.state.image_url}
							onChange={this.updateState('image_url')}
						/>
					</fieldset>

					{/* <fieldset className="form-group">
						<input
							className="form-control form-control-md"
							type="password"
							placeholder="New Password"
							value={this.state.password}
							onChange={this.updateState('password')}
						/>
					</fieldset> */}

					<button
						className="btn btn-lg btn-primary pull-xs-right"
						type="submit"
						disabled={this.props.userStore.updatingUser}>
						Update Settings
					</button>
				</fieldset>
			</form>
		);
	}
}

@inject('userStore', 'authStore')
@withRouter
@observer
class Settings extends React.Component {
	handleClickLogout = () => this.props.authStore.logout().then(() => this.props.history.replace('/'));

	render() {
		return (
			<div className="settings-page profile-page">
				<div className="user-info row">
					<div className="col-xs-12 col-md-10 offset-md-1">
						<img src={this.props.userStore.currentUser.image_url} className="user-img" alt="" />
						<h3>{this.props.userStore.currentUser.name}</h3>
						<h5>{this.props.userStore.currentUser.username}</h5>
					</div>
				</div>
				<div className="container page">
					<div className="row">
						<div className="col-md-6 offset-md-3 col-xs-12">
							<h5 className="text-xs-center">Your Settings</h5>
							<hr />

							<ListErrors errors={this.props.userStore.updatingUserErrors} />

							<SettingsForm
								currentUser={this.props.userStore.currentUser}
								onSubmitForm={(user) =>
									this.props.userStore.updateUser(this.props.userStore.currentUser._id, user)
								}
							/>
							<hr />
							<button className="btn btn-outline-danger " onClick={this.handleClickLogout}>
								Or click here to logout.
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Settings;
