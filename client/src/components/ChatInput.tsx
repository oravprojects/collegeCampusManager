import React from 'react';

import './ChatInput.css';

const ChatInput = ({message, setMessage, sendMessage} : {message:any, setMessage: any, sendMessage:any}) => (
    <form className="form">
        <input
        className="input"
        type="text"
        placeholder="Type a message . . ."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
        <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>

    </form>
)

export default ChatInput;