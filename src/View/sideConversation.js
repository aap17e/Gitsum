import React, {Component} from 'react';
import ConversationBubble from '../Common/conversationBubble'
import DateLine from '../Common/dateLine'

class SideConversation extends Component{
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


	componentDidUpdate(prevProps) {
		let {search} = this.props
		if(search){
			console.log('in if')
			let temp = this.props.conversation.filter(
				(message, index) => {
					return message.text.toLowerCase().indexOf(search.toLowerCase()) !== -1;
				}
			);

			if(temp.length > 0){
				this.scrollTo(temp[0].id);
			}
			else{
				search = search.split(".")[0].replace(/^\s+|\s+$/g,'');
				console.log("now search", search)
				let temp = this.props.conversation.filter(
					(message, index) => {
						return message.text.toLowerCase().indexOf(search.toLowerCase()) !== -1;
					}
				);

				if(temp.length > 0){
					this.scrollTo(temp[0].id);
				}
			}
		}
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
		const {conversation, search} = this.props

		return (
			<div>
			<div className="conversation-side style-2">
			{conversation.map((item, index) => (
				<div key={index} ref={el => (this.itemRefs[item.id] = el)}>
				{(index === 0 ||
					item.sent.slice(0, 16) !== conversation[index - 1].sent.slice(0, 16)) && <DateLine date={item.sent}/> }
					<ConversationBubble
					key={index}
					displayName={item.fromUser.displayName}
					text={item.text}
					sent={item.sent}
					searchWords={search}
					side={true}
					/>
					</div>
				))}
				</div>
				</div>
			);
		}

	}

	export default SideConversation;
