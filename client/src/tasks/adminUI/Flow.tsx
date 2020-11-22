import React from 'react';
import CSS from 'csstype';
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import AdminNav from './AdminNav';
import { sortTable, sortTableNew, sortTableNewNumber } from '../sorts'




var dataArr: any[] = [];
var specNameArr: any[] = [];
var specSwitch: number = 0;
var holidayDates: string | any[] = [];
type schedDatesArr = Object[];
var schedDatesArr: any[] = [];
// var checkDatesArr: any[] = [];
var lecturerArr: any[] = [];
var lecturerSched: any[] = [];

const wrapperStyles: CSS.Properties = {

    maxHeight: '400px',
    overflow: 'scroll'
};

type SpecListData = {
    status: string;
    data: Array<Spec>;
};

type FlowData = {
    status: string;
    data: Array<tFlow>;
};

type Spec = {
    id: number;
    speciality_id: number;
    name: string;
};

type tFlow = {
    flow_id: number;
    speciality_id: number;
    start_date: Date;
    start_time: string;
    end_time: string;
    lesson_length: number;
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
};

interface Props { }

interface State {
    flows: Array<tFlow>;
    flow_id: number;
    speciality_id: number;
    start_date: Date;
    start_time: string;
    end_time: string;
    lesson_length: number;
    lesson_date: Date;
    newLesson_date: Date;
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;

    specs: Array<Spec>;
    id: number;
    spec_id: number;
    specName: string;

    selected: boolean;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class Flow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            flows: [],
            flow_id: 0,
            speciality_id: 0,
            start_date: new Date(),
            start_time: "",
            end_time: "",
            lesson_length: 0,
            lesson_date: new Date(),
            newLesson_date: new Date(),
            sun: "",
            mon: "",
            tue: "",
            wed: "",
            thu: "",
            fri: "",
            sat: "",

