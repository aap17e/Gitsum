import React, {Component} from 'react';
import Highlighter from "react-highlight-words";

class ConversationBubble extends Component{
	styles = {
		margin: '0px 0px 0px 35px',
		background: 'White'
	};

	render(){
		const {text, displayName, searchWords, side} = this.props;
		let className = "speech-bubble";
		className += side ? "-side" : ""
		return (
			<div>
				<h6 style={this.styles}>{displayName}</h6>
				<div className={className}>
					<Highlighter
						highlightClassName="YourHighlightClass"
						searchWords={[searchWords]}
						autoEscape={true}
						textToHighlight={text}
					/>
				</div>
			</div>
		);
	}

}

export default ConversationBubble;
