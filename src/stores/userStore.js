import { observable, action } from 'mobx';
import * as jtw_decode from 'jwt-decode';
import agent from '../agent';

class UserStore {
	@observable currentUser;
	@observable loadingUser;
	@observable updatingUser;
	@observable updatingUserErrors;

	@action setUserByToken(token) {
		this.loadingUser = true;
		console.log('token', token);
		const decodedToken = jtw_decode(token);
		this.currentUser = decodedToken.user;
		console.log('user', decodedToken.user);
		this.loadingUser = false;
	}

	@action updateUser(userId, newUser) {
		this.updatingUser = true;
		return agent.Auth.save(userId, newUser)
			.then(
				action(({ user }) => {
					this.currentUser = user;
				})
			)
			.finally(
				action(() => {
					this.updatingUser = false;
				})
			);
	}

	@action forgetUser() {
		this.currentUser = undefined;
	}
}

export default new UserStore();
