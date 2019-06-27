import React from 'react';
import { observer } from 'mobx-react';
import LoadingSpinner from './LoadingSpinner';

const ModalDialog = observer((props) => {
	const { title, bodyContent, isLoading } = props;
	if (!isLoading) {
		return (
			<div class="modal" tabindex="-1" role="dialog">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">{title}</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">{bodyContent()}</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary">
								Save changes
							</button>
							<button type="button" class="btn btn-secondary" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return <LoadingSpinner />;
	}
});

export default ModalDialog;
