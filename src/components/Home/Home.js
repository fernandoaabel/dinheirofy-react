import React from 'react';
import Banner from './Banner';
import WalletList from '../Wallet/WalletList';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

@inject('commonStore', 'walletsStore', 'userStore')
@withRouter
@observer
class Home extends React.Component {
	loadHomeData = async () => {
		this.props.commonStore.setLoadingHome(true);
		this.props.walletsStore.clear();
		this.props.walletsStore.loadWalletsForUser(this.props.userStore.currentUser._id);
		this.props.commonStore.setLoadingHome(false);
	};

	componentDidMount() {
		this.loadHomeData();
	}

	componentWillReceiveProps() {
		this.loadHomeData();
	}

	render() {
		const { appName, isLoadingHome } = this.props.commonStore;

		if (isLoadingHome) return <LoadingSpinner />;

		return (
			<div className="home-page">
				<Banner phrase={'Your wallets'} appName={appName} />

				<div className="container page">
					<div className="col-md-12">
						<WalletList wallets={this.props.walletsStore.wallets} />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