            specs: [],
            id: 0,
            spec_id: 0,
            specName: "",
            selected: false
        };
    }

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/courses/flowList')
            .then(res => res.json())
            .then((jsonRes: FlowData) => {
                this.setState({
                    flows: jsonRes.data
                });
                sortTable("myTable");

                dataArr = jsonRes.data;
                for (var i = 0; i < jsonRes.data.length; i++) {
                    if (jsonRes.data[i].sun === "1") {
                        document.getElementById("sun" + this.state.flows[i].flow_id.toString())!.innerHTML = "Sun"
                    }
                    if (jsonRes.data[i].mon === "1") {
                        document.getElementById("mon" + this.state.flows[i].flow_id.toString())!.innerHTML = "Mon"
                    }
                    if (jsonRes.data[i].tue === "1") {
                        document.getElementById("tue" + this.state.flows[i].flow_id.toString())!.innerHTML = "Tue"
                    }
                    if (jsonRes.data[i].wed === "1") {
                        document.getElementById("wed" + this.state.flows[i].flow_id.toString())!.innerHTML = "Wed"
                    }
                    if (jsonRes.data[i].thu === "1") {
                        document.getElementById("thu" + this.state.flows[i].flow_id.toString())!.innerHTML = "Thu"
                    }
                    if (jsonRes.data[i].fri === "1") {
                        document.getElementById("fri" + this.state.flows[i].flow_id.toString())!.innerHTML = "Fri"
                    }
                    if (jsonRes.data[i].sat === "1") {
                        document.getElementById("sat" + this.state.flows[i].flow_id.toString())!.innerHTML = "Sat"
                    }
                }

            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/specialities/specList')
            .then(res => res.json())
            .then((jsonRes: SpecListData) => {
                this.setState({
                    specs: jsonRes.data
                });

                specNameArr = jsonRes.data;

                for (var i = 0; i < dataArr.length; i++) {
                    var specNameM = document.getElementById("specNameM" + dataArr[i].flow_id.toString());
                    for (var j = 0; j < specNameArr.length; j++) {
                        if (+specNameM!.innerHTML === specNameArr[j].speciality_id) {
                            specNameM!.innerHTML = specNameArr[j].name;
                            j = specNameArr.length;
                        }
                    }
                }
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
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
        this.refreshList();
    };

    handleFlowIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            flow_id: e.target.value
        })
    };

    handleSpecChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            speciality_id: e.target.value
        })
    };

    handleStartDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            start_date: e.target.value
        })
    };

    handleStartTimeChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            start_time: e.target.value
        })
    };

    handleEndTimeChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            end_time: e.target.value
        })
    };

    handleLessonDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            lesson_date: e.target.value
        })
    };

    handleNewLessonDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            newLesson_date: e.target.value
        })
    };

    handleSunChange = (e: React.ChangeEvent<any>) => {
        if (this.state.sun === "1") {
            this.setState({
                sun: ""
            })
        }
        else {
            this.setState({
                sun: "1"
            })
        }
    };
    handleMonChange = (e: React.ChangeEvent<any>) => {
        if (this.state.mon === "1") {
            this.setState({
                mon: ""
            })
        }
        else {
            this.setState({
                mon: "1"
            })
        }
    };
    handleTueChange = (e: React.ChangeEvent<any>) => {
        if (this.state.tue === "1") {
            this.setState({
                tue: ""
            })
        }
        else {
            this.setState({
                tue: "1"
            })
        }
    };
    handleWedChange = (e: React.ChangeEvent<any>) => {
        if (this.state.wed === "1") {
            this.setState({
                wed: ""
            })
        }
        else {
            this.setState({
                wed: "1"
            })
        }
    };
    handleThuChange = (e: React.ChangeEvent<any>) => {
        if (this.state.thu === "1") {
            this.setState({
                thu: ""
            })
        }
        else {
            this.setState({
                thu: "1"
            })
        }
    };
    handleFriChange = (e: React.ChangeEvent<any>) => {
        if (this.state.fri === "1") {
            this.setState({
                fri: ""
            })
        }
        else {
            this.setState({
                fri: "1"
            })
        }
    };
    handleSatChange = (e: React.ChangeEvent<any>) => {
        if (this.state.sat === "1") {
            this.setState({
                sat: ""
            })
        }
        else {
            this.setState({
                sat: "1"
            })
        }
    };

    handleSpecSpecIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            spec_id: e.target.value
        })
    };

    switchSpecName = () => {
        if (specSwitch === 0) {
            for (var i = 0; i < dataArr.length; i++) {
                var specName = document.getElementById("specName" + dataArr[i].flow_id.toString());
                for (var j = 0; j < specNameArr.length; j++) {
                    if (+specName!.innerHTML === specNameArr[j].speciality_id) {
                        specName!.innerHTML = specNameArr[j].name;
                        j = specNameArr.length;
                    }
                }
            }
            specSwitch = 1;
            return;
        }
        if (specSwitch === 1) {
            for (i = 0; i < dataArr.length; i++) {
                specName = document.getElementById("specName" + dataArr[i].flow_id.toString());
                for (j = 0; j < specNameArr.length; j++) {
                    if (specName!.innerHTML === specNameArr[j].name) {
                        specName!.innerHTML = specNameArr[j].speciality_id;
                        j = specNameArr.length;
                    }
                }
            }
        }
        specSwitch = 0;
        return;
    }

    createSchedule = () => {
        if (localStorage.getItem("userRole") !== "admin") {
            alert("This is a demo version. You do not have permission to create a schedule.");
            return;
        }
        if (this.state.flow_id <= 0 || this.state.spec_id <= 0 ||
            this.state.start_date === null ||
            this.state.start_time === "" ||
            this.state.end_time === "" ||
            this.state.lesson_length === 0 || (
                this.state.sun === "" &&
                this.state.mon === "" &&
                this.state.tue === "" &&
                this.state.wed === "" &&
                this.state.thu === "" &&
                this.state.fri === "" &&
                this.state.sat === ""
            )) {
            return alert("Please, select flow.");
        }

        var coursesArr: string | any[] = [];
        var classHours = this.state.lesson_length;
        var numberOfClasses = 0;
        var flowDays: string | any[] = [];

        var schedDates: any[] = [];
        var newDate: any;
        var firstTime = 0;
        var tmpId = 0;
        var tmpSecId = 0;

        var startDate = this.state.start_date.toString().substr(0, 10).replace(/-/g, ",");

        if (this.state.sun === "1") {
            flowDays.push(0)
        }
        if (this.state.mon === "1") {
            flowDays.push(1)
        }
        if (this.state.tue === "1") {
            flowDays.push(2)
        }
        if (this.state.wed === "1") {
            flowDays.push(3)
        }
        if (this.state.thu === "1") {
            flowDays.push(4)
        }
        if (this.state.fri === "1") {
            flowDays.push(5)
        }
        if (this.state.sat === "1") {
            flowDays.push(6)
        }


        fetch('https://casul-campus.herokuapp.com/specialities/findSpecCoursesForFlow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: this.state.flow_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to create a schedule.");
                    return;
                }
                res.json()
                    .then((jsonRes) => {

                        if (jsonRes.data) {
                            coursesArr = jsonRes.data;

                            for (var i = 0; i < coursesArr.length; i++) {
                                lecturerArr.push(coursesArr[i].lecturer_id)
                            }
                            if (coursesArr.length === 0) {
                                alert("No courses assigned to this speciality.")
                                return;
                            }
                            checkSchedule();
                        } else {
                            alert('Session expired. Logout and login again.')
                        }
                    })
            })
            .catch(error => console.log(error));

        const checkSchedule = () => {

            fetch('https://casul-campus.herokuapp.com/courses/checkSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    lecturerArr: lecturerArr,
                    rid: rid
                })
            })
                .then(res => {
                    if (res.status === 403) {
                        alert("This is a demo version. You do not have permission to create a schedule.");
                        return;
                    }
                    res.json()
                        .then((jsonRes) => {
                            if (jsonRes.data) {
                                lecturerSched = jsonRes.data;
                            } else {
                                alert('Session expired. Logout and login again.')
                                return;
                            }
                        })
                })
                .catch(error => console.log(error));
        }


        fetch('https://casul-campus.herokuapp.com/courses/findHoliday', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                firstDay: startDate
            })
        })
            .then(res => res.json())
            .then((holidays) => {
                if (holidays.data) {
                    holidayDates = holidays.data;
                    prepSched();
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));

        const reviseSched = () => {
            var holidayCounter = 0;
            for (var i = 0; i < holidayDates.length; i++) {
                for (var j = 0; j < schedDates.length; j++) {
                    if (schedDates[j].date.substr(0, 10) === holidayDates[i].date.substr(0, 10)) {
                        tmpId = schedDates[j].course_id;
                        tmpSecId = schedDates[j].section_id;
                        schedDates.splice(j, 1)
                        holidayCounter++;
                    }
                }
            }
            if (holidayCounter === 0) {
            } else {
                for (var k = 0; k < holidayCounter; k++) {
                    var resDay = schedDates[schedDates.length - 1].date;
                    var cancel = 0;

                    for (var x = 1; x < 365; x++) {
                        if (new Date(resDay).getDay() + x > 6) {
                            for (var y = 0; y < flowDays.length; y++) {
                                if (new Date(resDay).getDay() + x - 7 === flowDays[y]) {
                                    newDate = new Date(resDay);
                                    newDate.setDate(newDate.getDate() + x);
                                    newDate.setHours(0, 0, 0, 0);
                                    newDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString()

                                    for (var z = 0; z < holidayDates.length; z++) {

                                        if (newDate.substr(0, 10) === holidayDates[z].date.substr(0, 10)) {
                                            cancel = 1;
                                            z = holidayDates.length
                                        }
                                    }
                                    if (cancel === 0) {
                                        schedDates.push({
                                            course_id: tmpId,
                                            section_id: tmpSecId,
                                            date: newDate
                                        });
                                        x = 365;
                                        y = flowDays.length;
                                    }
                                    cancel = 0;
                                }
                            }
                        } else {
                            for (y = 0; y < flowDays.length; y++) {
                                if (new Date(resDay).getDay() + x === flowDays[y]) {
                                    newDate = new Date(resDay);
                                    newDate.setDate(newDate.getDate() + x);
                                    newDate.setHours(0, 0, 0, 0);
                                    newDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString()

                                    for (z = 0; z < holidayDates.length; z++) {

                                        if (newDate.substr(0, 10) === holidayDates[z].date.substr(0, 10)) {
                                            cancel = 1;
                                            z = holidayDates.length
                                        }
                                    }
                                    if (cancel === 0) {
                                        schedDates.push({
                                            course_id: tmpId,
                                            section_id: tmpSecId,
                                            date: newDate
                                        });
                                        x = 365;
                                        y = flowDays.length;
                                    }
                                    cancel = 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        const prepSched = () => {

            for (var i = 0; i < coursesArr.length; i++) {
                var schedArrLength = 0;

                numberOfClasses = Math.ceil(coursesArr[i].hours / classHours);
                for (var j = 0; j < Math.ceil(numberOfClasses / flowDays.length); j++) {
                    if (firstTime === 0) {
                        for (var x = 0; x < 7; x++) {
                            if (new Date(startDate).getDay() + x > 6) {
                                for (var k = 0; k < flowDays.length; k++) {
                                    if (new Date(startDate).getDay() + x - 7 === flowDays[k]) {
                                        newDate = new Date(startDate);
                                        newDate.setDate(newDate.getDate() + x);
                                        newDate.setHours(0, 0, 0, 0);
                                        if (schedArrLength < numberOfClasses) {
                                            schedDates.push({
                                                course_id: coursesArr[i].course_id,
                                                section_id: coursesArr[i].section_id,
                                                date: new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString()
                                            });
                                            k = flowDays.length;
                                            schedArrLength++;
                                        }
                                    }
                                }
                            }
                            for (var k = 0; k < flowDays.length; k++) {
                                if (new Date(startDate).getDay() + x === flowDays[k]) {
                                    newDate = new Date(startDate);
                                    newDate.setDate(newDate.getDate() + x);
                                    newDate.setHours(0, 0, 0, 0);
                                    if (schedArrLength < numberOfClasses) {
                                        schedDates.push({
                                            course_id: coursesArr[i].course_id,
                                            section_id: coursesArr[i].section_id,
                                            date: new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString()
                                        });
                                        k = flowDays.length;
                                        schedArrLength++;
                                    }
                                }
                            }
                        }
                        firstTime = 1
                    }

                    for (var y = 0; y < flowDays.length; y++) {
                        var days = 7;
                        var classDate = new Date(schedDates[schedDates.length - (flowDays.length)].date);
                        classDate.setDate(classDate.getDate() + days)
                        classDate.setHours(0, 0, 0, 0);

                        if (schedArrLength < numberOfClasses) {
                            schedDates.push({
                                course_id: coursesArr[i].course_id,
                                section_id: coursesArr[i].section_id,
                                date: new Date(classDate.getTime() - (classDate.getTimezoneOffset() * 60000)).toISOString()
                            });
                            schedArrLength++;
                        }
                    }
                }
                reviseSched();
            }
            requestFunc();
        }
        const requestFunc = () => {
            if (lecturerSched.length === 0) {
                this.createSchedule();
                return;
            }
            for (var i = 0; i < lecturerSched.length; i++) {
                for (var k = 0; k < lecturerSched[i].length; k++) {
                    for (var j = 0; j < schedDates.length; j++) {
                        if (
                            // lecturerSched[i][k].flow_id === this.state.flow_id &&
                            // lecturerSched[i][k].course_id === schedDates[j].course_id &&
                            lecturerSched[i][k].date === schedDates[j].date) {
                            var schedStart = lecturerSched[i][k].start_time
                            var schedEnd = lecturerSched[i][k].end_time
                            var schedStartMin = (+schedStart.substr(0, 2) * 60) + (schedStart.substr(3, 2))
                            var schedEndMin = (+schedEnd.substr(0, 2) * 60) + (schedEnd.substr(3, 2))
                            var thisStart = (+this.state.start_time.substr(0, 2) * 60) + (this.state.start_time.substr(3, 2))
                            var thisEnd = (+this.state.end_time.substr(0, 2) * 60) + (this.state.end_time.substr(3, 2))
                            if (schedStartMin >= thisStart && schedStartMin <= thisEnd
                                || schedEndMin <= thisEnd && schedEndMin >= thisStart
                                || schedStartMin <= thisStart && schedEndMin >= thisStart
                                || schedStartMin >= thisStart && schedEndMin <= thisEnd) {
                                alert("Conflict in schedule for lecturer id " + lecturerSched[i][k].lecturer_id + " " + lecturerSched[i][k].first_name +
                                    " " + lecturerSched[i][k].last_name + " on date " + lecturerSched[i][k].date.substr(0, 10) + " between " + schedStart + " and " + schedEnd + ".");
                                return;
                            }
                        }
                    }
                }
            }
            if (schedDates.length === 0) {
                alert("No lessons in schedule");
                return;
            }
            // var request = "";
            // 20 is the number I chose for dates per request
            // for (var reqNumber = 0; reqNumber < Math.ceil(schedDates.length / 20); reqNumber++) {
            //     for (var m = 0 + (reqNumber * 20); m < 20 + 20 * reqNumber; m++) {
            //         if (m < schedDates.length) {

            //             request += "insert ignore into `time_table` (course_id, date, flow_id) values (" + schedDates[m].course_id + ", " + schedDates[m].date.toString().substr(0, 10).replace(/-/g, '') + ", " + this.state.flow_id + "); "

            //         }
            //     } console.log(request)


            fetch('https://casul-campus.herokuapp.com/courses/addFlowSched', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },
                body: JSON.stringify({
                    array: schedDates,
                    flow_id: this.state.flow_id,
                    rid: rid
                })
            })
                .then(res => {
                    if (res.status === 401) {
                        alert("Session expired. Logout and login again.")
                    }
                    if (res.status === 403) {
                        alert("This is a demo version. You do not have permission to create a schedule.")
                    }
                    if (res.ok) {
                        // request = "";

                        // if ( reqNumber === (Math.ceil(schedDates.length / 20)) ) {
                        //     alert("Schedule created successfully.")
                        this.clearForm();
                        this.clearFlowSchedForm();
                        this.refreshList();
                        alert("Schedule created successfully!")

                    }
                })
                .catch(error => console.log(error));
        }
    }

    viewSchedule = () => {
        if (this.state.flow_id === 0) {
            alert("Please, select a flow.")
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/findHoliday', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                firstDay: this.state.start_date
                // SELECT * FROM uni_db.calendar where date > start_date
            })
        })
            .then(res => res.json())
            .then((holidays) => {


                if (holidays.data) {
                    holidayDates = holidays.data;

                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));


        fetch('https://casul-campus.herokuapp.com/courses/viewFlowSched', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                start_date: this.state.start_date,
                flow_id: this.state.flow_id

                // select * from time_table where date > start_date and flow_id = this.state.flow_id
            })
        })
            .then(res => res.json())
            .then((schedDates) => {


                if (schedDates.data) {
                    schedDatesArr = schedDates.data;
                    this.refreshList();
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    }

    addNewFlow = () => {

        for (var i = 0; i < dataArr.length; i++) {
            if (+this.state.flow_id === dataArr[i].flow_id) {
                alert("Flow ID already exists. Please, choose another flow ID.");
                return;
            }
        }

        if (this.state.flow_id <= 0 || this.state.spec_id <= 0 ||
            this.state.start_time === "" ||
            this.state.end_time === "" ||
            this.state.start_date === null || (
                this.state.sun === "" &&
                this.state.mon === "" &&
                this.state.tue === "" &&
                this.state.wed === "" &&
                this.state.thu === "" &&
                this.state.fri === "" &&
                this.state.sat === ""
            )) {
            alert("all fields must be completed");
            return;
        }

        var startHour = +(this.state.start_time.substr(0, 2))
        var start_am_pm = this.state.start_time.substr(9, 2)
        if (start_am_pm === "PM") { startHour += 12 }
        var startMin = +(this.state.start_time.substr(3, 2)) / 60
        var startTime = startHour + startMin

        var endHour = +(this.state.end_time.substr(0, 2))
        var end_am_pm = this.state.end_time.substr(9, 2)
        if (end_am_pm === "PM") { endHour += 12 }
        var endMin = +(this.state.end_time.substr(3, 2)) / 60
        var endTime = endHour + endMin

        var lessonLength = endTime - startTime

        fetch('https://casul-campus.herokuapp.com/courses/addFlow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: this.state.flow_id,
                speciality_id: this.state.spec_id,
                start_date: this.state.start_date,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
                lesson_length: lessonLength,
                sun: this.state.sun,
                mon: this.state.mon,
                tue: this.state.tue,
                wed: this.state.wed,
                thu: this.state.thu,
                fri: this.state.fri,
                sat: this.state.sat,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add a flow.")
                }
                if (res.ok) {
                    this.clearForm();
                    this.clearFlowSchedForm();
                    this.refreshList();
                    alert("Flow added successfully.")
                }
            })
            .catch(error => console.log(error));
    };

    deleteFlow = () => {
        if (this.state.flow_id === 0) {
            alert("Please, select a flow.")
            return;
        }
        fetch('https://casul-campus.herokuapp.com/courses/deleteFlow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: this.state.flow_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete a flow.")
                }
                if (res.ok) {
                    this.clearForm();
                    this.clearFlowSchedForm();
                    this.refreshList();
                    alert("Flow deleted.")
                }
            })
            .catch(error => console.log(error));
    };

    deleteSchedule = () => {
        if (this.state.flow_id === 0) {
            alert("Please, select a flow.")
            return;
        }
        fetch('https://casul-campus.herokuapp.com/courses/deleteSchedule', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: this.state.flow_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete a schedule.")
                }
                if (res.ok) {
                    this.clearForm();
                    this.clearFlowSchedForm();
                    alert("Schedule deleted.")
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        this.setState({
            flow_id: 0,
            speciality_id: 0,
            start_date: new Date(),
            start_time: "",
            end_time: "",
            lesson_length: 0,
            sun: "",
            mon: "",
            tue: "",
            wed: "",
            thu: "",
            fri: "",
            sat: "",
            selected: false
        });
        const sunCheck = document.getElementById("sunCheck") as HTMLInputElement;
        const monCheck = document.getElementById("monCheck") as HTMLInputElement;
        const tueCheck = document.getElementById("tueCheck") as HTMLInputElement;
        const wedCheck = document.getElementById("wedCheck") as HTMLInputElement;
        const thuCheck = document.getElementById("thuCheck") as HTMLInputElement;
        const friCheck = document.getElementById("friCheck") as HTMLInputElement;
        const satCheck = document.getElementById("satCheck") as HTMLInputElement;
        const dateField = document.getElementById("dateField") as HTMLInputElement;
        const SpecSelect = document.getElementById("specSelect") as HTMLSelectElement;
        const startTimeSelect = document.getElementById("startTimeField") as HTMLSelectElement;
        const endTimeSelect = document.getElementById("endTimeField") as HTMLSelectElement;
        sunCheck!.checked = false;
        monCheck!.checked = false;
        tueCheck!.checked = false;
        wedCheck!.checked = false;
        thuCheck!.checked = false;
        friCheck!.checked = false;
        satCheck!.checked = false;

        dateField!.value = "";
        SpecSelect.value = "select speciality"
        startTimeSelect.value = ""
        endTimeSelect.value = ""

        for (var i = 0; i < dataArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + dataArr[i].flow_id.toString()) as HTMLInputElement;
            radioSelect!.checked = false;
        }
        for (var i = 0; i < dataArr.length; i++) {
            var radioSelectM = document.getElementById("radioSelectM" + dataArr[i].flow_id.toString()) as HTMLInputElement;
            radioSelectM!.checked = false;
        }

    };

    clearFlowSchedForm = () => {
        this.setState({
            id: 0,
            lesson_date: new Date(),
            selected: false
        });

        const lessonDateField = document.getElementById("lessonDateField") as HTMLInputElement;
        lessonDateField!.value = "";

        const newLessonDateField = document.getElementById("newLessonDateField") as HTMLInputElement;
        newLessonDateField!.value = "";

        const lessonDateFieldM = document.getElementById("lessonDateFieldM") as HTMLInputElement;
        lessonDateFieldM!.value = "";

        const newLessonDateFieldM = document.getElementById("newLessonDateFieldM") as HTMLInputElement;
        newLessonDateFieldM!.value = "";

        for (var i = 0; i < schedDatesArr.length; i++) {
            var schedRadioSelect = document.getElementById("radioSelect" + schedDatesArr[i].id.toString()) as HTMLInputElement;
            schedRadioSelect!.checked = false;
        }
        for (var i = 0; i < schedDatesArr.length; i++) {
            var schedRadioSelectM = document.getElementById("radioSelectM" + schedDatesArr[i].id.toString()) as HTMLInputElement;
            schedRadioSelectM!.checked = false;
        }
    }

    updateFlowSched = () => {
        var myLessonDate = this.state.start_date.toString().substr(0, 10)
        var myNewLessonDate = this.state.newLesson_date

        if (this.state.id === 0 || !this.state.id) {
            alert("select lesson to update");
            return
        }
        if (!this.state.lesson_date) {
            alert("select lesson to update");
            return
        }
        if (this.state.newLesson_date.toString().length > 10) {
            alert("enter new date");
            return
        }
        if (this.state.newLesson_date.toString().length < 10) {
            alert("enter valid new date");
            return
        }

        fetch('https://casul-campus.herokuapp.com/courses/updateFlowSched', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                id: this.state.id,
                lesson_date: this.state.lesson_date,
                newLesson_date: this.state.newLesson_date,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update a schedule.")
                }
                if (res.ok) {
                    this.refreshList();
                    var updatedLesson = document.getElementById("lessonDate" + this.state.id.toString())
                    updatedLesson!.innerHTML = this.state.newLesson_date.toString();
                    alert("lesson date updated successfully!")
                }
            })
            .catch(error => console.log(error));
    };


    updateFlow = () => {
        if (this.state.flow_id <= 0 || this.state.spec_id <= 0 ||
            this.state.start_date === null ||
            this.state.start_time === "" ||
            this.state.end_time === "" ||
            this.state.lesson_length === 0 || (
                this.state.sun === "" &&
                this.state.mon === "" &&
                this.state.tue === "" &&
                this.state.wed === "" &&
                this.state.thu === "" &&
                this.state.fri === "" &&
                this.state.sat === ""
            )) {
            return alert("Please, select flow.");
        }
        var myDate = this.state.start_date.toString().substr(0, 10);
        var parts = myDate.split('-');

        var startHour = +(this.state.start_time.substr(0, 2))
        var start_am_pm = this.state.start_time.substr(9, 2)
        if (start_am_pm === "PM") { startHour += 12 }
        var startMin = +(this.state.start_time.substr(3, 2)) / 60
        var startTime = startHour + startMin

        var endHour = +(this.state.end_time.substr(0, 2))
        var end_am_pm = this.state.end_time.substr(9, 2)
        if (end_am_pm === "PM") { endHour += 12 }
        var endMin = +(this.state.end_time.substr(3, 2)) / 60
        var endTime = endHour + endMin

        var lessonLength = endTime - startTime



        fetch('https://casul-campus.herokuapp.com/courses/updateFlow', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                flow_id: this.state.flow_id,
                speciality_id: this.state.spec_id,
                start_date: myDate,
                start_time: this.state.start_time,
                end_time: this.state.end_time,
                lesson_length: lessonLength,
                sun: this.state.sun,
                mon: this.state.mon,
                tue: this.state.tue,
                wed: this.state.wed,
                thu: this.state.thu,
                fri: this.state.fri,
                sat: this.state.sat,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update a flow.")
                }
                if (res.ok) {
                    this.clearForm();
                    this.clearFlowSchedForm();
                    this.refreshList();
                    alert("flow updated successfully!")
                }
            })
            .catch(error => console.log(error));
    };

    showFlow = (flow: tFlow) => {
        this.setState({
            flow_id: flow.flow_id,
            speciality_id: flow.speciality_id,
            start_date: flow.start_date,
            start_time: flow.start_time,
            end_time: flow.end_time,
            lesson_length: flow.lesson_length,
            sun: flow.sun,
            mon: flow.mon,
            tue: flow.tue,
            wed: flow.wed,
            thu: flow.thu,
            fri: flow.fri,
            sat: flow.sat,
            flows: this.state.flows
        });
        const sunCheck = document.getElementById("sunCheck") as HTMLInputElement;
        const monCheck = document.getElementById("monCheck") as HTMLInputElement;
        const tueCheck = document.getElementById("tueCheck") as HTMLInputElement;
        const wedCheck = document.getElementById("wedCheck") as HTMLInputElement;
        const thuCheck = document.getElementById("thuCheck") as HTMLInputElement;
        const friCheck = document.getElementById("friCheck") as HTMLInputElement;
        const satCheck = document.getElementById("satCheck") as HTMLInputElement;
        const dateField = document.getElementById("dateField") as HTMLInputElement;
        const SpecSelect = document.getElementById("specSelect") as HTMLSelectElement;
        const startTimeSelect = document.getElementById("startTimeField") as HTMLSelectElement;
        const endTimeSelect = document.getElementById("endTimeField") as HTMLSelectElement;

        if (document.getElementById("sun" + flow.flow_id.toString())!.innerHTML === "") {
            sunCheck!.checked = false;
        } else {
            sunCheck!.checked = true;
        }
        if (document.getElementById("mon" + flow.flow_id.toString())!.innerHTML === "") {
            monCheck!.checked = false;
        } else {
            monCheck!.checked = true;
        }
        if (document.getElementById("tue" + flow.flow_id.toString())!.innerHTML === "") {
            tueCheck!.checked = false;
        } else {
            tueCheck!.checked = true;
        }
        if (document.getElementById("wed" + flow.flow_id.toString())!.innerHTML === "") {
            wedCheck!.checked = false;
        } else {
            wedCheck!.checked = true;
        }
        if (document.getElementById("thu" + flow.flow_id.toString())!.innerHTML === "") {
            thuCheck!.checked = false;
        } else {
            thuCheck!.checked = true;
        }
        if (document.getElementById("fri" + flow.flow_id.toString())!.innerHTML === "") {
            friCheck!.checked = false;
        } else {
            friCheck!.checked = true;
        }
        if (document.getElementById("sat" + flow.flow_id.toString())!.innerHTML === "") {
            satCheck!.checked = false;
        } else {
            satCheck!.checked = true;
        }
        dateField.valueAsDate = new Date(flow.start_date.toString());
        startTimeSelect.value = flow.start_time;
        endTimeSelect.value = flow.end_time;


        SpecSelect.value = flow.speciality_id.toString();
        this.setState({
            spec_id: flow.speciality_id
        })
    };

    showFlowSched = (course: any) => {
        this.setState({
            id: course.id,
            lesson_date: course.date,
        });
        const lessonDateField = document.getElementById("lessonDateField") as HTMLInputElement;

        lessonDateField.valueAsDate = new Date(course.date.toString());

        const lessonDateFieldM = document.getElementById("lessonDateFieldM") as HTMLInputElement;

        lessonDateFieldM.valueAsDate = new Date(course.date.toString());
    };

    render() {
        var flowNumber = "";
        if (this.state.flow_id > 0) {
            flowNumber = this.state.flow_id.toString();
        }
        var ln = 1;
        var lessNum = 1;
        var lessNumMobile = 1;
        return (
            <div>

                <AdminNav />
                <br />
                <br />
                <div className="card card-body bg-white w-100" >
                    <div className="row">

                        <div className="col-sm-3">
                            <div className="card-body bg-light m-1" style={{ padding: "4%" }}>
                                <h4 className="App">Flow Form</h4>
                                <form id="flow">
                                    <div className="form-group">
                                        <label htmlFor="flow_id">Flow ID</label>
                                        <input type="number"
                                            id="flow_id"
                                            className="form-control"
                                            placeholder="enter flow id"
                                            value={(this.state.flow_id === 0 ? "" : this.state.flow_id)}
                                            onChange={this.handleFlowIdChange} />
                                    </div>
                                    <div className="form-group">
                                        <select id="specSelect" onChange={this.handleSpecSpecIdChange} className="custom-select custom-select-lg mb-3">
                                            <option>select speciality</option>
                                            {this.state.specs.map(spec =>
                                                <option id='specOption' key={spec.id} value={spec.speciality_id}>
                                                    {spec.name}
                                                </option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input type="date"
                                            id="dateField"
                                            className="form-control"
                                            placeholder="enter lecturer id"
                                            onChange={this.handleStartDateChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="startTime">Start Time</label>
                                        <input type="time"
                                            id="startTimeField"
                                            className="form-control"
                                            placeholder="lesson starts at..."
                                            value={this.state.start_time}
                                            onChange={this.handleStartTimeChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endTime">End Time</label>
                                        <input type="time"
                                            id="endTimeField"
                                            className="form-control"
                                            placeholder="lesson ends at..."
                                            value={this.state.end_time}
                                            onChange={this.handleEndTimeChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="classDays">Class Days</label>
                                        <table><thead><tr><td style={{ textAlign: "center", padding: "2px" }}>Sun </td>
                                            <td style={{ textAlign: "center", padding: "2px" }} >Mon </td>
                                            <td style={{ textAlign: "center", padding: "2px" }}>Tue </td>
                                            <td style={{ textAlign: "center", padding: "2px" }}>Wed </td>
                                            <td style={{ textAlign: "center", padding: "2px" }}>Thu </td>
                                            <td style={{ textAlign: "center", padding: "2px" }}>Fri </td>
                                            <td style={{ textAlign: "center", padding: "4px" }}>Sat</td>
                                        </tr>
                                            <tr>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="sunCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleSunChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="monCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleMonChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="tueCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleTueChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="wedCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleWedChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="thuCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleThuChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="friCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleFriChange} /></td>
                                                <td style={{ textAlign: "center", verticalAlign: "middle" }}><input type="checkbox"
                                                    id="satCheck"
                                                    placeholder="enter file"
                                                    onChange={this.handleSatChange} /></td>
                                            </tr></thead></table>
                                    </div>
                                    <button type="button"
                                        className="btn btn-outline-primary mr-3"
                                        onClick={this.clearForm} style={{ marginTop: "-10px", height: "30px" }}>clear form</button>
                                </form>
                            </div>
                        </div>

                        <div className="col-sm-9">
                            <div className="full-text">
                                <div className="card-body bg-light m-1">
                                    <h4 className="App">Flow Table</h4>
                                    <h6 className="App">click 'speciality' header to view speciality name</h6>
                                    <div style={wrapperStyles}>
                                        <Paper className="flows">
                                            <Table id="myTable">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="flows" colSpan={2}>Flow ID{" "}<span>
                                                            <i className="fa fa-sort"
                                                                onClick={() => sortTableNewNumber(1, "myTable")}></i></span>
                                                        </TableCell>
                                                        <TableCell className="flows"><span onClick={() => this.switchSpecName()}>Speciality{" "}</span>
                                                            <span><i className="fa fa-sort"
                                                                onClick={() => sortTableNew(2, "myTable")}></i></span>
                                                        </TableCell>
                                                        <TableCell className="flows">Start Date{" "}<span>
                                                            <i className="fa fa-sort"
                                                                onClick={() => sortTableNew(3, "myTable")}></i></span>
                                                        </TableCell>
                                                        <TableCell className="flows" colSpan={7}>Class Days </TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.flows.map(flow => (
                                                        <TableRow key={flow.flow_id}>
                                                            <TableCell><input id={"radioSelect" + flow.flow_id.toString()} type="radio" name="selected" onChange={(e) => this.showFlow(flow)} /></TableCell>
                                                            <TableCell >
                                                                {flow.flow_id}</TableCell>
                                                            <TableCell id={"specName" + flow.flow_id.toString()}>{flow.speciality_id}</TableCell>
                                                            <TableCell>{flow.start_date.toString().substr(0, 10)}</TableCell>
                                                            <TableCell id={"sun" + flow.flow_id.toString()}>{flow.sun}</TableCell>
                                                            <TableCell id={"mon" + flow.flow_id.toString()}>{flow.mon}</TableCell>
                                                            <TableCell id={"tue" + flow.flow_id.toString()}>{flow.tue}</TableCell>
                                                            <TableCell id={"wed" + flow.flow_id.toString()}>{flow.wed}</TableCell>
                                                            <TableCell id={"thu" + flow.flow_id.toString()}>{flow.thu}</TableCell>
                                                            <TableCell id={"fri" + flow.flow_id.toString()}>{flow.fri}</TableCell>
                                                            <TableCell id={"sat" + flow.flow_id.toString()}>{flow.sat}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </div>
                                    <div className="full-text" style={{ textAlign: 'center' }}>
                                        <button onClick={this.addNewFlow}
                                            type="button"
                                            className="btn btn-outline-primary m-3" >add flow</button>
                                        <button type="button"
                                            className="btn btn-outline-primary m-3"
                                            onClick={this.updateFlow}>update flow</button>
                                        <button onClick={(e) => this.deleteFlow(/*task.student_id*/)}
                                            type="button"
                                            className="btn btn-outline-danger m-3" >delete flow</button>
                                        <button type="button"
                                            className="btn btn-outline-primary m-3"
                                            onClick={this.createSchedule}>create schedule</button>
                                        <button type="button"
                                            className="btn btn-outline-danger m-3"
                                            onClick={this.deleteSchedule} >delete schedule</button>
                                        <button type="button"
                                            className="btn btn-outline-primary m-3"
                                            onClick={this.viewSchedule}
                                            data-toggle={(this.state.flow_id === 0 ? "" : "modal")}
                                            data-target={(this.state.flow_id === 0 ? "" : ".bd-example-modal-xl")}>view schedule</button>
                                    </div>

                                </div>
                            </div>
                            <div className="short-text">
                                <div className="card card-body bg-white w-100">

                                    <h4 className="App">Flow Table</h4>
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                        <table className="flowTable">
                                            <thead className="flowTable">
                                                <tr className="flowTable">
                                                    <th className="flowTable">Flow ID</th>
                                                    <th className="flowTable">Speciality ID</th>
                                                    <th className="flowTable">Speciality</th>
                                                    <th className="flowTable">Start Date</th>
                                                    <th className="flowTable">Days</th>
                                                </tr>
                                            </thead>
                                            <tbody className="flowTable">
                                                {this.state.flows.map(flow => (
                                                    <tr className="flowTable" key={flow.flow_id}>
                                                        <td className="flowTable" >
                                                            <input id={"radioSelectM" + flow.flow_id.toString()} type="radio" name="selected" onChange={(e) => this.showFlow(flow)} /> </td>
                                                        <td className="flowTable"> {flow.flow_id}</td>
                                                        <td className="flowTable"> {flow.speciality_id}</td>
                                                        <td className="flowTable" id={"specNameM" + flow.flow_id.toString()}>{flow.speciality_id}</td>
                                                        <td className="flowTable">{flow.start_date.toString().substr(0, 10)}</td>
                                                        <td className="flowTable">{(flow.sun === "1" ? "Sun" : "")} {(flow.mon === "1" ? "Mon" : "")} {(flow.tue === "1" ? "Tue" : "")} {(flow.wed === "1" ? "Wed" : "")} {(flow.thu === "1" ? "Thu" : "")} {(flow.fri === "1" ? "Fri" : "")} {(flow.sat === "1" ? "Sat" : "")}</td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>

                                </div>
                                <div className="short-text" style={{ textAlign: 'center' }}>
                                    <button onClick={this.addNewFlow}
                                        type="button"
                                        className="btn btn-outline-primary btn-sm m-1" >add flow</button>
                                    <button type="button"
                                        className="btn btn-outline-primary btn-sm m-1"
                                        onClick={this.updateFlow}>update flow</button>
                                    <button onClick={(e) => this.deleteFlow()}
                                        type="button"
                                        className="btn btn-outline-danger btn-sm m-1" >delete flow</button>
                                    <button type="button"
                                        className="btn btn-outline-primary btn-sm m-1"
                                        onClick={this.createSchedule}>create schedule</button>
                                    <button type="button"
                                        className="btn btn-outline-primary btn-sm m-2"
                                        onClick={this.viewSchedule}
                                        data-toggle={(this.state.flow_id === 0 ? "" : "modal")}
                                        data-target={(this.state.flow_id === 0 ? "" : ".bd-example-modal-xl")}>view schedule</button>
                                    <button type="button"
                                        className="btn btn-outline-danger btn-sm m-1"
                                        onClick={this.deleteSchedule} >delete schedule</button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade bd-example-modal-xl" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-full" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="full-text">
                                    <div className="card card-body bg-white w-100">
                                        <div className="row no-gutters">
                                            <div className="col-sm-3">
                                                <div className="card-body bg-light m-4">
                                                    <h4 className="App">Flow Schedule Update Form</h4>
                                                    <form id="flowSchedUp">
                                                        <div className="form-group">
                                                            <label htmlFor="startDate">Lesson Date</label>
                                                            <input type="date"
                                                                id="lessonDateField"
                                                                className="form-control"
                                                                placeholder=""
                                                                onChange={this.handleLessonDateChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="startDate">New Lesson Date</label>
                                                            <input type="date"
                                                                id="newLessonDateField"
                                                                className="form-control"
                                                                placeholder="choose new date"
                                                                onChange={this.handleNewLessonDateChange} />
                                                        </div>

                                                        <button type="button"
                                                            className="btn btn-outline-primary mr-3"
                                                            onClick={this.updateFlowSched}>update</button>
                                                        <button type="button"
                                                            className="btn btn-outline-primary mr-3"
                                                            onClick={this.clearFlowSchedForm}>clear form</button>
                                                    </form>
                                                </div>
                                            </div>
                                            {/* flow schedule */}
                                            <div className="col-sm-9">
                                                <div className="card-body bg-light m-1">
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                    <h4 className="App">Flow {flowNumber} Schedule</h4>
                                                    <div className="full-text">
                                                        <div className="row" style={{ height: "30px" }}>
                                                            <div className="col-sm-2"><b>Course ID {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNewNumber(1, "mySchedTableNew")}></i></b></div>
                                                            <div className="col-sm-2"><b>Lesson {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNewNumber(2, "mySchedTableNew")}></i></b></div>
                                                            <div className="col-sm-5" ><b>Course Name{" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(3, "mySchedTableNew")}></i></b></div>
                                                            <div className="col-sm-3" ><b>Date{" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(4, "mySchedTableNew")}></i></b></div></div></div>
                                                    <div className="wrapper" style={wrapperStyles}>
                                                        <Paper className="flows" style={{ padding: '0' }}>
                                                            <Table id="mySchedTableNew">
                                                                <TableHead className="flow">
                                                                    <TableRow className="flow">
                                                                        <TableCell className="flow" colSpan={2}>Course ID {" "}
                                                                            <i className="fa fa-sort"
                                                                                onClick={() => sortTableNewNumber(1, "mySchedTableNew")}></i>
                                                                        </TableCell>
                                                                        <TableCell className="flow">Lesson {" "}
                                                                            <i className="fa fa-sort"
                                                                                onClick={() => sortTableNewNumber(2, "mySchedTableNew")}></i>
                                                                        </TableCell>
                                                                        <TableCell className="flow">Course {" "}
                                                                            <i className="fa fa-sort"
                                                                                onClick={() => sortTableNew(3, "mySchedTableNew")}></i>
                                                                        </TableCell>
                                                                        <TableCell className="flow">Date {" "}
                                                                            <i className="fa fa-sort"
                                                                                onClick={() => sortTableNew(4, "mySchedTableNew")}></i>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {schedDatesArr.map(course => (
                                                                        <TableRow key={course.id}>
                                                                            <TableCell style={{ width: "5px" }}><input id={"radioSelect" + course.id.toString()} type="radio" name="selected" onChange={(e) => this.showFlowSched(course)} /></TableCell>
                                                                            <TableCell style={{ minWidth: "80px" }}>
                                                                                {course.course_id}</TableCell>
                                                                            <TableCell style={{ minWidth: "50px" }}>{lessNum++}</TableCell>
                                                                            <TableCell id={"courseName" + course.id.toString()}>{course.name}</TableCell>
                                                                            <TableCell id={"lessonDate" + course.id.toString()}>{course.date.toString().substr(0, 10)}</TableCell>
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
                                <div className="short-text" >
                                    <div className="row">
                                        <div className="col-10">
                                            <h5 style={{ marginLeft: '30%' }}>Flow {flowNumber} Schedule</h5></div>
                                        <div className="col-2"><button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button></div></div>

                                    <table className="flowSchedTable" style={{ maxHeight: "400px", overflowY: 'scroll' }}>
                                        <thead className="flowSchedTable">
                                            <tr className="flowSchedTable">
                                                <th className="flowSchedTable">Course ID</th>
                                                <th className="flowSchedTable">Lesson</th>
                                                <th className="flowSchedTable">Course</th>
                                                <th className="flowSchedTable">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="flowSchedTable">
                                            {schedDatesArr.map(course => (
                                                <tr className="flowSchedTable" key={course.id}>
                                                    <td className="flowSchedTable" >
                                                        <input id={"radioSelectM" + course.id.toString()} type="radio" name="selected" onChange={(e) => this.showFlowSched(course)} /> </td>
                                                    <td className="flowSchedTable"> {course.course_id}</td>
                                                    <td className="flowSchedTable"> {lessNumMobile++}</td>
                                                    <td className="flowSchedTable">{course.name}</td>
                                                    <td className="flowSchedTable">{course.date.toString().substr(0, 10)}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div>
                                        <div className="card-body bg-light m-4">
                                            <h4 className="App">Flow Schedule Update Form</h4>
                                            <form id="flowSchedUp">
                                                <div className="form-group">
                                                    <label htmlFor="startDate">Lesson Date</label>
                                                    <input type="date"
                                                        id="lessonDateFieldM"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.handleLessonDateChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="startDate">New Lesson Date</label>
                                                    <input type="date"
                                                        id="newLessonDateFieldM"
                                                        className="form-control"
                                                        placeholder="choose new date"
                                                        onChange={this.handleNewLessonDateChange} />
                                                </div>

                                                <button type="button"
                                                    className="btn btn-outline-primary mr-3"
                                                    onClick={this.updateFlowSched}>update</button>
                                                <button type="button"
                                                    className="btn btn-outline-primary mr-3"
                                                    onClick={this.clearFlowSchedForm}>clear form</button>
                                            </form>
                                        </div>
                                    </div>
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


export default Flow;
