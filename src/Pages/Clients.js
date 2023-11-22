import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlusSquare, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Clients() {
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const result = await axios.get("http://localhost:8099/clients");
            setUsers(result.data);
        } catch (error) {
            setError("Failed to fetch users. Please try again.");
        }
    }

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8099/client/${id}`);
            loadUsers();
        } catch (error) {
            setError("Failed to delete the user. Please try again.");
        }
    }

    const exportToExcel = () => {
        const data = users.map((user) => ({
            "Client ID": user.idc,
            "Full name": user.fullname,
            "Username": user.username,
            "Email": user.email,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clients");
        XLSX.writeFile(wb, "UsersList.xlsx");
    };

    const filteredUsers = users.filter((user) =>
        user.fullname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        user.email.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <br/>
                    <div className="input-group mb-3">
                        <b><h5 style={{ margin: "0 15px 0 0" }}>Search : </h5></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users"
                            aria-label="Search users"
                            aria-describedby="search-icon"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-success" onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
                </button>
                <Link className="btn btn-primary" to="/addclient">
                    <FontAwesomeIcon icon={faPlusSquare} /> Add new client
                </Link>
            </div>

            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Full name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {error ? (
                        <tr>
                            <td colSpan="5">Error: {error}</td>
                        </tr>
                    ) : filteredUsers.map((user, index) => (
                        <tr key={user.idc}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.fullname}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link className="btn btn-primary mx-2" to={`/viewclient/${user.idc}`}>
                                    <FontAwesomeIcon icon={faEye} /> View
                                </Link>
                                <Link className="btn btn-success mx-2" to={`/editclient/${user.idc}`}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </Link>
                                <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.idc)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}









// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faEye, faEdit, faTrash, faPlusSquare, faFileDownload} from '@fortawesome/free-solid-svg-icons';
// import { Link } from "react-router-dom";
// import * as XLSX from "xlsx";
//
// export default function Clients() {
//     const [users, setUsers] = useState([]);
//     const [searchKeyword, setSearchKeyword] = useState("");
//
//     useEffect(() => {
//         loadUsers();
//     }, []);
//
//     const loadUsers = async () => {
//         const result = await axios.get("http://localhost:8099/clients");
//         setUsers(result.data);
//     }
//
//     const deleteUser = async (id) => {
//         await axios.delete(`http://localhost:8099/client/${id}`);
//         loadUsers();
//     }
//
//     const filteredUsers = users.filter((user) =>
//         user.fullname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//         user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchKeyword.toLowerCase())
//     );
//
//     const exportToExcel = () => {
//         const data = users.map((user) => ({
//             "Client ID": user.id,
//             "Full name": user.fullname,
//             "Username": user.username,
//             "Email": user.email,
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Clients");
//         XLSX.writeFile(wb, "UsersList.xlsx");
//     };
//
//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                     <br/>
//                     {/*<h5>Clients List</h5>*/}
//                     <div className="input-group mb-3">
//                         <b><h7 style={{ margin: "0 15px 0 0" }}>Search : </h7></b>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search users"
//                             aria-label="Search users"
//                             aria-describedby="search-icon"
//                             value={searchKeyword}
//                             onChange={(e) => setSearchKeyword(e.target.value)}
//                         />
//                     </div>
//
//                 </div>
//                 <button className="btn btn-success" onClick={exportToExcel}>
//                     <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
//                 </button>
//                 <Link className="btn btn-primary" to="/addclient">
//                     <FontAwesomeIcon icon={faPlusSquare} /> Add new client
//                 </Link>
//             </div>
//
//             <div className="py-4">
//                 <table className="table border shadow">
//                     <thead>
//                     <tr>
//                         <th scope="col">User ID</th>
//                         <th scope="col">Full name</th>
//                         <th scope="col">Username</th>
//                         <th scope="col">Email</th>
//                         {/*<th scope="col">Password</th>*/}
//                         <th scope="col">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredUsers.map((user, index) => (
//                         <tr key={user.id}>
//                             <th scope="row">{index + 1}</th>
//                             <td>{user.fullname}</td>
//                             <td>{user.username}</td>
//                             <td>{user.email}</td>
//                             {/*<td>{user.password}</td>*/}
//                             <td>
//                                 <Link className="btn btn-primary mx-2" to={`/viewclient/${user.id}`}>
//                                     <FontAwesomeIcon icon={faEye} /> View
//                                 </Link>
//                                 <Link className="btn btn-success mx-2" to={`/editclient/${user.id}`}>
//                                     <FontAwesomeIcon icon={faEdit} /> Edit
//                                 </Link>
//                                 <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.id)}>
//                                     <FontAwesomeIcon icon={faTrash} /> Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }









// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faEye, faEdit, faTrash, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
// import { Link, useParams } from "react-router-dom";
//
// export default function Clients() {
//     const [users, setUsers] = useState([]);
//
//     useEffect(() => {
//         loadUsers();
//     }, []);
//
//     const loadUsers = async () => {
//         const result = await axios.get("http://localhost:8099/users");
//         setUsers(result.data);
//     }
//
//     const deleteUser = async (id) => {
//         await axios.delete(`http://localhost:8099/user/${id}`);
//         loadUsers();
//     }
//
//     return (
//         <div className="container">
//             <br/>
//             <Link className="btn btn-primary" to="/adduser"><FontAwesomeIcon icon={faPlusSquare} /> Add new user</Link>
//
//             <div className="py-4">
//                 <table className="table border shadow">
//                     <thead>
//                     <tr>
//                         <th scope="col">User ID</th>
//                         <th scope="col">Full name</th>
//                         <th scope="col">Username</th>
//                         <th scope="col">Email</th>
//                         <th scope="col">Password</th>
//                         <th scope="col">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {
//                         users.map((user, index) => (
//                             <tr key={user.id}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{user.fullname}</td>
//                                 <td>{user.username}</td>
//                                 <td>{user.email}</td>
//                                 <td>{user.password}</td>
//                                 <td>
//                                     <Link className="btn btn-primary mx-2" to={`/viewuser/${user.id}`}>
//                                         <FontAwesomeIcon icon={faEye} /> View
//                                     </Link>
//                                     <Link className="btn btn-success mx-2" to={`/edituser/${user.id}`}>
//                                         <FontAwesomeIcon icon={faEdit} /> Edit
//                                     </Link>
//                                     <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.id)}>
//                                         <FontAwesomeIcon icon={faTrash} /> Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     }
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
