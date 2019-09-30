import React, {Component} from 'react';
import ConversationBubble from './conversationBubble'
import DateLine from './dateLine'

class Conversation extends Component{
	constructor(props, context) {
		super(props, context);

		this.itemRefs = {};
		this.state = {
			search:''
		}
	}

	scrollTo(id) {
		console.log(this.itemRefs[id]);
		this.itemRefs[id].scrollIntoView();
	}

	updateSearch = (event) => {
		let temp = this.props.conversation.filter(
			(message, index) => {
				return message.text.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1;
			}
		);

		if(temp.length > 0){
			this.scrollTo(temp[0].id);
		}

		this.setState({
			search: event.target.value
		})

	}



	render(){
		const {conversation} = this.props
		return (
			<div>
			<div className="has-search">
			<span className="fa fa-search form-control-feedback"></span>
			<input
			type="text"
			className="conversation-search"
			placeholder="Search"
			value={this.state.search}
			onChange={this.updateSearch}
			/>
			</div>
			<div className="conversation style-2">
			{conversation.map((item, index) => (
				<div key={index} ref={el => (this.itemRefs[item.id] = el)}>
				{(index === 0 ||
					item.sent.slice(0, 16) !== conversation[index - 1].sent.slice(0, 16)) && <DateLine date={item.sent}/> }
					<ConversationBubble
					key={index}
					displayName={item.fromUser.displayName}
					text={item.text}
					sent={item.sent}
					searchWords={this.state.search}
					side={false}
					/>
					</div>
				))}
				</div>
				</div>
			);
		}

	}

	export default Conversation;
