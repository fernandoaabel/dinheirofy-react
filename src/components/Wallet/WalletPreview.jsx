import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import WalletMeta from './WalletMeta';

@inject('userStore', 'walletsStore')
@withRouter
@observer
class WalletPreview extends React.Component {
	render() {
		const { wallet } = this.props;
		const { currentUser } = this.props.userStore;

		const handleDeleteWallet = (id) => {
			this.props.walletsStore.deleteWallet(id).then(() => this.props.history.replace('/'));
		};

		const canModify = currentUser && currentUser.name === wallet.user.name;

		return (
			<div key={wallet._id} className="col-xs-4">
				<div className="article-preview">
					<Link to={`/wallet/${wallet._id}`} className="preview-link">
						<h1>{wallet.title}</h1>
					</Link>
					<hr />
					<WalletMeta wallet={wallet} showActions={!canModify} onDelete={handleDeleteWallet} />
				</div>
			</div>
		);
	}
}

export default WalletPreview;
