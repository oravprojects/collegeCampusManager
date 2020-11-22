import React from 'react';
import "../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CSS from 'csstype';
import AdminNav from './adminUI/AdminNav';
import { sortTable, sortTableNew, sortTableNewNumber } from './sorts'

const wrapperStyles: CSS.Properties = {
    margin: '2rem',
    maxHeight: '600px',
    overflowY: 'scroll'
};

type SectionData = {
    status: string;
    data: Array<Section>;
};

type Section = {
    section_id: number;
    section: number;
    course_id: number;
    flow_id: number;
    lecturer_id: number;
    first_name: string;
    last_name: string;
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

type FlowData = {
    status: string;
    data: Array<tFlow>;
};

type tFlow = {
    flow_id: number;
};

type LecturerData = {
    status: string;
    data: Array<Lecturer>;
};

type Lecturer = {
    lecturer_id: number;
    first_name: string;
    last_name: string;
}

interface Props { }

interface State {
    sections: Array<Section>;
    courses: Array<Course>;
    flows: Array<tFlow>;
    lecturers: Array<Lecturer>;
    section_id: number;
    section: number;
    course_id: number;
    flow_id: number;
    lecturer_id: number;
    first_name: string;
    last_name: string;
    name: string;
    selected: boolean;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class Sections extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sections: [],
            courses: [],
            flows: [],
            lecturers: [],
            section_id: 0,
            section: 0,
            course_id: 0,
            flow_id: 0,
            lecturer_id: 0,
            first_name: "",
            last_name: "",
            name: "",
            selected: false
        };
    }

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/courses/sectionList')
            .then(res => res.json())
            .then((jsonRes: SectionData) => {
                this.setState({
                    sections: jsonRes.data
                });
                sortTable("myTable");
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

        fetch('https://casul-campus.herokuapp.com/courses/flowList')
            .then(res => res.json())
            .then((jsonRes: FlowData) => {
                this.setState({
                    flows: jsonRes.data
                });
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/courses/lecturerList')
            .then(res => res.json())
            .then((jsonRes: LecturerData) => {
                this.setState({
                    lecturers: jsonRes.data
                });
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "admin" &&
            localStorage.getItem("userRole") !== "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
        this.refreshList();
    };

    handleSectionChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            section: e.target.value
        })
    };

    handleCourseIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            course_id: e.target.value
        })
    };

    handleLecturerIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            lecturer_id: e.target.value
        })
    };

    handleFlowIdChange = (e: React.ChangeEvent<any>) => {
        var thisFlowId = document.getElementById("selFlowId") as HTMLSelectElement
        this.setState({
            flow_id: +thisFlowId.value
        })
    };

    handleFlowIdChangeMobile = (e: React.ChangeEvent<any>) => {
        var thisFlowIdMobile = document.getElementById("selFlowIdMobile") as HTMLSelectElement
        this.setState({
            flow_id: +thisFlowIdMobile.value
        })
    };

    addNewSection = () => {
        if (this.state.section === 0 || !this.state.section ||
            this.state.lecturer_id === 0 || !this.state.lecturer_id ||
            this.state.flow_id === 0 || !this.state.flow_id ||
            this.state.course_id === 0 || !this.state.course_id) {
            return alert("all fields must be completed");
        }

        for (var i = 0; i < this.state.sections.length; i++) {
            if (+this.state.section === +this.state.sections[i].section &&
                +this.state.course_id === +this.state.sections[i].course_id) {
                alert("Section already exists. Choose another section number.")
                return;
            }
        }

        fetch('https://casul-campus.herokuapp.com/courses/addSection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                section: this.state.section,
                lecturer_id: this.state.lecturer_id,
                flow_id: this.state.flow_id,
                course_id: this.state.course_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo verison. You do not have permission to add sections.")
                }
                if (res.ok) {
                    alert("section added successfully!")
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    deleteSection = () => {
        if (this.state.section_id === 0) {
            alert("Please select a section.");
            return;
        }
        fetch('https://casul-campus.herokuapp.com/courses/deleteSection', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseId: this.state.section_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete sections.")
                }
                if (res.ok) {
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        this.setState({
            section: 0,
            lecturer_id: 0,
            course_id: 0,
            flow_id: 0
        });
        var selCourseField = document.getElementById("selCourse") as HTMLSelectElement;
        selCourseField.value = "";

        var selFlowField = document.getElementById("selFlowId") as HTMLSelectElement;
        selFlowField.value = "";

        var selLecField = document.getElementById("selLecId") as HTMLSelectElement;
        selLecField.value = "";

        var selCourseFieldMobile = document.getElementById("selCourseMobile") as HTMLSelectElement;
        selCourseFieldMobile.value = "";

        var selFlowFieldMobile = document.getElementById("selFlowIdMobile") as HTMLSelectElement;
        selFlowFieldMobile.value = "";

        var selLecFieldMobile = document.getElementById("selLecIdMobile") as HTMLSelectElement;
        selLecFieldMobile.value = "";
    };


    updateSection = () => {
        if (this.state.section === 0 || !this.state.section ||
            this.state.lecturer_id === 0 || !this.state.lecturer_id ||
            this.state.flow_id === 0 || !this.state.flow_id ||
            this.state.course_id === 0 || !this.state.course_id) {
            return alert("all fields must be completed");
        }

        fetch('https://casul-campus.herokuapp.com/courses/updateSection', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                section_id: this.state.section_id,
                course_id: this.state.course_id,
                flow_id: this.state.flow_id,
                lecturer_id: this.state.lecturer_id,
                section: this.state.section,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update sections.")
                }
                if (res.ok) {
                    alert("course updated successfully!")
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    showSection = (section: Section) => {
        this.setState({
            section: section.section,
            flow_id: section.flow_id,
            section_id: section.section_id,
            lecturer_id: section.lecturer_id,
            course_id: section.course_id,
            first_name: section.first_name,
            last_name: section.last_name,
            sections: this.state.sections
        });

        var selCourseField = document.getElementById("selCourse") as HTMLSelectElement;
        var opts = selCourseField.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value === section.course_id.toString()) {
                selCourseField.selectedIndex = j;
                break;
            }
        }

        var selCourseFieldMobile = document.getElementById("selCourseMobile") as HTMLSelectElement;
        var opts = selCourseFieldMobile.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value === section.course_id.toString()) {
                selCourseFieldMobile.selectedIndex = j;
                break;
            }
        }

        var selFlowField = document.getElementById("selFlowId") as HTMLSelectElement;
        selFlowField.value = section.flow_id.toString();

        var selLecField = document.getElementById("selLecId") as HTMLSelectElement;
        var opts = selLecField.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value === section.lecturer_id.toString()) {
                selLecField.selectedIndex = j;
                break;
            }
        }
        var selFlowFieldMobile = document.getElementById("selFlowIdMobile") as HTMLSelectElement;
        selFlowFieldMobile.value = section.flow_id.toString();

        var selLecFieldMobile = document.getElementById("selLecIdMobile") as HTMLSelectElement;
        var opts = selLecFieldMobile.options;
        for (var opt, j = 0; opt = opts[j]; j++) {
            if (opt.value === section.lecturer_id.toString()) {
                selLecFieldMobile.selectedIndex = j;
                break;
            }
        }
    };


    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <div className="card card-body bg-white w-100">
                    <div className="full-text">
                        <div className="row no-gutters">

                            <div className="col-6 col-md-3">
                                <div className="card-body bg-light m-4">
                                    <h4 className="App">Sections Form</h4>
                                    <form id="sections">
                                        <div className="form-group">
                                            <label htmlFor="section">Section</label>
                                            <input type="number"
                                                id="section"
                                                className="form-control"
                                                placeholder="enter section number"
                                                value={(this.state.section === 0 ? "" : this.state.section)}
                                                onChange={this.handleSectionChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="course">Course</label>
                                            <select id="selCourse" onChange={this.handleCourseIdChange} className="custom-select custom-select-lg mb-3">
                                                <option value="">select course</option>
                                                {this.state.courses.map(course =>
                                                    <option key={course.course_id} value={course.course_id}>
                                                        {course.name}
                                                    </option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="flowIdField">Flow ID</label>
                                            <select id="selFlowId" onChange={this.handleFlowIdChange} className="custom-select custom-select-lg mb-3">
                                                <option value="">select flow</option>
                                                {this.state.flows.map(flow =>
                                                    <option key={flow.flow_id} value={flow.flow_id}>
                                                        {flow.flow_id}
                                                    </option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lecturerIdField">lecturer ID</label>
                                            <select id="selLecId" onChange={this.handleLecturerIdChange} className="custom-select custom-select-lg mb-3">
                                                <option value="">select lecturer</option>
                                                {this.state.lecturers.map(lecturer =>
                                                    <option key={lecturer.lecturer_id} value={lecturer.lecturer_id}>
                                                        {lecturer.lecturer_id} {" "}{lecturer.first_name}{" "}{lecturer.last_name}
                                                    </option>)}
                                            </select>
                                        </div>
                                        <button onClick={this.addNewSection}
                                            type="button"
                                            className="btn btn-outline-primary mr-3">add</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.updateSection}>update</button>
                                        <button onClick={(e) => this.deleteSection(/*task.student_id*/)}
                                            type="button"
                                            className="btn btn-outline-primary mr-3">delete</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>clear form</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-9">
                                <div className="card-body bg-light m-4">
                                    <h4 className="App">Course Sections</h4>

                                    <div className="row" style={{ marginLeft: "20px", height: "20px" }}>

                                        <div className="col-md-2" style={{ marginLeft: "10px" }}><b>Course {" "}
                                            <i className="fa fa-sort"
                                                onClick={() => sortTableNew(0, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-2" style={{ marginLeft: "10px" }}><b>Section{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNewNumber(1, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-2" style={{ marginLeft: "-35px", maxWidth: "100px" }}><b>First Name{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNew(2, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-2" style={{ marginLeft: "80px", maxWidth: "100px" }}><b>Last Name{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNew(3, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-2" style={{ marginLeft: "80px", maxWidth: "100px" }}><b>Lecturer ID{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNewNumber(4, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-2" style={{ marginLeft: "0px", maxWidth: "100px" }}><b>Flow ID{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNewNumber(5, "myTable")}></i></b>
                                        </div>

                                    </div>

                                    <div className="wrapper" style={wrapperStyles}>
                                        <Paper>
                                            <Table id="myTable">
                                                <TableHead>
                                                    <TableRow>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.sections.map(section => (
                                                        <TableRow key={section.section_id}>
                                                            <TableCell style={{ maxWidth: "100px", minWidth: "100px" }}>
                                                                <input type="radio" name="selected" onChange={(e) => this.showSection(section)} /> {section.name}</TableCell>
                                                            <TableCell style={{ maxWidth: "50px", minWidth: "50px" }}>{section.section}</TableCell>
                                                            <TableCell style={{ maxWidth: "100px", minWidth: "100px" }}>{section.first_name}</TableCell>
                                                            <TableCell style={{ maxWidth: "100px", minWidth: "100px" }}>{section.last_name}</TableCell>
                                                            <TableCell style={{ maxWidth: "50px", minWidth: "50px" }}>{section.lecturer_id}</TableCell>
                                                            <TableCell style={{ maxWidth: "50px", minWidth: "50px" }}>{section.flow_id}</TableCell>
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

                    <div className="short-text">
                        <div className="card-body bg-light m-4">
                            <form id="sectionsMobile">
                                <div className="form-group">
                                    <label htmlFor="section">Section</label>
                                    <input type="number"
                                        id="sectionMobile"
                                        className="form-control"
                                        placeholder="enter section number"
                                        value={(this.state.section === 0 ? "" : this.state.section)}
                                        onChange={this.handleSectionChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="course">Course</label>
                                    <select id="selCourseMobile" onChange={this.handleCourseIdChange} className="custom-select custom-select-lg mb-3">
                                        <option value="">select course</option>
                                        {this.state.courses.map(course =>
                                            <option key={course.course_id} value={course.course_id}>
                                                {course.name}
                                            </option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="flowIdField">Flow ID</label>
                                    <select id="selFlowIdMobile" onChange={this.handleFlowIdChangeMobile} className="custom-select custom-select-lg mb-3">
                                        <option value="">select flow</option>
                                        {this.state.flows.map(flow =>
                                            <option key={flow.flow_id} value={flow.flow_id}>
                                                {flow.flow_id}
                                            </option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lecturerIdField">lecturer ID</label>
                                    <select id="selLecIdMobile" onChange={this.handleLecturerIdChange} className="custom-select custom-select-lg mb-3">
                                        <option value="">select lecturer</option>
                                        {this.state.lecturers.map(lecturer =>
                                            <option key={lecturer.lecturer_id} value={lecturer.lecturer_id}>
                                                {lecturer.lecturer_id} {" "}{lecturer.first_name}{" "}{lecturer.last_name}
                                            </option>)}
                                    </select>
                                </div>
                                <button onClick={this.addNewSection}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">add</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.updateSection}>update</button>
                                <button onClick={(e) => this.deleteSection(/*task.student_id*/)}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">delete</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.clearForm}>clear form</button>
                            </form>
                        </div>

                        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <table className="sectionTableMobile">
                                <thead className="sectionTableMobile">
                                    <tr className="sectionTableMobile">
                                        <th className="sectionTableMobile" >Course</th>
                                        <th className="sectionTableMobile">Section</th>
                                        <th className="sectionTableMobile">First Name</th>
                                        <th className="sectionTableMobile">Last Name</th>
                                        <th className="sectionTableMobile">Lec. ID</th>
                                        <th className="sectionTableMobile">Flow ID</th>
                                    </tr>
                                </thead>
                                <tbody className="sectionTableMobile">{this.state.sections.map(section => (
                                    <tr className="sectionTableMobile" key={section.section_id}>
                                        <td className="sectionTableMobile">
                                            <input type="radio" name="selected" onChange={(e) => this.showSection(section)} /></td>
                                        <td className="sectionTableMobile">{section.name}</td>
                                        <td className="sectionTableMobile">{section.section}</td>
                                        <td className="sectionTableMobile">{section.first_name}</td>
                                        <td className="sectionTableMobile">{section.last_name}</td>
                                        <td className="sectionTableMobile">{section.lecturer_id}</td>
                                        <td className="sectionTableMobile">{section.flow_id}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Sections;

