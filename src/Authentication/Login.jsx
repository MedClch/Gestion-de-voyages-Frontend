import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function Login(){
    let navigate = useNavigate()
    const [user,setUser] = useState({
        username :"",
        password : ""
    })

    const {username,password} = user
    const onInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8099/login?username=${user.username}&password=${user.password}`);
            if (response.status === 200)
                navigate("/");
            else {
                // Handle other cases as needed.
            }
        } catch (error) {
            toast.error("Error logging in!");
        }
    };


    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Login</h2>
                    <form onSubmit={(e)=>onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">Username</label>
                            <input type={"text"} className="form-control" placeholder="Enter your username"
                                   name="username" value={username} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Password</label>
                            <input type="password" className="form-control" placeholder="Enter your password" name="password" value={password} onChange={(e) => onInputChange(e)} />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Submit</button>
                        <Link type="submit" className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )

}