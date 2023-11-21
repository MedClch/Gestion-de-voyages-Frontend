import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
    let navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "", // New "Confirm password" field
    });
    // const [error,setError] = useState("")
    const { fullname, username, email, password, confirmPassword } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // setError("Passwords do not match !");
            toast.error("Passwords do not match.");
            return;
        }
        try {
            await axios.post("http://localhost:8099/register", user);
            navigate("/");
        } catch (error) {
            toast.error("Error saving new user!");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Register</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="FullName" className="form-label">Name</label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your name"
                                name="fullname"
                                value={fullname}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">Username</label>
                            <input
                                type={"text"}
                                className="form-control"
                                placeholder="Enter your username"
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Email</label>
                            <input
                                type={"email"}
                                className="form-control"
                                placeholder="Enter your email"
                                name="email"
                                value={email}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Password</label>
                            <input
                                type={"password"}
                                className="form-control"
                                placeholder="Enter your password"
                                name="password"
                                value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type={"password"}
                                className="form-control"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Submit</button>
                        <Link type="submit" className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
