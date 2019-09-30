import React, {Component} from 'react';

class ChosenSummary extends Component{
	render(){
		const {summary, handleChosenSummary} = this.props
		return (
			<div onClick={() => handleChosenSummary(summary.summary_type)}
			className="overlay-summaries">
			<div className="row summary-sentence-line">
			<h4 className="col-sm-11">{summary.summary_type}</h4>
			</div>
			{summary.sentences.map((text,index) => (
				<div className="summary-card"key={index} >
				<h6>{text}</h6>
				</div>
			))}

			</div>
		);
	}

}

export default ChosenSummary;
