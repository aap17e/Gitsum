import React, {Component} from 'react';
import Sentence from './sentence';

class Summary extends Component{
	render(){
		const {summary, handleCloseClick, handleSideViewClick} = this.props
		return (
			<div className="overlay-summaries">
			<div className="row">
			<h4 className="col-sm-11">{summary.summary_type}</h4>
			<button
				onClick={() => handleCloseClick(summary)}
				type="button"
				className="close"
				aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			</div>
			{summary.sentences.map((item,index) => (
				<div key={index} onClick={() => handleSideViewClick(summary, index)}>
				<Sentence key={index} text={item}/>
				</div>
			))}

			</div>
		);
	}

}

export default Summary;
