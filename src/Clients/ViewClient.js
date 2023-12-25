import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function ViewClient(){
    const { id } = useParams();
    const [user, setUser] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (id) {
                    const res = await axios.get(`http://localhost:8099/client/${id}`);
                    setUser(res.data);
                }
            } catch (error) {
                if (error.response) {
                    console.error("Server Error:", error.response.data);
                } else if (error.request) {
                    console.error("Request Error:", error.request);
                } else {
                    console.error("Error:", error.message);
                }
            }
        };
        loadUser();
    }, [id]);

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">View user informations</h2>
                    <div className="card">
                        <div className="card-header">
                            <b><i style={{ textDecoration: 'underline' }}>Details of user N°{user.id} :</i></b>
                            <br/>
                            <br/>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>Full name : </b>
                                    <b>{user.fullname}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Username : </b>
                                    <b>{user.username}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Email : </b>
                                    <b>{user.email}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Password : </b>
                                    <b>{user.password}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link to={"/"} className="btn btn-primary my-2"><FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back to list</Link>
                </div>
            </div>
        </div>
    )
}
