import { Link } from 'react-router-dom';
import React from 'react';
import { observer } from 'mobx-react';

const WalletMeta = observer((props) => {
	const { wallet, onDelete, showActions } = props;

	const WalletActions = (actionProps) => {
		const wallet = actionProps.wallet;

		return (
			<div className="article-actions">
				<Link to={`/wallet/edit/${wallet._id}`} className="btn btn-secondary btn-sm">
					<i className="ion-edit" /> Edit
				</Link>
				<button className="btn btn-danger btn-sm" onClick={() => onDelete(wallet._id)}>
					<i className="ion-trash-a" /> Delete
				</button>
			</div>
		);
	};

	return (
		<div className="article-meta">
			<div>
				<Link to={`/@${wallet.user.name}`} className="user">
					<img src={wallet.user.image_url} className="user-pic" alt="" />
					{wallet.user.name}
				</Link>
			</div>
			<div className="info">
				<span className="date">Created at {new Date(wallet.createdAt).toDateString()}</span>
				<span className="date">Updated at {new Date(wallet.updatedAt).toDateString()}</span>
			</div>
			<hr />
			<div>{showActions && <WalletActions wallet={wallet} />}</div>
		</div>
	);
});

export default WalletMeta;
