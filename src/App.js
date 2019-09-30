import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import Footer from "./components/footer";
import GitSum from "./GitSum"
import "./css/App.css";
import "./css/summary.css";
import './css/form.css';
import './css/other.css';
import './css/toggle.css';
import './css/conversation.css';
import './css/sideViewConvo.css'
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class App extends Component {
	render() {
		return (
			<React.Fragment>
			<div id="page-container">
			<NavBar />
			<main id="content-wrap">
			<Switch>
				<Route path="/summary" component={GitSum} />
				<Route path="/not-found" component={NotFound} />
				<Redirect from="/" exact to="/summary" />
				<Redirect to="/not-found" />
			</Switch>
			</main>
			<Footer/>
			</div>
			</React.Fragment>
		);
	}
}

export default App;
