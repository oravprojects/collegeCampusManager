import React from "react";

type LoginData = {
    status: string;
    data: Array<Login>;
};

type Login = {
    email: string;
    hash: string;
};

interface Props {
    history: string;
 }
interface State {
    login: Array<Login>;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    hash: string;
    status: string;
    role: string;
}

class login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            login: [],
            user_id:0,
            first_name: "",
            last_name: "",
            email: "",
            hash: "",
            status: "",
            role: ""
            };
    }

    handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            email: e.target.value
        })
    };

    handleHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            hash: e.target.value
        })
    };

    login = () => {
        const rmCheck = document.getElementById("customCheck1") as HTMLInputElement;;
        const emailInput = document.getElementById("email") as HTMLInputElement;

        if (this.state.email === "" || this.state.hash === "") {
            if (document.getElementById("warning")) {
                var element = document.getElementById("warning");
                element!.parentNode!.removeChild(element!);
            }
            var newDiv = document.createElement('div');
            newDiv!.className = "alert alert-danger";
            newDiv!.id = "warning";
            var newContent = document.createTextNode("all fields must be completed!");
            newDiv.appendChild(newContent);
            var currDiv = document.getElementById("topDiv");
            currDiv!.parentNode!.insertBefore(newDiv, currDiv);
            return;
        }

        if (rmCheck!.checked && emailInput.value !== "") {
            localStorage.username = emailInput.value;
            localStorage.checkbox = rmCheck.value;
        } else {
            localStorage.username = "";
            localStorage.checkbox = "";
        }

        console.log(this.state.email)
        fetch('https://casul-campus.herokuapp.com/login/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.hash
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                console.log(jsonRes);
                
                console.log(jsonRes.data[0].role);
                if (jsonRes.status === "ok") {
                    window.localStorage.setItem("first_name", jsonRes.data[0].first_name)
                    window.localStorage.setItem("last_name", jsonRes.data[0].last_name)
                    window.localStorage.setItem("user_id", jsonRes.data[0].user_id)
                    window.localStorage.setItem("thisToken", jsonRes.token)
                    window.localStorage.setItem("rid", jsonRes.data[0].rid)

                    if (jsonRes.data[0].role === "lecturer") {
                        window.localStorage.setItem("userRole", "lecturer")
                        window.location.href = "LecturerHome"
                    }
                    if (jsonRes.data[0].role === "student") {
                        window.localStorage.setItem("userRole", "student")
                        window.location.href = "StudentHome"
                    }
                    if (jsonRes.data[0].role === "admin") {
                        window.localStorage.setItem("userRole", "admin")
                        window.location.href = "AdminHome"
                    }
                    
                    if (jsonRes.data[0].role === "demoLecturer") {
                        window.localStorage.setItem("userRole", "demoLecturer")
                        window.location.href = "LecturerHome"
                    }
                    if (jsonRes.data[0].role === "demoStudent") {
                        window.localStorage.setItem("userRole", "demoStudent")
                        window.location.href = "StudentHome"
                    }
                    if (jsonRes.data[0].role === "demoAdmin") {
                        window.localStorage.setItem("userRole", "demoAdmin")
                        window.location.href = "AdminHome"
                    }
                }
            })
            .catch(error => {
                console.log(error)

                if (error) {
                    if (document.getElementById("warning")) {
                        var element = document.getElementById("warning");
                        element!.parentNode!.removeChild(element!);
                    }

                    var newDiv = document.createElement('div');
                    newDiv!.className = "alert alert-danger";
                    newDiv!.id = "warning";
                    var newContent = document.createTextNode("incorrect email and/or password");
                    newDiv.appendChild(newContent);
                    var currDiv = document.getElementById("topDiv");
                    currDiv!.parentNode!.insertBefore(newDiv, currDiv);
                }
            });
    };

    componentDidMount() {
        const rmCheck = document.getElementById("customCheck1") as HTMLInputElement;;
        const emailInput = document.getElementById("email") as HTMLInputElement;

        if (localStorage.checkbox && localStorage.checkbox !== "") {
            rmCheck!.setAttribute("checked", "checked");
            emailInput!.value = localStorage.username;
        } else {
            rmCheck!.removeAttribute("checked");
            emailInput.value = "";
        }
    }

    render() {
        return (
            <div>
            <h1 className="ml-4 mt-4 mb-4">E-Campus</h1>
            <div className="container-fluid m-2">
                        <div className="row">
                            <div className="col">
                                
            <div className="card card-body bg-light"
            style={{width: "80%"}}>
            <form>
                <h3>Sign In</h3>

                <div id="topDiv" className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" id="email" className="form-control" placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleEmailChange} 
                    onKeyPress={event => event.key === 'Enter' ? this.login(): null}/>
                </div>

                <div className="form-group">
                    <label htmlFor="pass">Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" 
                    value={this.state.hash}
                    onChange={this.handleHashChange}
                    onKeyPress={event => event.key === 'Enter' ? this.login(): null}/>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button 
                onClick={this.login}
                type="button" className="btn btn-primary btn-block">LOGIN</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
                
                
                <div className="forgot-password text-left">
                   <h4>contact service desk</h4>
                   1800-123-4567 <br/>
                   <a href="mailto:IThelp@campus.com">IThelp@campus.com</a>
                </div>
            </form>
            </div>
            
            </div>
            
            <div className="col-6 md-4"></div>
            </div>
            </div>
            </div>
        );
    }
}

export default login;

    