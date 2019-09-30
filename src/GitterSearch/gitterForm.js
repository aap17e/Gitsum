import React from "react";
import Joi from "joi-browser";
import Form from "../Common/form";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';


class GitterForm extends Form {

	state = {
		data: {
			room: "",
		},
		startDate: new Date(),
		endDate: new Date(),
		errors: {}
	};

	handleChangeStart = (date) => {
		this.setState({
			startDate: date
		});
	}

	handleChangeEnd = (date) => {
		this.setState({
			endDate: date
		});
	}

	schema = {
		room: Joi.string()
		.required()
		.label("Room"),
	};


	doSubmit = () => {
		this.props.handleFormSubmit(this.state)
	};

	styles = {
		marginRight: '15px'
	}

	render() {
		return (
			<div>
			<form className="form-container" onSubmit={this.handleSubmit}>
			<div style={this.styles}>{this.renderInput("room", "Room Name")}</div>
			<div style={this.styles}>
			{this.renderDatePicker(this.state.startDate, this.state.endDate,
				this.handleChangeStart,this.handleChangeEnd)}
				</div>
				{this.renderButton("Go")}
				</form>
				</div>
			);
		}
	}

	export default GitterForm;
