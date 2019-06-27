import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import RedError from '../RedError';
import LoadingSpinner from '../LoadingSpinner';
import WalletMeta from './WalletMeta';

@inject('walletsStore', 'userStore')
@withRouter
@observer
class Wallet extends React.Component {
	componentDidMount() {
		const id = this.props.match.params.id;
		this.props.walletsStore.loadWallet(id, { acceptCached: false });
	}

	handleDeleteWallet = (id) => {
		this.props.walletsStore.deleteWallet(id).then(() => this.props.history.replace('/'));
	};

	// handleDeleteComment = (id) => {
	// 	this.props.commentsStore.deleteComment(id);
	// };

	render() {
		const { isLoading } = this.props.walletsStore;
		const { currentUser } = this.props.userStore;

		if (isLoading) return <LoadingSpinner />;

		const walletId = this.props.match.params.id;
		const wallet = this.props.walletsStore.getWallet(walletId);
		if (!wallet) return <RedError message="Can't load wallet" />;

		const canModify = currentUser && currentUser.name === wallet.user.name;

		return (
			<div className="article-page">
				<div className="banner">
					<div className="container">
						<h1>{wallet.title}</h1>
						<WalletMeta wallet={wallet} showActions={canModify} onDelete={this.handleDeleteWallet} />
					</div>
				</div>

				<div className="container page">
					<div className="row article-content">
						<div className="col-xs-12">{wallet.description}</div>
					</div>

					<hr />

					<div className="row">{/* Investimentos da carteira aqui */}</div>
				</div>
			</div>
		);
	}
}

export default Wallet;
