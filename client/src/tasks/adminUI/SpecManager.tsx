import React, { Component } from 'react'
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AdminNav from './AdminNav';
import { sortTableNew, sortTableNewNumber } from '../sorts';


type SpecListData = {
    status: string;
    data: Array<Spec>;
};

type Spec = {
    id: number;
    speciality_id: number;
    name: string;
};

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
    file: string
};

interface Props { }
interface State {
    courses: Array<Course>;
    specCourses: Array<Course>;
    courseId: number;
    courseName: string;
    lecturerFirstName: string;
    lecturerLastName: string;
    hours: number;
    lecturerId: number;
    file: string;

    specs: Array<Spec>;
    id: number;
    spec_id: number;
    specName: string;
    selected: boolean;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");
var selectedSpecs: string | any[] = [];
var selectedSpec = "";

export class SpecManager extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            specCourses: [],
            courseId: 0,
            courseName: "",
            lecturerFirstName: "",
            lecturerLastName: "",
            hours: 0,
            lecturerId: 0,
            file: "",

            specs: [],
            id: 0,
            spec_id: 0,
            specName: "",
            selected: false
        };
    }

    handleSpecNameChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            specName: e.target.value
        })
    };

    handleSpecIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            id: e.target.value
        })
    };

    handleSpecSpecIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            spec_id: e.target.value
        },
            this.findSpecCourses)
    };

    handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            courseName: e.target.value
        })
    };

    handleCourseIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            courseId: e.target.value
        })
    };

    handleLecturerIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            lecturerId: e.target.value
        })
    };

    handleLecturerFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            lecturerFirstName: e.target.value
        })
    };

    handleLecturerLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            lecturerLastName: e.target.value
        })
    };

    findSpec = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        fetch('https://casul-campus.herokuapp.com/specialities/findSpec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                id: this.state.id,
                spec_id: this.state.spec_id,
                specName: this.state.specName
            })
        })
            .then(res => res.json())
            .then((jsonRes: SpecListData) => {

                this.setState({
                    specs: jsonRes.data
                });

                return false;
            })
            .catch(error => console.log(error));
    };



    findSpecCourses = () => {
        if (this.state.spec_id === 0 || isNaN(this.state.spec_id)) {
            alert('Select specialitiy!')
            return;
        }

        for (var i = 0; i < selectedSpecs.length; i++) {
            if (selectedSpecs[i].speciality_id === +this.state.spec_id) {
                selectedSpec = selectedSpecs[i].name + " (" + this.state.spec_id + ") "
            }
        }

        fetch('https://casul-campus.herokuapp.com/specialities/findSpecCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                spec_id: this.state.spec_id,
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {
                    this.setState({
                        specCourses: jsonRes.data
                    });
                    return false;
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };

    findCourse = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        fetch('https://casul-campus.herokuapp.com/courses/findCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseId: this.state.courseId,
                courseName: this.state.courseName,
                hours: this.state.hours,
                lecturerId: this.state.lecturerId,
                file: this.state.file
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {
                    this.setState({
                        courses: jsonRes.data
                    });
                    return false;
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };

    clearCourseForm = () => {
        this.setState({
            courseName: "",
            hours: 0,
            lecturerId: 0,
            file: "",
            courseId: -1,
        });
    };

    clearSpecForm = () => {
        this.setState({
            specName: "",
            spec_id: 0,
            id: 0
        });
    };

    clearAllForms = () => {
        this.setState({
            courseName: "",
            hours: 0,
            lecturerId: 0,
            file: "",
            courseId: -1,
            specName: "",
            spec_id: 0,
            id: 0
        });
    };

    addCourseToSpec = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.spec_id === 0 && this.state.courseId === 0
            || isNaN(this.state.spec_id) && isNaN(this.state.courseId)) {
            alert('Select specialitiy and course.')
            return;
        }
        if (this.state.spec_id === 0 || isNaN(this.state.spec_id)) {
            alert('Select specialitiy.')
            return;
        }
        if (this.state.courseId === 0 || isNaN(this.state.courseId)) {
            alert('Select course.')
            return;
        }

        fetch('https://casul-campus.herokuapp.com/specialities/findSpecCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                spec_id: this.state.spec_id,
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {
                    this.setState({
                        specCourses: jsonRes.data
                    });
                    for (var i = 0; i < this.state.specCourses.length; i++) {
                        if (+this.state.courseId === this.state.specCourses[i].course_id) {
                            alert("Course already exists in this speciality.");
                            return;
                        }
                    }
                } else {
                    alert('Session expired. Logout and login again.');
                    return;
                }
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/specialities/addCourseToSpec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                spec_id: this.state.spec_id,
                course_id: this.state.courseId,
                rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add courses to specialities.")
                }
                if (res.ok) {
                    alert("course added successfully!");

                    fetch('https://casul-campus.herokuapp.com/specialities/findSpecCourses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + thisToken
                        },
                        body: JSON.stringify({
                            spec_id: this.state.spec_id,
                        })
                    })
                        .then(res => res.json())
                        .then((jsonRes: CourseListData) => {
                            this.setState({
                                specCourses: jsonRes.data
                            });
                            return false;
                        })
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    };

    removeCourseFromSpec = () => {
        if (this.state.spec_id === 0 || this.state.courseId === 0) {
            alert("Choose a speciality and course to remove.");
            return;
        }

        var radioChecked = false;
        var radios = document.getElementsByName("selected") as any

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radioChecked = true;
            }
        }

        if (radioChecked === false) {
            alert("Select a course to remove.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/specialities/removeCourseFromSpec', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                spec_id: this.state.spec_id,
                course_id: this.state.courseId,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to remove courses from specialities.")
                }
                if (res.ok) {
                    alert("course removed successfully!");

                    fetch('https://casul-campus.herokuapp.com/specialities/findSpecCourses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + thisToken
                        },
                        body: JSON.stringify({
                            spec_id: this.state.spec_id,
                        })
                    })
                        .then(res => res.json())
                        .then((jsonRes: CourseListData) => {
                            this.setState({
                                specCourses: jsonRes.data
                            });
                            return false;
                        })
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    };

    showCourseName = (course: Course) => {
        this.setState({
            courseName: course.name,
            hours: course.hours,
            courseId: course.course_id,
            lecturerId: course.lecturer_id,
            lecturerFirstName: course.first_name,
            lecturerLastName: course.last_name,
            file: course.file,
            courses: this.state.courses
        });
    };

    showSpecName = (spec: Spec) => {
        this.setState({
            specName: spec.name,
            spec_id: spec.speciality_id,
            id: spec.id,
            specs: this.state.specs
        });

    };

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/specialities/specList')
            .then(res => res.json())
            .then((jsonRes: SpecListData) => {
                this.setState({
                    specs: jsonRes.data
                });
                selectedSpecs = jsonRes.data
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/courses/courseList')
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                this.setState({
                    courses: jsonRes.data
                });
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") != "admin"
            && localStorage.getItem("userRole") !== "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
        this.refreshList();
    };

    clearForm = () => {
        this.setState({
            specCourses: [],
            spec_id: 0,
            courseId: 0
        });
        var selSpec = document.getElementById("selSpec") as HTMLSelectElement;
        selSpec!.value = "select speciality";
        var selCourse = document.getElementById("selCourse") as HTMLSelectElement;
        selCourse!.value = "select course";
        selectedSpec = "";
    };

    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <br />
                <div className="card card-body bg-white w-100">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="card-body bg-light m-1">
                                    <form name="formid">
                                        <h4 className="App">Speciality</h4>

                                        <div className="form-group">
                                            <select id="selSpec" onChange={this.handleSpecSpecIdChange} className="custom-select custom-select-lg mb-3">
                                                <option>select speciality</option>
                                                {this.state.specs.map(spec =>
                                                    <option key={spec.id} value={spec.speciality_id}>
                                                        {spec.name}
                                                    </option>)}
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <div className="card-body bg-light m-1">
                                    <h4 className="App">Course</h4>
                                    <div className="form-group">
                                        <select id="selCourse" onChange={this.handleCourseIdChange} className="custom-select custom-select-lg mb-3">
                                            <option>select course</option>
                                            {this.state.courses.map(course =>
                                                <option key={course.course_id} value={course.course_id}>
                                                    {course.name}
                                                </option>)}
                                        </select>
                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.addCourseToSpec}>Add Course</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <div className="card-body bg-light m-1">
                                    <div className="App">
                                        <button onClick={(e) => this.removeCourseFromSpec()}
                                            className="btn btn-sm btn-danger"><h5 className="App">Remove Course from Speciality</h5>
                                            <h4><i className="fas fa-trash" /></h4>
                                        </button>
                                        <br />
                                        <br />
                                        <button type="button" className="btn btn-secondary btn-lg"
                                            onClick={this.clearForm}>Clear Form</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="specMan" className="card-body bg-light m-1">
                    <h4 className="App">{selectedSpec} speciality courses</h4>
                    <Paper style={{ maxHeight: "250px", overflowY: 'auto' }}>
                        <Table id="myTable">
                            <TableHead>
                                <TableRow>
                                    <TableCell id="specManTableCol1" className="specManTable">Course {" "}<i className="fa fa-sort"
                                        onClick={() => sortTableNew(0, "myTable")}></i></TableCell>
                                    <TableCell className="specManTable"><span className="full-text">Course ID {" "}</span>
                                        <span className="short-text">ID {" "}</span><i className="fa fa-sort"
                                            onClick={() => sortTableNewNumber(1, "myTable")}></i></TableCell>
                                    <TableCell className="specManTable">Hours {" "}<i className="fa fa-sort"
                                        onClick={() => sortTableNewNumber(2, "myTable")}></i></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.specCourses.map(course => (
                                    <TableRow key={course.course_id}>
                                        <TableCell>
                                            <input type="radio" name="selected" onChange={(e) => this.showCourseName(course)} /> {course.name}
                                        </TableCell>
                                        <TableCell>{course.course_id}</TableCell>
                                        <TableCell>{course.hours}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default SpecManager
