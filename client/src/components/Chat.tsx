import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from './InfoBar';
import ChatInput from './ChatInput';
import Messages from './Messages';

import CSS from 'csstype';

import './Chat.css';
import TextContainer from './TextContainer';

let socket: any;
const ENDPOINT = 'https://casul-campus.herokuapp.com/';

const containerStyle: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#FFFFFF",
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    overflow: "auto",
    padding: "0",
    minWidth:"350px",
    maxWidth:"350px",
    minHeight:"400px",
    maxHeight: "400px"
    
};

var sendOK = false;
const userRole = window.localStorage.getItem('userRole');
const rid = window.localStorage.getItem('rid');

const Chat = ({ location }: { location: any }) => {
    
    if(!localStorage.getItem("thisToken")){
        window.location.href = "sessionEnd"
    }
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages]: any = useState([]);
    const data = queryString.parse(location.search);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)!;

        socket = io(ENDPOINT)

        setName(name!.toString());
        setRoom(room!.toString());
        
        socket.emit('join', {name, room}, (error: any) =>{
            if (error) {
                alert (error)
            }

        });

        return () =>{
            socket.emit('disconnect');

            socket.off();
        }

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message:string) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({users}:{users:any}) => {
            setUsers(users);
          });
          
    }, [messages]);

    const sendMessage = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }

        sendOK = true;
    };

    const saveChat = () =>{
        if(userRole !== "student" && userRole !== "lecturer" && userRole !== "admin"){
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/saveChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rid: rid,
                message: messages[messages.length-1].text,
                user: messages[messages.length-1].user,
                room: room
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.ok) {
                }
            })
            .catch(error => console.log(error));

            sendOK = false;
    }
    
    if(sendOK){saveChat()}
    

    return (
        <div className="outerContainer" style={{minHeight:"600px"}}>
            <div className="row" style={{padding: "10px"}}>
            <div className="col" style={{padding: "10px"}}>
            <div className="container" style={containerStyle}>
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage}/>

                {/* <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event): null}/> */}
            </div>
            </div>
            <div className="col">
            <TextContainer users={users}/>
            </div>
            </div>
        </div>
    )
}

export default Chat;

