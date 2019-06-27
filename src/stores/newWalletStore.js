import { observable, action } from 'mobx';
import walletsStore from './walletStore';
import userStore from './userStore';

class NewWalletStore {
	@observable inProgress = false;
	@observable errors = undefined;
	@observable walletSlug = undefined;

	@observable title = '';
	@observable description = '';

	@action setWalletSlug(walletSlug) {
		this.walletSlug = walletSlug;
	}

	@action loadInitialData() {
		if (!this.walletSlug) return Promise.resolve();

		this.inProgress = true;
		return walletsStore
			.loadWallet(this.walletSlug, { acceptCached: true })
			.then(
				action((wallet) => {
					if (!wallet) throw new Error("Can't load original wallet");
					this.title = wallet.title;
					this.description = wallet.description;
				})
			)
			.finally(
				action(() => {
					this.inProgress = false;
				})
			);
	}

	@action reset() {
		this.walletSlug = undefined;
		this.title = '';
		this.description = '';
	}

	@action setTitle(title) {
		this.title = title;
	}

	@action setDescription(description) {
		this.description = description;
	}

	@action submit() {
		this.inProgress = true;
		this.errors = undefined;
		const wallet = {
			_id: this.walletSlug ? this.walletSlug : null,
			title: this.title,
			description: this.description,
			user: userStore.currentUser
		};

		console.log('this.walletSlug = ', this.walletSlug);
		console.log('this.title = ', this.title);

		return (this.walletSlug ? walletsStore.updateWallet(wallet) : walletsStore.createWallet(wallet))
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
			);
	}
}

export default new NewWalletStore();
