import React, {Component} from 'react';

class Sentence extends Component{
    render(){
        const {text, chosen} = this.props
        const name = chosen ? "summary-bubble-chosen" : "summary-bubble"
        return (
            <div>
                <h6 className={name}>{text}</h6>
            </div>
        );
    }

}

export default Sentence;
