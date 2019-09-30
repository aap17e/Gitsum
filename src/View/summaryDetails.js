import React, {Component} from 'react';
import SideConversation from './sideConversation';
import SideSummary from './sideSummary';

class SummaryDetails extends Component{
	render(){
		const {
			conversation,
			summary,
			handleSideViewClick,
			handleCloseClick,
			sentence_index,
			handleBackClick} = this.props;
			return (
				<div className="side-view">
					<div className="back-button" onClick={handleBackClick}>
						<i style={{fontSize: '30px'}} className="fa fa-long-arrow-left"></i>
						</div>
							<div style={{display: 'flex'}}>
							<div style={{marginRight: '15px'}}>
							<SideConversation
								search={summary.sentences[sentence_index]}
								conversation={conversation} />
							</div>
							<div className="flex-item">
							<SideSummary
								handleSideViewClick={handleSideViewClick}
								handleCloseClick={handleCloseClick}
								sentence_index={sentence_index}
								summary={summary}/>
						</div>
					</div>
				</div>
			);
		}

	}

	export default SummaryDetails;
