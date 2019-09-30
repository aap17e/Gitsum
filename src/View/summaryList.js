import React, {Component} from 'react';
import SummaryCard from '../Common/summaryCard';

class SummaryList extends Component{
	render(){
		return (
			<div className="flex-card-container">
			{this.props.summaries.map(item => (
				<div key={item.summary_type}>
				<SummaryCard
				summaryItem={item}
				onSummaryItemClick={this.props.handleSummaryItemClick}/>
				</div>
			))}
			</div>
		);
	}

}

export default SummaryList;
