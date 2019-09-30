import React, {Component} from 'react';

class SummaryCard extends Component{
	render(){
		return (
			<div  className="overlay">
			<div
			className="flex-card-item"
			style={this.styles}
			onClick={() => this.props.onSummaryItemClick(this.props.summaryItem)}>
			<h6>{this.props.summaryItem.summary_type}</h6>
			</div>
			</div>

		);
	}

}

export default SummaryCard;
