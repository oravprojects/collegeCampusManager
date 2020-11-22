import React from "react";
import moment from 'moment';
// import CSS from 'csstype';
import LecturerNav from "../tasks/lecUI/LecturerNav";
import StudentNav from '../tasks/studentUI/StudentNav';
import AdminNav from '../tasks/adminUI/AdminNav';
// import { stringify } from "query-string";
// import { isNull } from "util";

// define style for calendar
// const style: CSS.Properties = {
//     position: 'relative',
//     margin: '5%',
//     width: '95%',
//     height: '95%'
// };

interface Props {
    width: string;
    style: string;
    onMonthChange: Function;
    onYearChange: Function;
    onNextMonth: Function;
    onPrevMonth: Function;
}

type CourseListData = {
    status: string;
    data: Array<Course>;
}

type Course = {
    course_id: number;
    date: string;
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    flow_id: number;
    subject: string;
    post: string;
    file_path: string;
    section: number;
};

interface State {
    dateContext: any;
    today: any;
    showMonthPopup: any;
    showYearPopup: any;
    showYearNav: any;
    course_id: number;
    date: string;
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    flow_id: number;
    uploadFile: any;
    subject: string;
    post: string;
    file_path: string;
    section: number;
}

var userRole = window.localStorage.getItem('userRole');
var nav = <LecturerNav />
var user_id = (window.localStorage.getItem('user_id'));
var rid = (window.localStorage.getItem('rid'));
const thisToken = localStorage.getItem("thisToken");
const flowIdArr: any[] = [];
// var courses: never[] = [];
var dayId = 0;
var message = "";
var thisDay: [{ date: number, name: string, month: number, year: number, start_time: string, end_time: string, flow_id: number, id: number, subject: string, post: string, file_path: string }] =
    [{ date: 0, name: "", month: 0, year: 0, start_time: "", end_time: "", flow_id: 0, id: 0, subject: "", post: "", file_path: "" }];
var thisDayIndex = 0;
var refreshCounter = 0;

class Calendar extends React.Component<Props, State> {
    width: string;
    style: string;
    yearInput: HTMLInputElement | null | undefined;


