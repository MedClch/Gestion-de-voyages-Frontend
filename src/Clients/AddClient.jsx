import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function AddClient(){
    let navigate = useNavigate()
    const [user,setUser,setUsers] = useState({
        fullname :"",
        username :"",
        email : "",
        password : ""
    })
    const loadAllUsers = async () => {
        try {
            const result = await axios.get("http://localhost:8099/clients");
            setUsers(result.data);
        } catch (error) {
            toast.error("Error loading users");
        }
    };
    const {fullname,username,email,password} = user
    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8099/saveclient", user);
            await loadAllUsers();
            navigate("/");
        } catch (error) {
            toast.error("Error saving new user !");
        }
    };

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Add new client</h2>
                    <form onSubmit={(e)=>onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="FullName" className="form-label">Name</label>
                            <input type={"text"} className="form-control" placeholder="Enter your name"
                                   name="fullname" value={fullname} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">Username</label>
                            <input type={"text"} className="form-control" placeholder="Enter your username"
                                   name="username" value={username} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Email</label>
                            <input type={"email"} className="form-control" placeholder="Enter your email"
                                   name="email" value={email} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Password</label>
                            <input type={"text"} className="form-control" placeholder="Enter your password"
                         name="password" value={password} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Submit</button>
                        <Link type="submit" className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}