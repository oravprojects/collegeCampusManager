import React, {useState} from 'react';
import { Link} from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./JoinChat.css";
import LecturerNav from '../tasks/lecUI/LecturerNav';
import StudentNav from '../tasks/studentUI/StudentNav';
import AdminNav from '../tasks/adminUI/AdminNav';


var userRole = window.localStorage.getItem('userRole');
var first_name = window.localStorage.getItem('first_name');
var last_name = window.localStorage.getItem('last_name');

var nav = <LecturerNav />

const JoinChat = () => {
    if(!localStorage.getItem("thisToken")){
        window.location.href = "sessionEnd"
    }
    
    if(userRole === "lecturer" || userRole === "demoLecturer"){
        nav = <LecturerNav />
    }
    if(userRole === "student" || userRole === "demoStudent"){
        nav = <StudentNav />
    }
    if(userRole === "admin" || userRole === "demoAdmin"){
        nav = <AdminNav />
    }

    const [name, setName] = useState(first_name!+" "+last_name);
    const [room, setRoom] = useState('');

        return (
            <div> {nav}
            <div className="joinOuterContainer">
                <div className="joinInnerContainer">
                    <h1 className="heading">Join Chat</h1>
                    <div><input disabled placeholder={first_name!+" "+last_name} className="joinInput" type="text" onChange={(event)=>setName(first_name!+" "+last_name)} /></div>
                    <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event)=>setRoom(event.target.value)} /></div>
                    <Link onClick={event => (!name || !room) ? event.preventDefault() : null}  to ={`/chat?name=${name}&room=${room}`}>
                        <button className="button mt-20" type="submit">Sign In</button>
                    </Link>
                </div>
            </div>
            </div>
        )
    }

export default JoinChat;
