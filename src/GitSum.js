import React, { Component } from "react";
import axios from 'axios';
import Logo from './Common/logo';
import LoadingSpinner from './Common/loadingSpinner';
import Toggle from "./Common/toggle";
import Conversation from "./Common/conversation";
import GitterForm from "./GitterSearch/gitterForm";
import Summaries from './View/summaries';
import SummaryRank from './Rankings/summaryRank';

class GitSum extends Component {
	state = {
		toggle: false,
		conversation: [],
		summaries: [],
		viewed_summaries: [],
		submitted: false,

		startDate: new Date(),
		endDate: new Date(),
		room: "",

		formatted: false,
		sentences: 5,
		sentence_type: "number",

		loading: false,
		summary_loading: false,
		rank_view: false

	};

	handleToggleState = () => {
		this.setState({
			toggle: !this.state.toggle
		});
	}

	handleSummaryItemClick = (item) => {
		const { summaries, viewed_summaries} = this.state;

		if(viewed_summaries.length < 2){
			this.setState({
				summaries: summaries.filter(clicked => clicked.summary_type !== item.summary_type),
				viewed_summaries: [...viewed_summaries,item]
			});
		}
	}

	handleCloseClick = (item) => {
		const { summaries, viewed_summaries} = this.state;
		this.setState({
			summaries: [...summaries,item],
			viewed_summaries: viewed_summaries.filter(clicked => clicked.summary_type !== item.summary_type)
		});

	}

	handleRankView = () => {
		const {rank_view} = this.state
		this.setState({
			rank_view: !rank_view
		});
	}

	handleFormSubmit = async ({data, startDate, endDate}) => {
		let room = data.room.replace("/","-")
		let start = startDate.toISOString().split("T")[0]
		let end = endDate.toISOString().split("T")[0]

		let {sentences, formatted} = this.state;

		const f = formatted ? 1 : 0

		const endpoint = "http://127.0.0.1:5000/gitter/api/v1.0/conversation/" +
		room + "/" + start + "/" + end + "/" + sentences + "/" + "number"+ "/"+ f

		console.log(endpoint)

		this.setState({ loading: true }, () => {
			axios.get(endpoint)
			.then(result => this.setState({
				loading: false,
				conversation: result["data"]["conversation"],
				summaries: result["data"]["summaries"],
				viewed_summaries: [],
				submitted: true,
				startDate: startDate,
				endDate: endDate,
				room: data.room,
			}));
		});


	}


	handleSettingsChange = async (s,type) => {
		let {room, startDate, endDate, sentences, formatted,
			summaries, viewed_summaries, sentence_type} = this.state;

			room = room.replace("/","-")
			startDate = startDate.toISOString().split("T")[0]
			endDate = endDate.toISOString().split("T")[0]

			if(type === 'formatted'){
				s = sentences
				formatted = !formatted
				type = sentence_type
			}
			const f = formatted ? 1 : 0
			const endpoint = "http://127.0.0.1:5000/gitter/api/v1.0/conversation/" +
			room + "/" + startDate + "/" + endDate + "/" + s + "/" + type + "/" + f


			this.setState({ summary_loading: true }, () => {
				axios.get(endpoint)
				.then(result => this.setState({
					summary_loading: false,
					summaries: result["data"]["summaries"].filter(summary => (summaries.filter(e => e.summary_type === summary.summary_type).length > 0)),
					viewed_summaries: result["data"]["summaries"].filter(summary => (viewed_summaries.filter(e => e.summary_type === summary.summary_type).length > 0)),
					sentences: s,
					sentence_type: type,
					formatted: formatted
				}));
			});

		}

	renderSummaries(){
			const {
				summaries,
				viewed_summaries,
				sentences,
				formatted,
				summary_loading,
				conversation } = this.state
				return(
					<Summaries
					summaries={summaries}
					viewed_summaries={viewed_summaries}
					sentences={sentences}
					formatted={formatted}
					summary_loading={summary_loading}
					conversation={conversation}
					handleSummaryItemClick={this.handleSummaryItemClick}
					handleCloseClick={this.handleCloseClick}
					handleSettingsChange={this.handleSettingsChange}

					/>
				);
	}

			renderConversation(){
				const {conversation} = this.state;
				return(
					<Conversation conversation={conversation} />
				);
			}

			renderToggle(){
				const { toggle } = this.state;
				return(
					<Toggle
					toggle={toggle}
					handleToggleState={this.handleToggleState}
					title=""
					leftLabel="Original"
					rightLabel="Summary"/>
				);
			}

			renderSummaryRank(){
				const {
					summaries,
					viewed_summaries,
					sentences,
					formatted,
					summary_loading,
					conversation,
					room
				} = this.state
				return(
					<SummaryRank
						summaries={summaries}
						viewed_summaries={viewed_summaries}
						sentences={sentences}
						formatted={formatted}
						summary_loading={summary_loading}
						conversation={conversation}
						room={room}
						handleSummaryItemClick={this.handleSummaryItemClick}
						handleCloseClick={this.handleCloseClick}
						handleSettingsChange={this.handleSettingsChange}
					/>
				);

			}

			styles = {
				background: 'white',
				borderRadius: '5px',
				padding: '35px',
			};

			render() {
				return (
					<div className="content" style={this.styles}>
					<Logo />
					<div className="style2"/>
					{this.state.rank_view ?
						this.renderSummaryRank() :
						<div>
							<GitterForm handleFormSubmit={this.handleFormSubmit}/>
						<div className="style2"/>
							{this.state.loading ? <div className="main-loader"> <LoadingSpinner/> </div> :
							<div>
								{this.state.submitted && this.renderToggle() }
								{this.state.toggle ?
									this.state.submitted && this.renderSummaries() :
									this.state.submitted && this.renderConversation()}
							</div>}
						</div>
					}
					{this.state.submitted &&
						<div onClick={this.handleRankView}>
						<i className="fa fa-bars"></i>
						</div>}
						</div>
					);
				}
}

export default GitSum;
