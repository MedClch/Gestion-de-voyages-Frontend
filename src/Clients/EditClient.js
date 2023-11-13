import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditClient() {
    let navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
    });
    const { fullname, username, email, password } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8099/client/${id}`, user);
            navigate("/");
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const loadUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8099/client/${id}`);
            setUser(res.data);
        } catch (error) {
            console.error("Error loading user:", error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Edit user information</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="fullname" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new name"
                                name="fullname"
                                value={fullname}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new username"
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter new email"
                                name="email"
                                value={email}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new password"
                                name="password"
                                // value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link to="/" className="btn btn-outline-danger mx-2">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}









// import React, {useEffect, useState} from "react";
// import axios from "axios";
// import {Link, redirect, useNavigate, useParams} from "react-router-dom";
//
// export default function EditClient(){
//     let navigate = useNavigate()
//     const {id} = useParams()
//     const [user,setUser] = useState({
//         fullname :"",
//         username :"",
//         email : "",
//         password : ""
//     })
//     const {fullname,username,email,password} = user
//     const onInputChange=(e)=>{
//         setUser({...user,[e.target.name]:e.target.value})
//     }
//     const onSubmit= async (e)=>{
//         e.preventDefault()
//         axios.put("http://localhost:8099/user/${id}",user)
//         redirect("/")
//     }
//     const loadUser = async ()=>{
//         const res = await axios.get("http://localhost:8099/user/${id}")
//         setUser(res.data)
//     }
//     useEffect(() => {
//         loadUser()
//     }, []);
//
//     return(
//         <div className="container">
//             <div className="row">
//                 <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
//                     <h2 className="text-center m-4">Edit user informations</h2>
//                     <form onSubmit={(e) => onSubmit(e)}>
//                         <div className="mb-3">
//                             <label htmlFor="fullname" className="form-label">
//                                 Name
//                             </label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Enter your name"
//                                 name="fullname"
//                                 value={fullname}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="username" className="form-label">
//                                 Username
//                             </label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="Enter your username"
//                                 name="username"
//                                 value={username}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="email" className="form-label">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 className="form-control"
//                                 placeholder="Enter your email"
//                                 name="email"
//                                 value={email}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="password" className="form-label">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 className="form-control"
//                                 placeholder="Enter your password"
//                                 name="password"
//                                 value={password}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <button type="submit" className="btn btn-outline-primary">
//                             Submit
//                         </button>
//                         <Link to="/" className="btn btn-outline-danger mx-2">
//                             Cancel
//                         </Link>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     )
//
// }