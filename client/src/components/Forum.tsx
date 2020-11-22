import React from "react";
// import moment from 'moment';
// import CSS from 'csstype';
import LecturerNav from "../tasks/lecUI/LecturerNav";
import StudentNav from '../tasks/studentUI/StudentNav';
import AdminNav from '../tasks/adminUI/AdminNav';
import plusIcon from '../chatIcons/plusIcon.jpg';
import trashIcon from '../chatIcons/trashIcon.jpg';
import commentArrow from '../chatIcons/commentArrow.png';
// import { Hidden } from "@material-ui/core";

// var schmo = "";
// var myArray: any[] = [];
var myForumArray: any[] = [];
var usedCommArray: any[] = [];
var order = "desc"

type PostData = {
    status: string;
    data: Array<Post>;
}

type Post = {
    user_id: number;
    subject: string;
    post: string;
    comment_to_post: number;
    postDate: Date;
    first_name: string;
    last_name: string;
    post_id: number
}


interface Props { }
interface State {
    posts: Array<Post>;
    user_id: number;
    subject: string;
    post: string;
    comment_to_post: number;
    postDate: Date;
    first_name: string;
    last_name: string;
    post_id: number;
}
var user_id = (window.localStorage.getItem('user_id'));
const thisToken = localStorage.getItem("thisToken");
var userRole = localStorage.getItem("userRole");
var rid = localStorage.getItem("rid");

var nav = <LecturerNav />

