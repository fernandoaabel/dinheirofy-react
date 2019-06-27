import { observable, action } from 'mobx';
import agent from '../agent';
import userStore from './userStore';
import commonStore from './commonStore';
import _ from 'lodash';

class AuthStore {
	@observable inProgress = false;
	@observable errors = [];
	@observable concluded = false;

	@observable values = {
		username: '',
		email: '',
		name: '',
		password: ''
	};

	@action reset() {
		this.errors = [];
		this.values.username = '';
		this.values.email = '';
		this.values.name = '';
		this.values.password = '';
	}

	@action checkFormConcluded() {
		if (!this.errors || !this.values.username || !this.values.email || !this.values.name || !this.values.password) {
			this.concluded = false;
			console.log('nao');
		} else {
			this.concluded = true;
			console.log('concluido');
		}
	}

	@action setName(name) {
		this.values.name = name;
		this.checkFormConcluded();
	}

	@action setUsername(username) {
		this.inProgress = true;
		this.values.username = username;
		this.checkFormConcluded();

		if (username) {
			agent.Auth.existsByUsername(username)
				.then(
					action((res) => {
						const errorMessage = 'Username already being used';
						_.pull(this.errors, errorMessage);
						if (res.text === 'true') this.errors.push(errorMessage);
					})
				)
				.finally(
					action(() => {
						this.inProgress = false;
					})
				);
		}
	}

	@action setEmail(email) {
		this.values.email = email;
		this.checkFormConcluded();
	}

	@action setEmailRegister(email) {
		this.inProgress = true;
		this.values.email = email;
		this.checkFormConcluded();
		if (email) {
			agent.Auth.exists(email)
				.then(
					action((res) => {
						const errorMessage = 'Email already exists';
						_.pull(this.errors, errorMessage);
						if (res.text === 'true') this.errors.push(errorMessage);
					})
				)
				.finally(
					action(() => {
						this.inProgress = false;
					})
				);
		}
	}

	@action setPassword(password) {
		this.values.password = password;
		this.checkFormConcluded();
	}

	@action login() {
		this.inProgress = true;
		this.errors = [];
		return (
			agent.Auth.login(this.values.email, this.values.password)
				.then((res) => {
					const authToken = res.body['accessToken'];
					if (authToken) commonStore.setToken(authToken);
				})
				//.then(({ user }) => commonStore.setToken(user.token))
				//.then(() => userStore.pullUser())
				.catch(
					action((err) => {
						this.errors = err.response && err.response.body && err.response.body.errors;
						throw err;
					})
				)
				.finally(
					action(() => {
						this.inProgress = false;
					})
				)
		);
	}

	@action async register() {
		this.inProgress = true;
		this.errors = [];

		return (
			agent.Auth.register(this.values)
				//.then(({ user }) => commonStore.setToken(user.token))
				//.then(this.login())
				.catch(
					action((err) => {
						this.errors = err.response && err.response.body && err.response.body.errors;
						throw err;
					})
				)
				.finally(
					action(() => {
						this.inProgress = false;
					})
				)
		);
	}

	@action logout() {
		commonStore.setToken(undefined);
		userStore.forgetUser();
		return Promise.resolve();
	}
}

export default new AuthStore();
