import React, {Component} from 'react';

class SettingsForm extends Component{
	state = {
		formatted: false,
		sentences: "",
		type: {
			percentage: false,
			number: false
		}
	};


	onSentenceChange = ({ currentTarget: input }) => {
		console.log(input);
		const type = {...this.state.type}
		const keys = Object.keys(type);
		for (const key of keys) {
			type[key] = false;
		}

		this.setState({
			sentences: input.value,
			type
		});
	};

	handleButtonClick = (event) => {
		event.preventDefault();
		const id = event.target.id;
		const type = {...this.state.type}
		const keys = Object.keys(type);
		for (const key of keys) {
			type[key] = false;
		}

		type[id] = true;

		this.setState({
			type
		});

		this.props.handleSettingsChange(this.state.sentences, id)
	}

	handleFormattedClick = (event) => {
		event.preventDefault();
		const id = event.target.id;
		console.log(id);
		this.setState({
			formatted: !this.state.formatted
		});
		this.props.handleSettingsChange(0, id)
	}
	//
	// onFormattedClick = e => {
	//     console.log(e)
	//     this.setState({
	//         formatted: !this.state.formatted
	//     });
	//
	// }

	renderSentenceInput(){
		return(
			<div className="input-group">
			{this.renderInput()}
			<div className="input-group-append">
			{this.renderToggleButton('percentage', '%')}
			{this.renderToggleButton('number', '#')}

			</div>
			</div>
		);
	}

	renderInput(){
		return(
			<input
			type="text"
			id="sentences"
			name="sentences"
			className="form-control"
			placeholder="Sentence Amount"
			aria-label="Sentence Amount"
			aria-describedby="basic-addon2"
			onChange={this.onSentenceChange}
			value={this.state.sentences}
			/>
		);
	}


	renderToggleButton(type_id, symbol){
		const active = this.state.type[type_id] ? ' active' : '';
		console.log(active);
		return(
			<button
			className={"btn btn-outline-secondary" + active}
			type="button"
			id={type_id}
			onClick={this.handleButtonClick}>
			{symbol}
			</button>
		);

	}

	// renderRadio(){
	//     return(
	//         <div className="form-check">
	//             <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
	//             <label className="form-check-label" htmlFor="exampleCheck1">Fomatted Conversation</label>
	//         </div>
	//     );
	// }
	//
	// renderGoButton(){
	//     return(
	//         <button className="btn btn-secondary">
	//             Go
	//         </button>
	//     );
	// }

	renderFormattedButton(){
		const formatted = this.state.formatted ? ' active' : '';
		return(
			<button
			style={{}}
			id="formatted"
			type="button"
			onClick={this.handleFormattedClick}
			className={"btn btn-outline-dark" + formatted}
			>
			Formatted
			</button>
		);

	}


	render(){
		return (
			<div className="flex-settings">
			{this.renderFormattedButton()}
			<div className="vl"></div>
			{this.renderSentenceInput()}
			</div>
		);
	}
}

export default SettingsForm;
