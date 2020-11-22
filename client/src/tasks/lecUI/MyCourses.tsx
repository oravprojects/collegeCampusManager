import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "../../App.css";
import LecturerNav from './LecturerNav';
// import CSS from 'csstype';

var user_id = (window.localStorage.getItem('user_id'));

// var fileLinkStyle: CSS.Properties = {
//     display: 'none'
// }

type CourseListData = {
    status: string;
    data: Array<Course>;
};
type Course = {
    course_id: number;
    name: string;
    hours: number;
    lecturer_id: number;
    first_name: string;
    last_name: string;
    file_path: string;
    flow_id: number;
    section: number;
    section_id: number;
};
interface Props { }
interface State {
    courses: Array<Course>;
    course_id: number;
    courseName: string;
    lecturerFirstName: string;
    lecturerLastName: string;
    hours: number;
    lecturerId: number;
    file_path: string;
    flow_id: number;
    section: number;
    section_id: number;
    selected: boolean;

}


const thisToken = localStorage.getItem("thisToken");

export class MyCourses extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            course_id: 0,
            courseName: "",
            lecturerFirstName: "",
            lecturerLastName: "",
            hours: 0,
            lecturerId: 0,
            file_path: "",
            flow_id: 0,
            section: 0,
            section_id: 0,
            selected: false
        };
    }

    refreshList = () => {

        fetch('https://casul-campus.herokuapp.com/myCourses/myCourseList', {
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
                        courses: jsonRes.data
                    });
                    for (var i = 0; i < jsonRes.data.length; i++) {
                        var cell = document.getElementById("linkCell" + jsonRes.data[i].course_id.toString()) as HTMLTableCellElement;
                        if (jsonRes.data[i].file_path === "#") {
                            cell.innerHTML = "no file attached"
                        }
                    }
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };


    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "lecturer"
            && localStorage.getItem("userRole") !== "demoLecturer") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
        this.refreshList();
    };


    showCourseName = (course: Course) => {
        this.setState({
            courseName: course.name,
            hours: course.hours,
            course_id: course.course_id,
            lecturerId: course.lecturer_id,
            lecturerFirstName: course.first_name,
            lecturerLastName: course.last_name,
            file_path: course.file_path,
            flow_id: course.flow_id,
            section: course.section,
            courses: this.state.courses
        });
    };

    myCourseInfo = (course: Course) => {
        this.setState({
            courseName: course.name,
            hours: course.hours,
            course_id: course.course_id,
            lecturerId: course.lecturer_id,
            lecturerFirstName: course.first_name,
            lecturerLastName: course.last_name,
            file_path: course.file_path,
            flow_id: course.flow_id,
            section: course.section,
            section_id: course.section_id,
            courses: this.state.courses
        }, () => this.myCourseInfoCont(course))
    }

    myCourseInfoCont = (course: Course) => {
        if (!this.state.flow_id) {
            alert("course not active");
            return
        }
        if (!this.state.course_id) {
            alert("course id missing");
            return
        }
        fetch('https://casul-campus.herokuapp.com/myCourses/myCourseInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: course.flow_id,
                course_id: course.course_id,
                section_id: course.section_id,
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                if (jsonRes.status === "ok") {
                    if (jsonRes.data.length === 0) {
                        alert("There are no students in this flow.")
                        return;
                    }
                    window.localStorage.setItem("flow_id", jsonRes.data[0].flow_id)
                    window.localStorage.setItem("courseId", jsonRes.data[0].course_id)
                    window.localStorage.setItem("sectionId", jsonRes.data[0].section_id)

                    window.location.href = "myCourseInfo"
                }
                else {
                    alert('Session expired. Logout and login again.')
                }
            })
    };



    render() {

        return (
            <div>
                <LecturerNav />
                <br />
                <br />
                <div className="card card-body bg-light m-4" style={{ width: "18rem" }}>
                    <div>Choose a course to view and enter student grades and attendance</div>
                </div>
                <div>
                    <h1 className="App">My Courses</h1>
                </div>

                <div style={{ width: "100%" }}>

                    <table className="lecScheduleTable" style={{ width: "96%", marginLeft: "2%", tableLayout: "auto", fontSize: 25 }}>
                        <thead className="lecScheduleTable">
                            <tr className="lecScheduleTable">
                                <th className="lecScheduleTable">Course</th>
                                <th className="lecScheduleTable">Section</th>
                                <th className="lecScheduleTable">Flow Id</th>
                                <th className="lecScheduleTable">Hours</th>
                                <th className="lecScheduleTable">Course Id</th>
                                <th className="lecScheduleTable">Lecturer Id</th>
                                <th className="lecScheduleTable">Lecturer First Name</th>
                                <th className="lecScheduleTable">Lecturer Last Name</th>
                                {/* <TableCell>File</TableCell> */}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.courses.map(course => (
                                <tr className="lecScheduleTable" key={course.section_id}>
                                    <td className="lecScheduleTable">
                                        <button type="button" name="selected" className="btn btn-link btn-lg" style={{ textAlign: 'left', padding: '0' }}
                                            onClick={(e) => this.myCourseInfo(course)}> {course.name}</button></td>
                                    <td className="lecScheduleTable">{course.section}</td>
                                    <td className="lecScheduleTable">{course.flow_id}</td>
                                    <td className="lecScheduleTable">{course.hours}</td>
                                    <td className="lecScheduleTable">{course.course_id}</td>
                                    <td className="lecScheduleTable">{course.lecturer_id}</td>
                                    <td className="lecScheduleTable">{course.first_name}</td>
                                    <td className="lecScheduleTable">{course.last_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default MyCourses
