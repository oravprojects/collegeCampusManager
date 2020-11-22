import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Messages.css';
import Message from './Message';


const Messages = ({messages, name} : {messages:any, name: any}) => (
    <ScrollToBottom className="messages">
        {messages.map((message: any, i: string | number | undefined) => <div key={i}><Message message={message} name={name}/></div>)}
    </ScrollToBottom>
)

export default Messages;