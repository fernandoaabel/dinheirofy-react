import WalletPreview from './WalletPreview';
import ListPagination from '../ListPagination';
import LoadingSpinner from '../LoadingSpinner';
import React from 'react';
import { Link } from 'react-router-dom';

const WalletList = (props) => {
	var wallets = Array.from(props.wallets);

	if (props.loading && wallets.length === 0) {
		return <LoadingSpinner />;
	}

	if (wallets.length === 0) {
		return (
			<div className="article-preview">
				<p>No wallets are here... yet.</p>
				<p>
					<Link to="/wallet/new">
						<i className="ion-compose" />
						&nbsp;New Wallet
					</Link>
				</p>
			</div>
		);
	}

	return (
		<div className="row">
			{wallets.map((wallet) => {
				return <WalletPreview wallet={wallet} key={wallet._id} />;
			})}

			<ListPagination
				onSetPage={props.onSetPage}
				totalPagesCount={props.totalPagesCount}
				currentPage={props.currentPage}
			/>
		</div>
	);
};

export default WalletList;