    constructor(props: Props) {
        super(props);
        this.width = props.width || "350px";
        this.style = props.style || "";


        this.state = {
            dateContext: moment(),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            showYearNav: false,
            course_id: 0,
            date: "",
            id: 0,
            name: "",
            start_time: "",
            end_time: "",
            flow_id: 0,
            section: 0,
            uploadFile: null,
            subject: "",
            post: "",
            file_path: ""
        }
    };

    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort();
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth: any = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        return this.state.dateContext.format("date");
    }
    currentDay: any = () => {
        return this.state.dateContext.format("D");
    }
    firstDayOfMonth: any = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }

    setMonth = (month: any) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    nextMonth = () => {
        thisDayIndex = 0;
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();

    }

    prevMonth = () => {
        thisDayIndex = 0;
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();

    }

    onSelectChange = (e: any, data: any) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();
    }

    SelectList = (props: any) => {
        let popup = props.data.map((data: number) => {
            return (
                <div key={data}>
                    <a href="#" onClick={(e) => { this.onSelectChange(e, data) }}>
                        {data}
                    </a>
                </div>
            )
        });
        return (
            <div className="month-popup">
                {popup}
            </div>
        )
    }

    onChangeMonth = (e: any, month: any) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e) => { this.onChangeMonth(e, this.month()) }}>
                {this.month()}
                {this.state.showMonthPopup &&
                    <this.SelectList data={this.months} />
                }
            </span>
        )
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        })
    }

    setYear = (year: number) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        });
    }

    onYearChange = (e: { target: { value: any; }; }) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e: any) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            });
        }
    }

    YearNav = () => {
        return (
            this.state.showYearNav ?
                <input defaultValue={this.year()}
                    className="editor-year"
                    ref={(yearInput) => { this.yearInput = yearInput }}
                    onKeyUp={(e) => this.onKeyUpYear(e)}
                    onChange={(e) => this.onYearChange(e)}
                    type="number"
                    placeholder="year" />
                :
                <span
                    className="label-year"
                    onDoubleClick={(e: any) => { this.showYearEditor() }}>
                    {this.year()}
                </span>
        );
    }

    // onDayClick = (e, day) => {
    //     this.props.onDayClick && this.props.onDayClick(e, day);
    // }

    handleUploadFileChange = (event: any) => {
        this.setState({
            uploadFile: event.target.files[0]
        })
    }

    addFile = (e: { preventDefault: () => void; }) => {
        if (userRole !== "lecturer") {
            alert("This is a demo version. You do not have permission to upload files.");
            return;
        }
        e.preventDefault();

        if (thisDay[thisDayIndex].start_time === "") {
            alert("You do not have class on this day.");
            return;
        }

        if (this.state.post === "" || this.state.subject === "") {
            alert("Please enter subject and message.");
            return;
        }

        if (this.state.uploadFile === null) {
            this.updateCal(e);
            return;
        }

        const fd = new FormData();
        fd.append('userFile', this.state.uploadFile, this.state.uploadFile.name);
        fetch('https://casul-campus.herokuapp.com/registration/addFile', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + rid
            },
            body: fd
        })

            .then(res => {
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to upload files.");
                    return;
                }
                res.json()
                    .then((jsonRes) => {
                        var path = jsonRes.location;
                        this.setState({
                            file_path: path
                        })
                        this.updateCal(e);
                        // document.getElementById("message")!.innerHTML += "<p>Attached File " + jsonRes.filename + " uploaded successfully.</p>"
                        // return false;

                    })
            })
            .catch(error => console.log(error));
    };

    updateCal = (e: { preventDefault: () => void; }) => {
        if (userRole !== "lecturer") {
            alert("This is a demo version. You do not have permission to post announcements.");
            return;
        }
        e.preventDefault();

        if (thisDay[thisDayIndex].start_time === "") {
            alert("You do not have class on this day.");
            return;
        }

        if (this.state.post === "" || this.state.subject === "") {
            alert("Please enter subject and message.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/campUser/updateCal', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                rid: rid,
                id: thisDay[thisDayIndex].id,
                file_path: this.state.file_path,
                post: this.state.post,
                subject: this.state.subject
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to post announcements.");
                    return;
                }
                if (res.ok) {
                    alert("Added successfully!")
                    this.clearForm();
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };


    onDayClick = (e: any, day: any, message: string, dayId: number, thisDay: Array<any>) => {
        // alert(day);

        this.setState({
            id: dayId
        })

        for (var i = 0; i < thisDay.length; i++) {
            // if (thisDay[i].date === 0 || thisDay.length === 0){
            //     alert("There is no information for the selected day.");
            //     return;
            // }
            if (thisDay[i].date === day) {
                dayId = this.lessonArr[i].id;
                thisDayIndex = i
            }
        }
    }

    handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            subject: e.target.value
        })
    }

    handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            post: e.target.value
        })
    }

    clearForm = () => {
        this.setState({
            post: "",
            subject: "",
            file_path: "",
            uploadFile: null
        });
        var subField = document.getElementById("subjectField") as HTMLFormElement
        var postField = document.getElementById("postField") as HTMLFormElement
        var fileField = document.getElementById("userFile") as HTMLFormElement

        subField.value = "";
        postField.value = "";
        fileField.value = null;


    }

    jsonResArr: number[] = [];
    lessonArr: { date: number, name: string, month: number, year: number, start_time: string, end_time: string, flow_id: number, id: number, subject: string, post: string, file_path: string, section: number }[] = []


    refreshList = () => {
        this.jsonResArr.length = 0;
        this.lessonArr.length = 0;
        var exists = ""

        if (userRole === "student" || userRole === "demoStudent") {
            fetch('https://casul-campus.herokuapp.com/courses/studentSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    user_id: user_id
                })
            })
                .then(res => res.json())
                .then((jsonRes: CourseListData) => {
                    if (jsonRes.data) {
                        this.setState({
                            // courses: jsonRes.data
                        });
                        for (var i = 0; i < jsonRes.data.length; i++) {
                            var res = +(jsonRes.data[i].date.substr(8, 2));
                            var mon = +(jsonRes.data[i].date.substr(5, 2));
                            var yr = +(jsonRes.data[i].date.substr(0, 4));
                            this.jsonResArr.push(res);
                            if (this.lessonArr.length === 0) {
                                this.lessonArr.push({
                                    "date": res, "name": jsonRes.data[i].name, "month": mon, "year": yr,
                                    start_time: jsonRes.data[i].start_time, end_time: jsonRes.data[i].end_time, flow_id: jsonRes.data[i].flow_id, id: jsonRes.data[i].id, subject: jsonRes.data[i].subject, post: jsonRes.data[i].post, file_path: jsonRes.data[i].file_path, section: jsonRes.data[i].section
                                })
                            }
                            else {

                                for (var z = 0; z < this.lessonArr.length; z++) {
                                    if (jsonRes.data[i].name === this.lessonArr[z].name && res === this.lessonArr[z].date
                                        && mon === this.lessonArr[z].month && yr === this.lessonArr[z].year) {
                                        z = this.lessonArr.length;
                                        exists = "exists";
                                    }
                                    exists = exists;
                                }

                                if (exists !== "exists") {
                                    this.lessonArr.push({
                                        "date": res, "name": jsonRes.data[i].name, "month": mon, "year": yr,
                                        start_time: jsonRes.data[i].start_time, end_time: jsonRes.data[i].end_time, flow_id: jsonRes.data[i].flow_id, id: jsonRes.data[i].id, subject: jsonRes.data[i].subject, post: jsonRes.data[i].post, file_path: jsonRes.data[i].file_path, section: jsonRes.data[i].section
                                    })
                                }
                            }
                            var counter = 0;
                            flowIdArr[0] = this.lessonArr[0].flow_id
                            for (var c = 0; c < flowIdArr.length; c++) {
                                if (this.lessonArr[i].flow_id === flowIdArr[c]) {
                                    counter++
                                }
                            } if (counter === 0) { flowIdArr.push(this.lessonArr[i].flow_id) }
                            window.localStorage.setItem("lesson", jsonRes.data[0].date.substr(8, 2))
                        };
                    } else {
                        alert('Session expired. Logout and login again.')
                        window.location.href = "sessionEnd"
                    }
                })
                .catch(error => console.log(error));
        }
        else {
            fetch('https://casul-campus.herokuapp.com/courses/mySchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    lecturerId: user_id
                })
            })
                .then(res => res.json())
                .then((jsonRes: CourseListData) => {
                    if (jsonRes.data) {
                        this.setState({
                            // courses: jsonRes.data
                        });
                        for (var i = 0; i < jsonRes.data.length; i++) {
                            var res = +(jsonRes.data[i].date.substr(8, 2));
                            var mon = +(jsonRes.data[i].date.substr(5, 2));
                            var yr = +(jsonRes.data[i].date.substr(0, 4));

                            this.jsonResArr.push(res);
                            if (this.lessonArr.length === 0) {
                                this.lessonArr.push({
                                    "date": res, "name": jsonRes.data[i].name, "month": mon, "year": yr,
                                    start_time: jsonRes.data[i].start_time, end_time: jsonRes.data[i].end_time, flow_id: jsonRes.data[i].flow_id, id: jsonRes.data[i].id, subject: jsonRes.data[i].subject, post: jsonRes.data[i].post, file_path: jsonRes.data[i].file_path, section: jsonRes.data[i].section
                                })
                            }
                            else {

                                for (var z = 0; z < this.lessonArr.length; z++) {
                                    if (jsonRes.data[i].name === this.lessonArr[z].name && res === this.lessonArr[z].date
                                        && mon === this.lessonArr[z].month && yr === this.lessonArr[z].year) {
                                        z = this.lessonArr.length;
                                        exists = "exists";
                                    }
                                    exists = exists;
                                }

                                if (exists !== "exists") {
                                    this.lessonArr.push({
                                        "date": res, "name": jsonRes.data[i].name, "month": mon, "year": yr,
                                        start_time: jsonRes.data[i].start_time, end_time: jsonRes.data[i].end_time, flow_id: jsonRes.data[i].flow_id, id: jsonRes.data[i].id, subject: jsonRes.data[i].subject, post: jsonRes.data[i].post, file_path: jsonRes.data[i].file_path, section: jsonRes.data[i].section
                                    })
                                }
                            }
                            var counter = 0;
                            flowIdArr[0] = this.lessonArr[0].flow_id
                            for (var c = 0; c < flowIdArr.length; c++) {
                                if (this.lessonArr[i].flow_id === flowIdArr[c]) {
                                    counter++
                                }
                            } if (counter === 0) { flowIdArr.push(this.lessonArr[i].flow_id) }


                            window.localStorage.setItem("lesson", jsonRes.data[0].date.substr(8, 2))
                        };
                    } else {
                        alert('Session expired. Logout and login again.')
                        window.location.href = "sessionEnd"
                    }
                })
                .catch(error => console.log(error));
        }
    };


    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "lecturer" &&
            localStorage.getItem("userRole") !== "student" && localStorage.getItem("userRole") !== "demoStudent"
            && localStorage.getItem("userRole") !== "demoLecturer") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
    };



    render() {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();

        if (this.jsonResArr.length === 0 && refreshCounter < 5) {
            refreshCounter++
            this.refreshList();
            return <div className="App">Schedule Loading . . .</div>;
        }
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks: any[] = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
            </td>
            );
        }

        let daysInMonth: any[] = [];
        thisDay = [{ date: 0, name: "", month: 0, year: 0, start_time: "", end_time: "", flow_id: 0, id: 0, subject: "", post: "", file_path: "" }];

        for (let d = 1; d <= this.daysInMonth(); d++) {
            message = ""
            var message2 = ""
            var message3 = ""
            var message4 = ""


            dayId = 0
            let className = (d === +this.currentDay() && this.state.dateContext.format("MMMM") === this.months[currentMonth]
                && +this.state.dateContext.format("Y") === currentYear ? "day current-day" : "day");

            for (let j = 0; j < this.lessonArr.length; j++) {
                if (d === +this.lessonArr[j].date && this.state.dateContext.format("MMMM") === this.months[this.lessonArr[j].month - 1]
                    && +this.state.dateContext.format("Y") === this.lessonArr[j].year) {
                    message = this.lessonArr[j].name;
                    thisDay.push(this.lessonArr[j])
                    message2 = "Sec. " + this.lessonArr[j].section;
                    message4 = " Flow " + this.lessonArr[j].flow_id;
                    message3 = this.lessonArr[j].start_time + "-" + this.lessonArr[j].end_time;
                }
            }

            daysInMonth.push(
                <td key={d} className={className} >
                    <span onClick={(e) => { this.onDayClick(e, d, message, dayId, thisDay) }}
                        data-toggle="modal" data-target={(localStorage.getItem("userRole") === "lecturer" ||
                            localStorage.getItem("userRole") === "admin" ||
                            localStorage.getItem("userRole") === "demoLecturer" ||
                            localStorage.getItem("userRole") === "demoAdmin" ? "#exampleModal" : "#exampleModal1")}
                        style={{ fontSize: 'medium' }}>{d}
                    </span>
                    <table style={{ margin: "auto" }}>
                        <tbody>
                            <tr style={{ height: "50px" }}>
                                <td>
                                    <span onClick={(e) => { this.onDayClick(e, d, message, dayId, thisDay) }}
                                        data-toggle="modal" data-target="#exampleModal1" style={
                                            (message === "" ? (d === +this.currentDay() && this.state.dateContext.format("MMMM") === this.months[currentMonth]
                                                && +this.state.dateContext.format("Y") === currentYear ? { minHeight: "20px", maxWidth: "200px", color: "#4285f4" } : { minHeight: "20px", maxWidth: "200px", color: "white" }) : { minHeight: "20px", maxWidth: "200px", color: "black", background: "papayawhip" })}>
                                        {message}
                                        {/* {message = (d === 9 ? "you have class" : "  ")} */}
                                    </span>
                                </td>

                            </tr>
                            <tr className="full-text" style={{ height: "20px" }}>
                                <td >
                                    <span onClick={(e) => { this.onDayClick(e, d, message, dayId, thisDay) }}
                                        data-toggle="modal" data-target="#exampleModal1" style={
                                            (message === "" ? (d === +this.currentDay() && this.state.dateContext.format("MMMM") === this.months[currentMonth]
                                                && +this.state.dateContext.format("Y") === currentYear ? { minHeight: "20px", maxWidth: "200px", color: "#4285f4" } : { minHeight: "20px", maxWidth: "200px", color: "white" }) : { minHeight: "20px", maxWidth: "200px", color: "black", background: "papayawhip" })}>
                                        {message2} {message4}
                                        {/* {message = (d === 9 ? "you have class" : "  ")} */}
                                    </span>
                                </td>

                            </tr>
                            <tr className="short-text" style={{ height: "20px" }}>
                                <td >
                                    <span onClick={(e) => { this.onDayClick(e, d, message, dayId, thisDay) }}
                                        data-toggle="modal" data-target="#exampleModal1" style={
                                            (message === "" ? (d === +this.currentDay() && this.state.dateContext.format("MMMM") === this.months[currentMonth]
                                                && +this.state.dateContext.format("Y") === currentYear ? { minHeight: "20px", maxWidth: "200px", color: "#4285f4" } : { minHeight: "20px", maxWidth: "200px", color: "white" }) : { minHeight: "20px", maxWidth: "200px", color: "black", background: "papayawhip" })}>
                                        {message2}
                                        {/* {message = (d === 9 ? "you have class" : "  ")} */}
                                    </span>
                                </td>

                            </tr>
                            <tr style={{ height: "20px" }}>
                                <td>
                                    <span onClick={(e) => { this.onDayClick(e, d, message, dayId, thisDay) }}
                                        data-toggle="modal" data-target="#exampleModal1" style={
                                            (message === "" ? (d === +this.currentDay() && this.state.dateContext.format("MMMM") === this.months[currentMonth]
                                                && +this.state.dateContext.format("Y") === currentYear ? { minHeight: "20px", maxWidth: "200px", color: "#4285f4" } : { minHeight: "20px", maxWidth: "200px", color: "white" }) : { minHeight: "20px", maxWidth: "200px", color: "black", background: "papayawhip" })}>
                                        {message3}
                                        {/* {message = (d === 9 ? "you have class" : "  ")} */}
                                    </span>
                                </td>
                            </tr></tbody></table>
                </td>
            )
        }


        var totalSlots = [...blanks, ...daysInMonth];
        let rows: JSX.Element[][] = [];
        let cells: JSX.Element[] = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            }
            else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i * 100}>
                    {d}
                </tr>
            );
        })

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
                {nav}
                <div className="calendar-container">
                    <table className="calendar" style={{ tableLayout: "auto" }}>
                        <thead>
                            <tr className="calendar-header">
                                <td colSpan={5}>
                                    <this.MonthNav />
                                    {" "}
                                    <this.YearNav />
                                </td>
                                <td colSpan={2} className="nav-month">
                                    <i className="prev fas fa-fw fa-chevron-left"
                                        onClick={(e) => { this.prevMonth() }}>
                                    </i>
                                    <i className="prev fas fa-fw fa-chevron-right"
                                        onClick={(e) => { this.nextMonth() }}>
                                    </i>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {weekdays}
                            </tr>
                            {trElems}
                        </tbody>
                    </table>
                </div>
                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Post a Message</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-transparent" style={{ textAlign: "left", width: "100%" }}>
                                    <form name="formid">

                                        <div className="form-group">
                                            <label htmlFor="subjectField">Subject</label>
                                            <input
                                                id="subjectField"
                                                type="text"
                                                className="form-control calSubField"
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
                                                className="form-control calPostField"
                                                placeholder="enter question or comment"
                                                value={this.state.post}
                                                onChange={this.handleContentChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="uploadField">Upload File</label>
                                            <input type="file"
                                                id="userFile"
                                                name="userFile"
                                                className="form-control calFileField"
                                                placeholder=""
                                                onChange={this.handleUploadFileChange} />
                                        </div>


                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.addFile} data-dismiss="modal">Send</button>
                                        {/* <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.addFile}>File</button> */}
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

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal1" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Announcements</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-transparent" style={{ textAlign: "left", width: "400px" }}>
                                    <p>{message}</p>
                                    <p style={(thisDay[thisDayIndex].subject === null && thisDay[thisDayIndex].post === null ? { color: 'green' } : { display: 'none' })}>No announcements.</p>
                                    <p style={(thisDay[thisDayIndex].subject === "" || thisDay[thisDayIndex].subject === null ? { display: 'none' } : {})}>Title: {thisDay[thisDayIndex].subject}</p>
                                    <p style={(thisDay[thisDayIndex].post === "" || thisDay[thisDayIndex].post === null ? { display: 'none' } : {})}>Message: {thisDay[thisDayIndex].post}</p>
                                    <p style={(thisDay[thisDayIndex].file_path === "" || thisDay[thisDayIndex].file_path === null ? { display: 'none' } : {})}>Link: <a href={`http://localhost:3000/${thisDay[thisDayIndex].file_path}`}>click to view attachment</a></p>
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

export default Calendar;