class Forum extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            posts: [],
            user_id: 0,
            subject: "",
            post: "",
            comment_to_post: 0,
            postDate: new Date(),
            first_name: "",
            last_name: "",
            post_id: 0

        };
    }

    handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            post: e.target.value
        })
    }

    handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            subject: e.target.value
        })
    }

    sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (userRole === "demoStudent" || userRole === "demoLecturer" || userRole === "demoAdmin") {
            alert("This is a demo version. You do not have permission to post in this forum.");
            return;
        }
        fetch('https://casul-campus.herokuapp.com/forum/addPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                rid: rid,
                user_id: user_id,
                subject: this.state.subject,
                post: this.state.post,
                comment_to_post: this.state.comment_to_post
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to post in this forum.")
                }
                if (res.ok) {
                    this.clearForm();
                    this.newRefreshList();
                    alert("message posted successfully");
                    document.getElementById("startDiscussion")!.className = "collapse"
                }
            })
            .catch(error => console.log(error));
    }


    clearForm = () => {
        this.setState({
            post: "",
            subject: "",
            comment_to_post: 0
        })
        var subField = document.getElementById("subjectField") as HTMLTextAreaElement;
        subField!.value = "";

        var postField = document.getElementById("postField") as HTMLInputElement;
        postField!.value = "";
    }

    newBuildTableDesc = (data: any) => {
        usedCommArray = [];
        // console.log("this ", data)
        var table = document.getElementById("myTableNew") as HTMLTableElement;
        table.innerHTML = "";
        var delStyle = "'float: right'"
        // var checkID = 0;
        var checkIdArr: any[] = [];
        if (userRole === "student" || userRole === "demoStudent") {
            delStyle = "'display: none'"
        }

        for (var i = data.length - 1; i > -1; i--) {
            var discont = "false";
            var used = "unused";
            var counter = 0;

            // check if used
            for (var k = 0; k < usedCommArray.length; k++) {
                if (usedCommArray[k] === data[i].post_id) {
                    used = "used"
                }
            }

            if (data[i].comment_to_post > 0) {
                for (var t = 0; t < data.length; t++) {
                    if (data[i].comment_to_post === data[t].post_id) {
                        counter++
                    }
                } if (counter === 0) { discont = "true" }
            }

            if (data[i].comment_to_post === 0 || discont === "true") {
                // console.log(data[i].subject)
                if (used === "unused") {
                    var date = data[i].postDate.replace(/T|-|:/g, '').substr(0, 19);

                    var year = +date.substr(0, 4)
                    var month = +date.substr(4, 2) - 1
                    var day = +date.substr(6, 2)
                    var hour = +date.substr(8, 2)
                    var minute = +date.substr(10, 2)
                    var sec = +date.substr(12, 2)

                    date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                    var time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                    var row = `
                <tr><td>
                <p>
                    <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[i].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                    ${data[i].subject}
                    </a>
                    
                    <span class="full-text">
                    posted by ${data[i].first_name} ${data[i].last_name} on ${date} at ${time}</span> 
                    <span class="short-text">
                    ${data[i].first_name} ${data[i].last_name} ${date.substr(4, 11)} at ${time}</span><span style="float: right">
                    <button id="addCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm"
                    data-toggle="modal" data-target="#exampleModal">
                    <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                    <span style=${delStyle}><button id="delCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                    <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>
                               
                </p>
                <br/>
                <div class="collapse" id="collapseExample${data[i].post_id}">
                <div class="card card-body" style="width: 100%">
                ${data[i].post}
                </div>
                </div></tr></td>`

                    table.innerHTML += row;
                    // checkID = data[i].post_id;
                    checkIdArr.push(data[i].post_id)
                    // console.log(checkIdArr)
                    usedCommArray.push(data[i].post_id);
                }
                for (var z = 0; z < data.length; z++) {
                    var origin = "yes"
                    var foundCom = "no"
                    for (var j = 0; j < data.length; j++) {

                        foundCom = "no"
                        // console.log("i is ", i, " and j is ", j)
                        var usedComm = "unused"
                        if (data[j].comment_to_post === checkIdArr[checkIdArr.length - 1]) {

                            for (var x = 0; x < usedCommArray.length; x++) {
                                if (usedCommArray[x] === data[j].post_id) {
                                    usedComm = "used"
                                }
                            }
                            if (usedComm === "unused") {
                                date = data[j].postDate.replace(/T|-|:/g, '').substr(0, 19);

                                year = +date.substr(0, 4)
                                month = +date.substr(4, 2) - 1
                                day = +date.substr(6, 2)
                                hour = +date.substr(8, 2)
                                minute = +date.substr(10, 2)
                                sec = +date.substr(12, 2)

                                date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                                time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                                row = `
                            <tr><td>
                            <p>
                                <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[j].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                <img src=${commentArrow} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" />${data[j].subject}
                                </a>
                                
                                <span class="full-text">
                                posted by ${data[j].first_name} ${data[j].last_name} on ${date} at ${time}</span>
                                <span class="short-text">
                                ${data[j].first_name} ${data[j].last_name} ${date.substr(4, 11)} at ${time}</span> <span style="float: right">
                                <button id="addCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm"
                                data-toggle="modal" data-target="#exampleModal">
                                <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                                <span style=${delStyle}><button id="delCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                                <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>
                                         
                            </p>
                            <br/>
                            <div class="collapse" id="collapseExample${data[j].post_id}">
                            <div class="card card-body" style="width: 100%">
                            ${data[j].post}
                            </div>
                            </div></tr></td>`

                                table.innerHTML += row;
                                // checkID = data[j].post_id;
                                checkIdArr.push(data[j].post_id);
                                usedCommArray.push(data[j].post_id);

                                j = 0;
                                foundCom = "yes";
                                origin = "no";
                                // data.splice(j, 1)
                            }
                        }

                    } checkIdArr.pop();
                    if (checkIdArr.length === 0) { z = data.length }
                    // if(j === data.length && foundCom === "no" && origin === "yes"){z=data.length}
                    // if(j === data.length && foundCom === "no") {origin="yes"};
                    // checkID = data[i].post_id;         
                }
            }
        }
        for (var i = 0; i < data.length; i++) {
            var element = document.getElementById(`addCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.commentToPost;
            var element = document.getElementById(`delCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.delComment;
        }
    }

    newBuildTable = (data: any) => {
        usedCommArray = [];
        // console.log("this ", data)
        var table = document.getElementById("myTableNew") as HTMLTableElement;
        table.innerHTML = "";
        var delStyle = "'float: right'"
        // var checkID = 0;
        var checkIdArr: any[] = [];
        if (userRole === "student" || userRole === "demoStudent") {
            delStyle = "'display: none'"
        }

        for (var i = 0; i < data.length; i++) {
            var discont = "false";
            var used = "unused";
            var counter = 0;

            // check if used
            for (var k = 0; k < usedCommArray.length; k++) {
                if (usedCommArray[k] === data[i].post_id) {
                    used = "used"
                }
            }

            if (data[i].comment_to_post > 0) {
                for (var t = 0; t < data.length; t++) {
                    if (data[i].comment_to_post === data[t].post_id) {
                        counter++
                    }
                } if (counter === 0) { discont = "true" }
            }

            if (data[i].comment_to_post === 0 || discont === "true") {
                // console.log(data[i].subject)
                if (used === "unused") {
                    var date = data[i].postDate.replace(/T|-|:/g, '').substr(0, 19);

                    var year = +date.substr(0, 4)
                    var month = +date.substr(4, 2) - 1
                    var day = +date.substr(6, 2)
                    var hour = +date.substr(8, 2)
                    var minute = +date.substr(10, 2)
                    var sec = +date.substr(12, 2)

                    date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                    var time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                    var row = `
                <tr><td>
                <p>
                    <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[i].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                    ${data[i].subject}
                    </a>
                    <span class="full-text>
                    posted by ${data[i].first_name} ${data[i].last_name} on ${date} at ${time}</span>
                    <span class="short-text">
                    ${data[i].first_name} ${data[i].last_name} ${date.substr(4, 11)} at ${time}</span> <span style="float: right">
                    <button id="addCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm"
                    data-toggle="modal" data-target="#exampleModal">
                    <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                    <span style=${delStyle}><button id="delCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                    <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>            
                </p>
                <br/>
                <div class="collapse" id="collapseExample${data[i].post_id}">
                <div class="card card-body" style="width: 100%">
                ${data[i].post}
                </div>
                </div></tr></td>`

                    console.log(`addCom${data[i].post_id}`)
                    table.innerHTML += row;
                    // checkID = data[i].post_id;
                    checkIdArr.push(data[i].post_id)
                    // console.log(checkIdArr)
                    usedCommArray.push(data[i].post_id);
                }
                for (var z = 0; z < data.length; z++) {
                    var origin = "yes"
                    var foundCom = "no"
                    for (var j = 0; j < data.length; j++) {

                        foundCom = "no"
                        // console.log("i is ", i, " and j is ", j)
                        var usedComm = "unused"
                        if (data[j].comment_to_post === checkIdArr[checkIdArr.length - 1]) {

                            for (var x = 0; x < usedCommArray.length; x++) {
                                if (usedCommArray[x] === data[j].post_id) {
                                    usedComm = "used"
                                }
                            }
                            if (usedComm === "unused") {
                                date = data[j].postDate.replace(/T|-|:/g, '').substr(0, 19);

                                year = +date.substr(0, 4)
                                month = +date.substr(4, 2) - 1
                                day = +date.substr(6, 2)
                                hour = +date.substr(8, 2)
                                minute = +date.substr(10, 2)
                                sec = +date.substr(12, 2)

                                date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                                time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                                row = `
                            <tr><td>
                            <p>
                                <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[j].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                                <img src=${commentArrow} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" />${data[j].subject}
                                </a><span class="full-text">
                                posted by ${data[j].first_name} ${data[j].last_name} on ${date} at ${time}</span>
                                <span class="short-text">
                                ${data[j].first_name} ${data[j].last_name} ${date.substr(4, 11)} at ${time}</span> <span style="float: right">
                                <button id="addCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm"
                                data-toggle="modal" data-target="#exampleModal">
                                <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                                <span style=${delStyle}><button id="delCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                                <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>            
                            </p>
                            <br/>
                            <div class="collapse" id="collapseExample${data[j].post_id}">
                            <div class="card card-body" style="width: 100%">
                            ${data[j].post}
                            </div>
                            </div></tr></td>`

                                table.innerHTML += row;
                                // checkID = data[j].post_id;
                                checkIdArr.push(data[j].post_id);
                                usedCommArray.push(data[j].post_id);

                                j = 0;
                                foundCom = "yes";
                                origin = "no";
                                // data.splice(j, 1)
                            }
                        }

                    } checkIdArr.pop();
                    if (checkIdArr.length === 0) { z = data.length }
                    // if(j === data.length && foundCom === "no" && origin === "yes"){z=data.length}
                    // if(j === data.length && foundCom === "no") {origin="yes"};
                    // checkID = data[i].post_id;         
                }
            }
        }
        for (var i = 0; i < data.length; i++) {
            var element = document.getElementById(`addCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.commentToPost;
            var element = document.getElementById(`delCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.delComment;
        }
    }

    newBuildTableOld = (data: any) => {
        usedCommArray = [];
        var table = document.getElementById("myTableNew") as HTMLTableElement;
        table.innerHTML = "";
        var delStyle = "'float: right'"
        var checkID = 0;

        if (userRole === "student" || userRole === "demoStudent") {
            delStyle = "'display: none'"
        }

        for (var i = 0; i < data.length; i++) {
            var used = "unused";

            // check if used
            for (var k = 0; k < usedCommArray.length; k++) {
                if (usedCommArray[k] === data[i].post_id) {
                    used = "used"
                }
            }

            if (used === "unused") {
                var date = data[i].postDate.replace(/T|-|:/g, '').substr(0, 19);

                var year = +date.substr(0, 4)
                var month = +date.substr(4, 2) - 1
                var day = +date.substr(6, 2)
                var hour = +date.substr(8, 2)
                var minute = +date.substr(10, 2)
                var sec = +date.substr(12, 2)

                date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                var time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                var row = `
                <tr><td>
                <p>
                    <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[i].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                    ${data[i].subject}
                    </a><span class="full-text">
                    posted by ${data[i].first_name} ${data[i].last_name} on ${date} at ${time}</span>
                    <span class="short-text">
                    ${data[i].first_name} ${data[i].last_name} ${date.substr(4, 11)} at ${time}</span> <span style="float: right">
                    <button id="addCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm"
                    data-toggle="modal" data-target="#exampleModal">
                    <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                    <span style=${delStyle}><button id="delCom${data[i].post_id}" value="${data[i].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                    <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>            
                </p>
                <br/>
                <div class="collapse" id="collapseExample${data[i].post_id} style="width: 100%">
                <div class="card card-body">
                ${data[i].post}
                </div>
                </div></tr></td>`

                table.innerHTML += row;
                checkID = data[i].post_id;
                usedCommArray.push(checkID);
            }
            for (var z = 0; z < data.length; z++) {
                for (var j = 0; j < data.length; j++) {
                    var usedComm = "unused"
                    if (data[j].comment_to_post === checkID) {

                        for (var x = 0; x < usedCommArray.length; x++) {
                            if (usedCommArray[x] === data[j].post_id) {
                                usedComm = "used"
                            }
                        }
                        if (usedComm === "unused") {
                            date = data[j].postDate.replace(/T|-|:/g, '').substr(0, 19);

                            year = +date.substr(0, 4)
                            month = +date.substr(4, 2) - 1
                            day = +date.substr(6, 2)
                            hour = +date.substr(8, 2)
                            minute = +date.substr(10, 2)
                            sec = +date.substr(12, 2)

                            date = new Date(year, month, day, hour, minute, sec).toString().substr(0, 15)
                            time = new Date(year, month, day, hour, minute, sec).toString().substr(15, 9)

                            row = `
                        <tr><td>
                        <p>
                            <a class="btn btn-link" data-toggle="collapse" href="#collapseExample${data[j].post_id}" role="button" aria-expanded="false" aria-controls="collapseExample">
                            <img src=${commentArrow} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" />${data[j].subject}
                            </a><span class="full-text">
                            posted by ${data[j].first_name} ${data[j].last_name} on ${date} at ${time}</span>
                            <span class="short-text">
                            ${data[j].first_name} ${data[j].last_name} ${date.substr(4, 11)} at ${time}</span> <span style="float: right">
                            <button id="addCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm"
                            data-toggle="modal" data-target="#exampleModal">
                            <img src=${plusIcon} style="width: 15px; height: 15px; border-radius: 50%;" alt="addIcon" /> Comment</button></span>
                            <span style=${delStyle}><button id="delCom${data[j].post_id}" value="${data[j].post_id}" type="button" class="btn btn-info btn-sm mr-1" >
                            <img src=${trashIcon} style="width: 20px; height: 20px; border-radius: 50%;" alt="delIcon" /> delete</button></span>            
                        </p>
                        <br/>
                        <div class="collapse" id="collapseExample${data[j].post_id} style="width: 100%">
                        <div class="card card-body">
                        ${data[j].post}
                        </div>
                        </div></tr></td>`

                            table.innerHTML += row;

                            checkID = data[j].post_id;

                            usedCommArray.push(checkID);

                            j = 0;
                            // data.splice(j, 1)
                        }
                    }
                } checkID = data[i].post_id;
            }
        }
    }

    searchTable = (schmo: any, data: any) => {
        var filteredData: any[] = [];
        for (var i = 0; i < data.length; i++) {
            var name = data[i].subject.toLowerCase();

            if (name.includes(schmo)) {
                filteredData.push(data[i])
            }
        }
        return filteredData;
    }


    commentToPost = (event: any) => {
        this.setState({
            comment_to_post: event.currentTarget.value
        })
    }

    delComment = (event: any) => {
        this.setState({
            post_id: event.currentTarget.value
        })

        if (userRole !== "admin" && userRole !== "lecturer") {
            alert("This is a demo version. You do not have permission to delete comments.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/forum/deletePost', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                rid: rid,
                post_id: this.state.post_id
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete comments.");
                    return;
                }
                if (res.ok) {
                    alert("message deleted successfully");
                    this.newRefreshList();
                }
            })
            .catch(error => console.log(error));
    }


    newRefreshList = () => {
        fetch('https://casul-campus.herokuapp.com/forum/forumData')
            .then(res => res.json())
            .then((jsonRes: PostData) => {
                this.setState({
                    posts: jsonRes.data
                });
                myForumArray = jsonRes.data

                // this.newBuildTable(myForumArray);
                if (order === "desc") {
                    this.newBuildTableDesc(myForumArray);
                } else {
                    this.newBuildTable(myForumArray);
                }
                for (var i = 0; i < jsonRes.data.length; i++) {
                    var element = document.getElementById(`addCom${jsonRes.data[i].post_id}`) as HTMLButtonElement;
                    element.onclick = this.commentToPost;
                    var element = document.getElementById(`delCom${jsonRes.data[i].post_id}`) as HTMLButtonElement;
                    element.onclick = this.delComment;
                }

            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }

        this.newRefreshList();
    };

    thClicked = () => {
        console.log("th was clicked")
    }

    sortTable = () => {
        if (order === "desc") {
            order = "asc"
            this.newBuildTable(myForumArray);
        } else {
            order = "desc";
            this.newBuildTableDesc(myForumArray);
        }
    }

    onKeyUp = (e: any) => {
        var value = document.getElementById("search-input") as HTMLInputElement
        var schmo = value.value.toLowerCase();

        var data = this.searchTable(schmo, myForumArray)
        if (order === "desc") {
            this.newBuildTableDesc(data);
        } else {
            this.newBuildTable(data);
        }
        // this.newBuildTable(data)
        for (var i = 0; i < data.length; i++) {
            var element = document.getElementById(`addCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.commentToPost;
            var element = document.getElementById(`delCom${data[i].post_id}`) as HTMLButtonElement;
            element.onclick = this.delComment;
        }
    }

    render() {
        if (userRole === "lecturer" || userRole === "demoLecturer") {
            nav = <LecturerNav />
        }
        if (userRole === "student" || userRole === "demoStudent") {
            nav = <StudentNav />
        }
        if (userRole === "admin" || userRole === "demoAdmin") {
            nav = <AdminNav />
        }

        return (
            <div>
                <div>
                    {nav}
                </div>
                <br />
                <br />
                <br />
                <div className="card-transparent ml-4">
                    <div className="collapse" id="startDiscussion">
                        <div className="card-transparent" id="startDisc">
                            <form name="formid">
                                <div className="form-group">
                                    <label htmlFor="subjectField">Subject</label>
                                    <input type="text"
                                        className="form-control"
                                        maxLength={255}
                                        value={this.state.subject}
                                        onChange={this.handleSubjectChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contentField">Message</label>
                                    <textarea
                                        maxLength={1000}
                                        rows={5}
                                        className="form-control"
                                        placeholder="enter question or comment"
                                        value={this.state.post}
                                        onChange={this.handleContentChange} />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg btn-block"
                                    onClick={this.sendMessage}>Send</button>

                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.clearForm}>Clear Form</button>
                                <button type="button" className="btn btn-outline-primary mr-3"
                                    data-toggle="collapse" data-target="#startDiscussion" aria-expanded="false"
                                    aria-controls="collapseExample">Close</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row form-inline">
                        <div className="col" >
                            <br />
                            <table className="table table-striped mb-0" >
                                <thead>
                                    <tr className="bg-info">
                                        <th data-column="name" data-order="desc">
                                            <div className="container-fluid">
                                                <div className="row" >
                                                    <div className="col-4">
                                                        <span className="full-text">Forum Discussions <i className="fa fa-sort"
                                                            onClick={() => this.sortTable()}></i></span>
                                                        <span className="short-text">
                                                            Sort <i className="fa fa-sort"
                                                                onClick={() => this.sortTable()}></i>
                                                        </span>
                                                    </div>
                                                    <div className="col-4 App">
                                                        <span className="full-text">
                                                            <button className="btn btn-light" style={{ color: 'black' }} data-toggle="collapse" data-target="#startDiscussion" aria-expanded="false" aria-controls="collapseExample">
                                                                Start a Discussion
                                                        </button></span>
                                                        <span className="short-text">
                                                            <button className="btn btn-light" style={{ color: 'black' }} data-toggle="collapse" data-target="#startDiscussion" aria-expanded="false" aria-controls="collapseExample">
                                                                Post
                                                        </button></span>
                                                    </div>
                                                    <div className="col-4 AppRight">
                                                        <input onKeyUp={(e) => this.onKeyUp(e)} id="search-input" placeholder="search . . ." className="form-control" type="text" />
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                            <div style={{ height: "480px", overflowY: "auto" }}>
                                <table className="table table-striped mt-0">
                                    <thead>
                                    </thead>
                                    <tbody id="myTableNew"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Write a Comment</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-transparent" style={{ textAlign: "left", width: "90%" }}>
                                    <form name="formid">
                                        <div className="form-group">
                                            <label htmlFor="subjectField">Subject</label>
                                            <input
                                                id="subjectField"
                                                type="text"
                                                className="form-control"
                                                maxLength={255}
                                                value={this.state.subject}
                                                onChange={this.handleSubjectChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="contentField">Message</label>
                                            <textarea
                                                id="postField"
                                                maxLength={1000}
                                                rows={5}
                                                className="form-control"
                                                placeholder="enter question or comment"
                                                value={this.state.post}
                                                onChange={this.handleContentChange} />
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.sendMessage} data-dismiss="modal">Send</button>

                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>Clear Form</button>
                                    </form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Forum;

