import React, { Component } from "react";

class Toggle extends Component {
	render() {
		return (
			<form className="switch-field">
				<div className="switch-title">{this.props.title}</div>
				<input
					type="radio"
					id="switch_left"
					name="switchToggle"
					value={this.props.leftLabel}
					onChange={this.props.handleToggleState}
					checked={!this.props.toggle}
				/>
				<label htmlFor="switch_left">{this.props.leftLabel}</label>
				<input
					type="radio"
					id="switch_right"
					name="switchToggle"
					value={this.props.rightLabel}
					onChange={this.props.handleToggleState}
					checked={this.props.toggle}
				/>
				<label htmlFor="switch_right">{this.props.rightLabel}</label>
			</form>
		);
	}
	getProps(){
		return !this.props.toggle
	}

}


export default Toggle;
