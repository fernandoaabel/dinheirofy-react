import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const EditProfileSettings = (props) => {
	if (props.isUser) {
		return (
			<Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
				<i className="ion-gear-a" /> Edit Profile Settings
			</Link>
		);
	}
	return null;
};

const FollowUserButton = (props) => {
	if (props.isUser) {
		return null;
	}

	let classes = 'btn btn-sm action-btn';
	if (props.following) {
		classes += ' btn-secondary';
	} else {
		classes += ' btn-outline-secondary';
	}

	const handleClick = (ev) => {
		ev.preventDefault();
		if (props.following) {
			props.unfollow(props.username);
		} else {
			props.follow(props.username);
		}
	};

	return (
		<button className={classes} onClick={handleClick}>
			<i className="ion-plus-round" />
			&nbsp;
			{props.following ? 'Unfollow' : 'Follow'} {props.username}
		</button>
	);
};

@inject('userStore')
@withRouter
@observer
class Profile extends React.Component {
	handleFollow = () => this.props.profileStore.follow();
	handleUnfollow = () => this.props.profileStore.unfollow();

	render() {
		const { currentUser } = this.props.userStore;
		const username = this.props.match.params.username;
		const isUser = currentUser && username === currentUser.username;

		return (
			<div className="profile-page">
				<div className="user-info">
					<div className="container">
						<div className="row">
							<div className="col-xs-12 col-md-10 offset-md-1">
								<img src={currentUser.image_url} className="user-img" alt="" />
								<h3>{currentUser.name}</h3>
								<h5>{currentUser.username}</h5>
								{/* <p>{currentUser.bio}</p> */}

								<EditProfileSettings isUser={isUser} />
								{/* <FollowUserButton
									isUser={isUser}
									username={currentUser.username}
									following={currentUser.following}
									follow={this.handleFollow}
									unfollow={this.handleUnfollow}
								/> */}
							</div>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-md-10 offset-md-1">List some content here</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;
