import React from 'react';

const Banner = ({ appName, phrase }) => {
	return (
		<div className="banner">
			<div className="container">
				{appName && <h1 className="logo-font">{appName}</h1>}
				{phrase && <p>{phrase}</p>}
			</div>
		</div>
	);
};

export default Banner;
