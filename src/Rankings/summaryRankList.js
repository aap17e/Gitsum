import React, {Component} from 'react';

class SummaryRankList extends Component{
	render(){
		return (
			<div className="flex-card-container">
			{this.props.summaries.map(item => (
				<div  key={item} className="overlay">
					<div className="flex-card-item" >
					<h6>{item}</h6>
					</div>
				</div>
			))}
			</div>
		);
	}

}

export default SummaryRankList;
