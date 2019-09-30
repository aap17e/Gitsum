import React, {Component} from 'react';
import Sentence from '../Common/sentence';

class SideSummary extends Component{
	render(){
		const {summary, sentence_index, handleSideViewClick} = this.props
		return (
			<div>
			<div className="row">
			<h4 className="col-sm-11">{summary.summary_type}</h4>
			</div>
			{summary.sentences.map((item,index) => (
				<div
				key={index}
				onClick={() => handleSideViewClick(summary, index)}>
				<Sentence
					key={index}
					text={item}
					chosen={sentence_index === index ? true : false}/>
				</div>
			))}

			</div>
		);
	}

}

export default SideSummary;
