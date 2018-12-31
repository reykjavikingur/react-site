const React = require('react');

const Lost = (props) => {
	props.staticContext.lost = true;
	return (
		<section>
			<h2>Not Found</h2>
			<p>Sorry. We cannot find what you are looking for.</p>
		</section>
	);
};

module.exports = Lost;
