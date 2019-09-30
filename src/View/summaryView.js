import React, {Component} from 'react';
import Summary from '../Common/summary'

class SummaryView extends Component{
	render(){
		const {summaries, handleCloseClick, handleSideViewClick} = this.props
		return (
			<div className="flex-container">
			{summaries.map(item => (
				<div key={item.summary_type} className="flex-item">
				<Summary
				handleSideViewClick={handleSideViewClick}
				handleCloseClick={handleCloseClick}
				summary={item}/>
				</div>
			))}
			</div>
		);
	}

}

export default SummaryView;
