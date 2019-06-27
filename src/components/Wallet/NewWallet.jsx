import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ListErrors from '../ListErrors';
import ModalDialog from '../ModalDialog';

@inject('walletsStore', 'newWalletStore')
@withRouter
@observer
class NewWallet extends React.Component {
	componentWillMount() {
		this.props.newWalletStore.reset();
		this.props.newWalletStore.setWalletSlug(this.props.match.params.id);
	}

	componentDidMount() {
		this.props.newWalletStore.loadInitialData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.match.params.id !== prevProps.match.params.id) {
			this.props.newWalletStore.reset();
			this.props.newWalletStore.setWalletSlug(this.props.match.params.id);
			this.props.newWalletStore.loadInitialData();
		}
	}

	changeTitle = (e) => this.props.newWalletStore.setTitle(e.target.value);
	changeDescription = (e) => this.props.newWalletStore.setDescription(e.target.value);

	handleTagInputKeyDown = (ev) => {
		switch (ev.keyCode) {
			case 13: // Enter
			case 9: // Tab
			default:
				break;
		}
	};

	submitForm = (ev) => {
		ev.preventDefault();

		const { newWalletStore } = this.props;
		newWalletStore.submit().then((wallet) => {
			newWalletStore.reset();
			this.props.history.replace(`/`);
		});
	};

	render() {
		const { inProgress, errors, title, description } = this.props.newWalletStore;

		return (
			<div className="editor-page">
				<div className="container page">
					<div className="row">
						<div className="col-md-10 offset-md-1 col-xs-12">
							<ListErrors errors={errors} />

							<form>
								<fieldset>
									<fieldset className="form-group">
										<input
											className="form-control form-control-lg"
											type="text"
											placeholder="Wallet Title"
											value={title}
											onChange={this.changeTitle}
											disabled={inProgress}
										/>
									</fieldset>

									<fieldset className="form-group">
										<textarea
											className="form-control"
											type="text"
											rows="4"
											placeholder="Description"
											value={description}
											onChange={this.changeDescription}
											disabled={inProgress}
										/>
									</fieldset>

									<button
										className="btn btn-md pull-xs-right btn-primary"
										type="button"
										disabled={inProgress}
										onClick={this.submitForm}>
										Save Wallet
									</button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NewWallet;
