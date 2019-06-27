import { observable, action, computed } from 'mobx';
import agent from '../agent';

const LIMIT = 10;

export class WalletsStore {
	@observable isLoading = false;
	@observable page = 0;
	@observable totalPagesCount = 0;
	@observable walletsRegistry = observable.map();
	@observable predicate = {};

	@computed get wallets() {
		return this.walletsRegistry.values();
	}

	@action clear() {
		this.walletsRegistry.clear();
		this.page = 0;
	}

	getWallet(id) {
		return this.walletsRegistry.get(id);
	}

	@action setPage(page) {
		this.page = page;
	}

	@action setPredicate(predicate) {
		if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return;
		this.clear();
		this.predicate = predicate;
	}

	$req() {
		//if (this.predicate.myFeed) return agent.Wallets.feed(this.page, LIMIT);
		//if (this.predicate.favoritedBy) return agent.Wallets.favoritedBy(this.predicate.favoritedBy, this.page, LIMIT);
		//if (this.predicate.tag) return agent.Wallets.byTag(this.predicate.tag, this.page, LIMIT);
		//if (this.predicate.author) return agent.Wallets.byAuthor(this.predicate.author, this.page, LIMIT);
		return agent.Wallets.all();
	}

	@action loadWallets() {
		this.isLoading = true;
		return this.$req()
			.then(
				action((res) => {
					if (res.body) {
						let wallets = res.body;
						console.log('wallets', wallets);
						this.walletsRegistry.clear();
						wallets.forEach((wallets) => this.walletsRegistry.set(wallets._id, wallets));
						this.totalPagesCount = Math.ceil(wallets.length / LIMIT);
					}
				})
			)
			.finally(
				action(() => {
					this.isLoading = false;
				})
			);
	}

	@action loadWalletsForUser(userId) {
		this.isLoading = true;
		return agent.Wallets.findByUser(userId)
			.then(
				action((res) => {
					if (res.body) {
						let wallets = res.body;
						console.log('wallets', wallets);
						this.walletsRegistry.clear();
						wallets.forEach((wallets) => this.walletsRegistry.set(wallets._id, wallets));
						this.totalPagesCount = Math.ceil(wallets.length / LIMIT);
					}
				})
			)
			.finally(
				action(() => {
					this.isLoading = false;
				})
			);
	}

	@action loadWallet(id, { acceptCached = false } = {}) {
		if (acceptCached) {
			const wallet = this.getWallet(id);
			if (wallet) return Promise.resolve(wallet);
		}
		this.isLoading = true;
		return agent.Wallets.get(id)
			.then(
				action((res) => {
					console.log(`res`, res);
					if (res.body) {
						console.log('loadWallet', res.body);
						let wallet = res.body;
						this.walletsRegistry.set(wallet._id, wallet);
						return wallet;
					}
					return null;
				})
			)
			.finally(
				action(() => {
					this.isLoading = false;
				})
			);
	}

	@action createWallet(wallet) {
		return agent.Wallets.create(wallet).then(({ wallet }) => {
			return wallet;
		});
	}

	@action updateWallet(data) {
		return agent.Wallets.update(data).then(({ wallet }) => {
			return wallet;
		});
	}

	@action deleteWallet(id) {
		this.walletsRegistry.delete(id);
		return agent.Wallets.del(id).catch(
			action((err) => {
				this.loadWallets();
				throw err;
			})
		);
	}
}

export default new WalletsStore();
