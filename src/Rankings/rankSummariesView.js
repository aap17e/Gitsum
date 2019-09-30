import React, {Component} from 'react';
import ChosenSummary from '../Common/chosenSummary';

class RankSummaryView extends Component{
	render(){
		const { summaries, handleChosenSummary } = this.props
		return (
			<div className="flex-container clickable">
			{summaries.map(item => (
				<div key={item.summary_type} className="flex-item">
				<ChosenSummary
				handleChosenSummary={handleChosenSummary}
				summary={item}/>
				</div>
			))}
			</div>
		);
	}
}

export default RankSummaryView;
