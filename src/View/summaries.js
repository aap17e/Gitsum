import React, {Component} from 'react';
import SummaryView from './summaryView';
import SummaryList from './summaryList';
import SettingsForm from './settingsForm';
import SummaryDetails from './summaryDetails'
import Placeholder from '../Common/placeholder';
import LoadingSpinner from '../Common/loadingSpinner';

class Summaries extends Component{
	state = {
		sideView: false,
		viewed_summary: "",
		sentence_index: ""

	}

	styles = {
		display: 'flex',
		flexDirection: 'column'
	};

	handleBackClick = () => {
		this.setState({
			sideView: false
		});
	}

	handleSideViewClick = (summary, index) => {
		console.log(summary.sentences[index]);
		this.setState({
			sideView: true,
			viewed_summary: summary,
			sentence_index: index
		});
	}

	renderSummaryView(){
		const {
			viewed_summaries,
			handleCloseClick
		} = this.props
		return(
			<div>
			<SummaryView
			summaries={viewed_summaries}
			handleCloseClick={handleCloseClick}
			handleSideViewClick={this.handleSideViewClick}/>
			{viewed_summaries.length === 0 && <Placeholder/>}
			</div>
		);
	}
	render(){
		const {
			summaries,
			sentences,
			formatted,
			handleSummaryItemClick,
			handleCloseClick,
			handleSettingsChange,
			summary_loading,
			conversation
		} = this.props;

		return (
			<div>
				<div style={this.styles}>
				<SettingsForm
					handleSettingsChange={handleSettingsChange}
					sentences={sentences}
					formatted={formatted}
				/>
				<SummaryList
					summaries={summaries}
					handleSummaryItemClick={handleSummaryItemClick}/>
			</div>
			{summary_loading ?
				<div className="main-loader"> <LoadingSpinner/> </div> :
				<div>
					{!this.state.sideView ? <div>{this.renderSummaryView()}</div> :
					<SummaryDetails
						handleBackClick={this.handleBackClick}
						conversation={conversation}
						summary={this.state.viewed_summary}
						sentence_index={this.state.sentence_index}
						handleSideViewClick={this.handleSideViewClick}
						handleCloseClick={handleCloseClick}
					/>}
				</div>
			}
			</div>
		);
	}

}

export default Summaries;
