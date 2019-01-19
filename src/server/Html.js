const React = require('react');
const {Switch, Route} = require('react-router-dom');
const Main = require('./pages/Main');
const About = require('./pages/About');
const Lost = require('./pages/Lost');

const Html = (props) => {
	return (
		<html>
		<head>
			<link rel="icon" type="image/png" href="/static/favicon.png"/>
			<meta charSet="utf-8"/>
			<title>{props.title}</title>
			<link rel="stylesheet" href="/styles/design.css"/>
		</head>
		<body>
		<h1>{props.title}</h1>
		<Switch>
			<Route exact path="/" component={Main}/>
			<Route path="/about" component={About}/>
			<Route component={Lost}/>
		</Switch>
		<script type="text/javascript" src="/scripts/main.js"></script>
		</body>
		</html>
	);
};

module.exports = Html;
