import React from 'react';
import CSS from 'csstype';
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import AdminNav from './AdminNav';
import { sortTableNew } from '../sorts'

const wrapperStyles: CSS.Properties = {
    margin: '2rem',
    maxHeight: '400px',
    overflowY: 'scroll'
};

type ChatData = {
    status: string;
    data: Array<ChatMessages>;
};

type ChatMessages = {
    message_id: number;
    user_id: number;
    user: string;
    message: string;
    role: string;
    date: Date;
    room: string;
};

interface Props { }

interface State {
    messages: Array<ChatMessages>;
    message_id: number;
    user_id: number;
    user: string;
    message: string;
    room: string;
    role: string;
    selected: boolean;
    date: Date;
    fromDate: Date;
    toDate: Date;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class ChatHistory extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            messages: [],
            message_id: 0,
            user_id: 0,
            user: "",
            message: "",
            room: "",
            role: "",
            selected: false,
            date: new Date(9999, 1, 1),
            fromDate: new Date(0, 0, 1),
            toDate: new Date(9999, 1, 1)
        };
    }

    componentDidMount = () => {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "admin"
        && localStorage.getItem("userRole") !== "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
    }

    messageList = () => {
        if (new Date(this.state.toDate).getFullYear() === 9999) {
            fetch('https://casul-campus.herokuapp.com/courses/findMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    user_id: this.state.user_id,
                    room: this.state.room,
                    role: this.state.role
                })
            })
                .then(res => res.json())
                .then((jsonRes: ChatData) => {
                    if (jsonRes.data) {
                        this.setState({
                            messages: jsonRes.data
                        })
                    } else {
                        alert('Session expired. Logout and login again.')
                    }
                })
                .catch(error => console.log(error));
        } else {
            fetch('https://casul-campus.herokuapp.com/courses/findMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate + ":23:59:59",
                    user_id: this.state.user_id,
                    room: this.state.room,
                    role: this.state.role
                })
            })
                .then(res => res.json())
                .then((jsonRes: ChatData) => {
                    if (jsonRes.data) {
                        this.setState({
                            messages: jsonRes.data
                        })
                    } else {
                        alert('Session expired. Logout and login again.')
                    }
                })
                .catch(error => console.log(error));
        }
    }

    print = () => {
        console.log("fromDate", this.state.fromDate)
    }
    print2 = () => {
        console.log("toDate", this.state.toDate)
    }

    handleFromDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            fromDate: e.target.value
        }, this.print)
    }

    handleToDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            toDate: e.target.value
        }, this.print2)
    }

    handleDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            date: e.target.value
        })
    }

    handleRoomChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            room: e.target.value
        })
    }

    handleUserIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            user_id: e.target.value
        })
    }

    handleUserChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            user_id: e.target.value
        })
    }

    handleRoleChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            role: e.target.value
        })
    }

    handleMessageIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            message_id: e.target.value
        })
    }

    handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            message: e.target.value
        })
    }

    deleteMessage = () => {
        if (this.state.message_id === 0) {
            alert("Please, select message to be deleted.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/deleteMessage', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                message_id: this.state.message_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete messages.")
                }
                if (res.ok) {
                    alert("Message deleted successfully.");
                    this.clearForm();
                    this.messageList();
                    return;
                }
            })
            .catch(error => console.log(error));
    }

    updateMessage = () => {
        if (this.state.message_id === 0) {
            alert("Please, select message to be updated.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/updateMessage', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                message_id: this.state.message_id,
                message: this.state.message,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update messages.")
                }
                if (res.ok) {
                    alert("message updated successfully.");
                    this.clearForm();
                    this.messageList();
                    return;
                }
            })
            .catch(error => console.log(error));
    }

    clearSearchForm = () => {
        this.setState({
            fromDate: new Date(0, 0, 1),
            toDate: new Date(9999, 1, 1)
        })

        const fromDateField = document.getElementById("fromDateField") as HTMLInputElement;
        fromDateField!.value = "";
        const toDateField = document.getElementById("toDateField") as HTMLInputElement;
        toDateField!.value = "";

    }

    clearForm = () => {
        this.setState({
            message_id: 0,
            date: new Date(9999, 1, 1),
            messages: [],
            user: "",
            user_id: 0,
            fromDate: new Date(0, 0, 1),
            toDate: new Date(9999, 1, 1),
            room: "",
            role: ""
        })

        const fromDateField = document.getElementById("fromDateField") as HTMLInputElement;
        fromDateField!.value = "";

        const toDateField = document.getElementById("toDateField") as HTMLInputElement;
        toDateField!.value = "";
    }

    showMessage = (message: ChatMessages) => {
        this.setState({
            message_id: message.message_id,
            message: message.message,
            date: message.date,
            messages: this.state.messages,
            user: message.user,
            user_id: message.user_id,
            room: message.room,
            role: message.role
        })
    }

    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <br />

                <div className="full-text">
                    <br />
                    <h1 className="App">Chat History</h1>

                    {/* holiday schedule update */}
                    <div className="card card-body bg-white w-100" >
                        <div className="row no-gutters">
                            <div className="col-3">
                                <div className="card-body bg-light m-2">
                                    <h4 className="App">Search Range</h4>
                                    <form id="flowSchedUp">
                                        <div className="form-group">
                                            <label htmlFor="startDate">Start Date
                                                <span style={{ color: "red" }}>{" "} (optional field)</span>
                                            </label>
                                            <input type="date"
                                                id="fromDateField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleFromDateChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="startDate">End Date
                                                <span style={{ color: "red" }}>{" "} (optional field)</span>
                                            </label>
                                            <input type="date"
                                                id="toDateField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleToDateChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="roomField">Room
                                                <span style={{ color: "red" }}>{" "} (optional field)</span>
                                            </label>
                                            <input type="text"
                                                id="roomField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleRoomChange} />
                                        </div>

                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.messageList}>search</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearSearchForm}>clear</button>
                                    </form>
                                </div>
                            </div>


                            <div className="col-9">
                                <div className="card-body bg-light m-2">
                                    <h4 className="App">Messages</h4>
                                    <div className="wrapper" style={wrapperStyles}>
                                        <Paper>
                                            <Table id="myMessageTable">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>Date {" "}
                                                            <i className="fa fa-sort"
                                                                onClick={() => sortTableNew(1, "myMessageTable")}></i>
                                                        </TableCell>
                                                        <TableCell>Time
                                                        </TableCell>
                                                        <TableCell>User {" "}
                                                            <i className="fa fa-sort"
                                                                onClick={() => sortTableNew(3, "myMessageTable")}></i>
                                                        </TableCell>
                                                        <TableCell>Room {" "}
                                                            <i className="fa fa-sort"
                                                                onClick={() => sortTableNew(4, "myMessageTable")}></i>
                                                        </TableCell>
                                                        <TableCell style={{ maxWidth: "10px", minWidth: "10px", width: "150px" }}>Message
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.messages.map(message => (
                                                        <TableRow key={message.message_id}>
                                                            <TableCell style={{ width: "5px" }}><input id={"radioSelect" + message.message_id.toString()}
                                                                data-toggle="modal" data-target="#exampleModal" type="radio" name="selected" onChange={(e) => this.showMessage(message)} /></TableCell>
                                                            <TableCell >{message.date.toString().substr(0, 10)}</TableCell>
                                                            <TableCell >{message.date.toString().substr(11, 8)}</TableCell>
                                                            <TableCell >{message.user}</TableCell>
                                                            <TableCell >{message.room}</TableCell>
                                                            <TableCell id={"dateName" + message.message_id.toString()}>{message.message}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="short-text">
                    <div className="card card-body bg-white w-100" >
                        <h4 className="App">Chat History</h4>
                        <div className="card-body bg-light m-2">
                            <h4 className="App">Search Range</h4>
                            <form id="flowSchedUp">
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date
                                        <span style={{ color: "red" }}>{" "} (optional field)</span>
                                    </label>
                                    <input type="date"
                                        id="fromDateField"
                                        className="form-control"
                                        placeholder=""
                                        onChange={this.handleFromDateChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate">End Date
                                        <span style={{ color: "red" }}>{" "} (optional field)</span>
                                    </label>
                                    <input type="date"
                                        id="toDateField"
                                        className="form-control"
                                        placeholder=""
                                        onChange={this.handleToDateChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="roomField">Room
                                        <span style={{ color: "red" }}>{" "} (optional field)</span>
                                    </label>
                                    <input type="text"
                                        id="roomField"
                                        className="form-control"
                                        placeholder=""
                                        onChange={this.handleRoomChange} />
                                </div>

                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.messageList}>search</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.clearSearchForm}>clear</button>
                            </form>
                        </div>
                        <h4 className="App">Messages</h4>
                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>

                            <table className="myMessageTableMobile">
                                <thead className="myMessageTableMobile">
                                    <tr className="myMessageTableMobile">
                                        <th className="myMessageTableMobile" >Date
                                        </th>
                                        <th className="myMessageTableMobile">Time
                                        </th>
                                        <th className="myMessageTableMobile">User
                                        </th>
                                        <th className="myMessageTableMobile">Room
                                        </th>
                                        <th className="myMessageTableMobile">Message
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="myMessageTableMobile">
                                    {this.state.messages.map(message => (
                                        <tr className="myMessageTableMobile" key={message.message_id}>
                                            <td className="myMessageTableMobile"
                                                style={{ width: "5px" }}><input id={"radioSelect" + message.message_id.toString()}
                                                    data-toggle="modal" data-target="#exampleModal" type="radio" name="selected" onChange={(e) => this.showMessage(message)} /></td>
                                            <td className="myMessageTableMobile">{message.date.toString().substr(0, 10)}</td>
                                            <td className="myMessageTableMobile">{message.date.toString().substr(11, 8)}</td>
                                            <td className="myMessageTableMobile">{message.user}</td>
                                            <td className="myMessageTableMobile">{message.room}</td>
                                            <td className="myMessageTableMobile"
                                                id={"dateNameMobile" + message.message_id.toString()}>{message.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Message Manager</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-body bg-light" style={{ textAlign: "left", width: "96%", margin: "2%" }}>

                                    {/* this will apear only after a radio button has been clicked to select a message
                                        for edit or delete */}

                                    <form id="flowSchedUp">
                                        <div className="form-group">
                                            <label htmlFor="holidayDateField">Message</label>
                                            <textarea

                                                id="messageField"
                                                maxLength={500}
                                                className="form-control"
                                                placeholder=""
                                                value={this.state.message}
                                                onChange={this.handleMessageChange} />
                                        </div>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            data-dismiss="modal" aria-label="Close"
                                            onClick={this.deleteMessage}>delete</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            data-dismiss="modal" aria-label="Close"
                                            onClick={this.updateMessage}>update</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>clear</button>
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


export default ChatHistory;
