import React, {Component} from 'react';
import Conversation from '../Common/conversation';
import RankSummaryView from './rankSummariesView';
import ChoseSummary from '../Common/choseSummary';
import SummaryRankList from './summaryRankList';
import axios from 'axios';

class SummaryRank extends Component{
	state ={
		current_rank: []
	}
	getTwoConversations = () => {
		const all_summaries = [...this.props.summaries, ...this.props.viewed_summaries];
		let x = Math.floor(Math.random() * all_summaries.length);
		let y = Math.floor(Math.random() * all_summaries.length);

		while(x === y){
			y = Math.floor(Math.random() * all_summaries.length);
		}
		return [all_summaries[x], all_summaries[y]];
	}

	handleChosenSummary = async (summary_type) =>{
		console.log(summary_type);
		const endpoint = "http://127.0.0.1:5000/gitter/api/v1.0/chosen_summary/" + summary_type
		await axios.post(endpoint)
		this.forceUpdate();
	}

	componentDidMount = async () => {
		const endpoint = "http://127.0.0.1:5000/gitter/api/v1.0/summary_ranking"
		const rankings = await axios.get(endpoint)
		console.log(rankings["data"]["data"])
		this.setState({
			current_rank: rankings.data.data
		});
	}

	render(){
		const {
			conversation,
			room } = this.props

			return (
				<div>
				<h1 className="room-header">{room}</h1>
				<ChoseSummary />
				<RankSummaryView
				summaries={this.getTwoConversations()}
				handleChosenSummary={this.handleChosenSummary} />
				<Conversation conversation={conversation} />
				<h2>Rankings</h2>
				<SummaryRankList summaries={this.state.current_rank}/>
				</div>
			);
		}

	}

	export default SummaryRank;
