import { observable, action, reaction } from 'mobx';
// import agent from '../agent';
import userStore from './userStore';

class CommonStore {
	@observable appName = 'Dinheirofy';
	@observable token = window.localStorage.getItem('jwt');
	@observable appLoaded = false;

	@observable tags = [];
	@observable isLoadingHome = false;

	constructor() {
		reaction(
			() => this.token,
			(token) => {
				if (token) {
					window.localStorage.setItem('jwt', token);
				} else {
					window.localStorage.removeItem('jwt');
				}
			}
		);
	}
	@action setToken(token) {
		this.token = token;
		if (token) userStore.setUserByToken(token);
	}

	@action setAppLoaded() {
		this.appLoaded = true;
	}

	@action setLoadingHome(value) {
		this.isLoadingHome = value;
	}

	@action loadTags() {
		return null;
		//    this.isLoadingTags = true;
		//    return agent.Tags.getAll()
		//       .then(
		//          action(({ tags }) => {
		//             this.tags = tags.map((t) => t.toLowerCase());
		//          })
		//       )
		//       .finally(
		//          action(() => {
		//             this.isLoadingTags = false;
		//          })
		//       );
	}
}

export default new CommonStore();
