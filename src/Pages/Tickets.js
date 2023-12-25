import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faPlusSquare, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [voyageInfo, setVoyageInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await axios.get("http://localhost:8099/ticketss");
                setTickets(result.data);

                const voyageIds = result.data.map((ticket) => ticket.voyage.idv).join(',');
                const voyageResponse = await axios.get("http://localhost:8099/voyages", {
                    params: { ids: voyageIds },
                });
                const voyageData = {};
                voyageResponse.data.forEach((voyage) => {
                    voyageData[voyage.idv] = voyage;
                });
                setVoyageInfo(voyageData);
            } catch (error) {
                console.error("Error loading tickets:", error);
                toast.error("Error loading tickets");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const result = await axios.get("http://localhost:8099/tickets");
            setTickets(result.data);

            const voyageIds = result.data.map((ticket) => ticket.voyage.idv).join(',');
            const voyageResponse = await axios.get("http://localhost:8099/voyages", {
                params: { ids: voyageIds },
            });
            const voyageData = {};
            voyageResponse.data.forEach((voyage) => {
                voyageData[voyage.idv] = voyage;
            });
            setVoyageInfo(voyageData);
        } catch (error) {
            console.error("Error loading tickets:", error);
            toast.error("Error loading tickets");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTicket = async (id) => {
        try {
            await axios.delete(`http://localhost:8099/tickets/${id}`);
            loadTickets();
        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast.error("Error deleting ticket");
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const idString = ticket.id?.toString() || "";
        const depart = ticket.depart || "";
        const arrivee = ticket.arrivee || "";
        const prixString = ticket.prix?.toString() || "";

        return (
            idString.includes(searchKeyword) ||
            depart.includes(searchKeyword) ||
            arrivee.includes(searchKeyword) ||
            prixString.includes(searchKeyword)
        );
    });

    const parseDateTime = (dateTimeStr) => {
        return new Date(dateTimeStr);
    };

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const exportToExcel = () => {
        try {
            const data = tickets.map((ticket) => ({
                "Ticket ID": ticket.id,
                "Depart": ticket.depart,
                "Arrivee": ticket.arrivee,
                "Prix": ticket.prix,
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "tickets");
            XLSX.writeFile(wb, "ticketsList.xlsx");
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            toast.error("Error exporting to Excel");
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <br />
                    <div className="input-group mb-3">
                        <b>
                            <h5 style={{ margin: "0 15px 0 0" }}>Search : </h5>
                        </b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search tickets"
                            aria-label="Search tickets"
                            aria-describedby="search-icon"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-success" onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
                </button>
                <Link className="btn btn-primary" to="/addticket">
                    <FontAwesomeIcon icon={faPlusSquare} /> Add new ticket
                </Link>
            </div>
            <div className="py-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="table border shadow">
                        <thead>
                        <tr>
                            <th scope="col">Ticket ID</th>
                            <th scope="col">Departure Time</th>
                            <th scope="col">Arrival Time</th>
                            <th scope="col">Price</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.idt}>
                                <th scope="row">{ticket.idt}</th>
                                <td>
                                    <b>{voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].heuredepart
                                        ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv].heuredepart))} at ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv].heuredepart))}`
                                        : "N/A"}</b>
                                </td>
                                <td>
                                    <b>{voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].heurearrivee
                                        ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv].heurearrivee))} at ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv].heurearrivee))}`
                                        : "N/A"}</b>
                                </td>
                                <td>
                                    <b>{voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].prix
                                        ? voyageInfo[ticket.voyage.idv].prix +" DH"
                                        : "N/A"}</b>
                                </td>
                                <td>
                                    <Link className="btn btn-primary mx-2" to={`/viewticket/${ticket.idt}`}>
                                        <FontAwesomeIcon icon={faEye} /> View
                                    </Link>
                                    <Link className="btn btn-success mx-2" to={`/editticket/${ticket.idt}`}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </Link>
                                    <button className="btn btn-danger mx-2" onClick={() => deleteTicket(ticket.idt)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}








// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEdit, faTrash, faPlusSquare, faFileDownload } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { toast } from "react-toastify";
//
// export default function Tickets() {
//     const [tickets, setTickets] = useState([]);
//     const [searchKeyword, setSearchKeyword] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const result = await axios.get("http://localhost:8099/tickets");
//                 setTickets(result.data);
//             } catch (error) {
//                 console.error("Error loading tickets:", error);
//                 toast.error("Error loading tickets");
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchData();
//     }, []);
//
//     const deleteTicket = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8099/tickets/${id}`);
//             loadTickets();
//         } catch (error) {
//             console.error("Error deleting ticket:", error);
//             toast.error("Error deleting ticket");
//         }
//     };
//
//     const loadTickets = async () => {
//         setIsLoading(true);
//         try {
//             const result = await axios.get("http://localhost:8099/tickets");
//             setTickets(result.data);
//         } catch (error) {
//             console.error("Error loading tickets:", error);
//             toast.error("Error loading tickets");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const filteredTickets = tickets.filter((ticket) => {
//         const idString = ticket.idt?.toString() || "";
//         const depart = ticket.depart || "";
//         const arrivee = ticket.arrivee || "";
//         const prixString = ticket.prix?.toString() || "";
//
//         return (
//             idString.includes(searchKeyword) ||
//             depart.includes(searchKeyword) ||
//             arrivee.includes(searchKeyword) ||
//             prixString.includes(searchKeyword)
//         );
//     });
//
//     const exportToExcel = () => {
//         try {
//             const data = tickets.map((ticket) => ({
//                 "Ticket ID": ticket.idt,
//                 "Depart": ticket.depart,
//                 "Arrivee": ticket.arrivee,
//                 "Prix": ticket.prix,
//             }));
//             const ws = XLSX.utils.json_to_sheet(data);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "tickets");
//             XLSX.writeFile(wb, "ticketsList.xlsx");
//         } catch (error) {
//             console.error("Error exporting to Excel:", error);
//             toast.error("Error exporting to Excel");
//         }
//     };
//
//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                     <br />
//                     <div className="input-group mb-3">
//                         <b>
//                             <h5 style={{ margin: "0 15px 0 0" }}>Search : </h5>
//                         </b>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search tickets"
//                             aria-label="Search tickets"
//                             aria-describedby="search-icon"
//                             value={searchKeyword}
//                             onChange={(e) => setSearchKeyword(e.target.value)}
//                         />
//                     </div>
//                 </div>
//                 <button className="btn btn-success" onClick={exportToExcel}>
//                     <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
//                 </button>
//                 <Link className="btn btn-primary" to="/addticket">
//                     <FontAwesomeIcon icon={faPlusSquare} /> Add new ticket
//                 </Link>
//             </div>
//             <div className="py-4">
//                 {isLoading ? (
//                     <div>Loading...</div>
//                 ) : (
//                     <table className="table border shadow">
//                         <thead>
//                         <tr>
//                             <th scope="col">Ticket ID</th>
//                             <th scope="col">Depart</th>
//                             <th scope="col">Arrivee</th>
//                             <th scope="col">Prix</th>
//                             <th scope="col">Action</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {filteredTickets.map((ticket) => (
//                             <tr key={ticket.idt}>
//                                 <th scope="row">{ticket.idt}</th>
//                                 <td>{ticket.depart}</td>
//                                 <td>{ticket.arrivee}</td>
//                                 <td>{ticket.prix}</td>
//                                 <td>
//                                     <Link className="btn btn-primary mx-2" to={`/viewticket/${ticket.idt}`}>
//                                         <FontAwesomeIcon icon={faEye}/> View
//                                     </Link>
//                                     <Link className="btn btn-success mx-2" to={`/editticket/${ticket.idt}`}>
//                                         <FontAwesomeIcon icon={faEdit}/> Edit
//                                     </Link>
//                                     <button className="btn btn-danger mx-2" onClick={() => deleteTicket(ticket.idt)}>
//                                         <FontAwesomeIcon icon={faTrash}/> Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// }






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEdit, faTrash, faPlusSquare, faFileDownload } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { toast } from "react-toastify";
//
// export default function Tickets() {
//     const [tickets, setTickets] = useState([]);
//     const [searchKeyword, setSearchKeyword] = useState("");
//     const [voyageInfo, setVoyageInfo] = useState({});
//     const [isLoading, setIsLoading] = useState(true);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const result = await axios.get("http://localhost:8099/tickets");
//                 setTickets(result.data);
//
//                 const voyageIds = result.data.map((ticket) => ticket.voyage?.idv).join(',');
//                 const voyageResponse = await axios.get("http://localhost:8099/voyages", {
//                     params: { ids: voyageIds },
//                 });
//                 const voyageData = {};
//                 voyageResponse.data.forEach((voyage) => {
//                     voyageData[voyage.idv] = voyage;
//                 });
//                 setVoyageInfo(voyageData);
//             } catch (error) {
//                 console.error("Error loading tickets:", error);
//                 toast.error("Error loading tickets");
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchData();
//     }, []);
//
//     const loadTickets = async () => {
//         setIsLoading(true);
//         try {
//             const result = await axios.get("http://localhost:8099/tickets");
//             setTickets(result.data);
//
//             const voyageIds = result.data.map((ticket) => ticket.voyage?.idv).join(',');
//             const voyageResponse = await axios.get("http://localhost:8099/voyages", {
//                 params: { ids: voyageIds },
//             });
//             const voyageData = {};
//             voyageResponse.data.forEach((voyage) => {
//                 voyageData[voyage.idv] = voyage;
//             });
//             setVoyageInfo(voyageData);
//         } catch (error) {
//             console.error("Error loading tickets:", error);
//             toast.error("Error loading tickets");
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     const deleteTicket = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8099/tickets/${id}`);
//             loadTickets();
//         } catch (error) {
//             console.error("Error deleting ticket:", error);
//             toast.error("Error deleting ticket");
//         }
//     };
//
//     const filteredTickets = tickets.filter((ticket) => {
//         const idString = ticket.idt?.toString() || "";
//         const depart = ticket.depart || "";
//         const arrivee = ticket.arrivee || "";
//         const prixString = ticket.prix?.toString() || "";
//
//         return (
//             idString.includes(searchKeyword) ||
//             depart.includes(searchKeyword) ||
//             arrivee.includes(searchKeyword) ||
//             prixString.includes(searchKeyword)
//         );
//     });
//
//     const parseDateTime = (dateTimeStr) => {
//         return new Date(dateTimeStr);
//     };
//
//     const formatDate = (date) => {
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };
//
//     const formatTime = (date) => {
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         return `${hours}:${minutes}`;
//     };
//
//     const exportToExcel = () => {
//         try {
//             const data = tickets.map((ticket) => ({
//                 "Ticket ID": ticket.idt,
//                 "Depart": ticket.depart,
//                 "Arrivee": ticket.arrivee,
//                 "Prix": ticket.prix,
//             }));
//             const ws = XLSX.utils.json_to_sheet(data);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "tickets");
//             XLSX.writeFile(wb, "ticketsList.xlsx");
//         } catch (error) {
//             console.error("Error exporting to Excel:", error);
//             toast.error("Error exporting to Excel");
//         }
//     };
//
//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                     <br />
//                     <div className="input-group mb-3">
//                         <b>
//                             <h5 style={{ margin: "0 15px 0 0" }}>Search : </h5>
//                         </b>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search tickets"
//                             aria-label="Search tickets"
//                             aria-describedby="search-icon"
//                             value={searchKeyword}
//                             onChange={(e) => setSearchKeyword(e.target.value)}
//                         />
//                     </div>
//                 </div>
//                 <button className="btn btn-success" onClick={exportToExcel}>
//                     <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
//                 </button>
//                 <Link className="btn btn-primary" to="/addticket">
//                     <FontAwesomeIcon icon={faPlusSquare} /> Add new ticket
//                 </Link>
//             </div>
//             <div className="py-4">
//                 {isLoading ? (
//                     <div>Loading...</div>
//                 ) : (
//                     <table className="table border shadow">
//                         <thead>
//                         <tr>
//                             <th scope="col">Ticket ID</th>
//                             <th scope="col">Depart</th>
//                             <th scope="col">Arrivee</th>
//                             <th scope="col">Prix</th>
//                             <th scope="col">Action</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {filteredTickets.map((ticket) => (
//                             <tr key={ticket.idt}>
//                                 <th scope="row">{ticket.idt}</th>
//                                 <td>
//                                     {ticket.voyage && ticket.voyage.idv && voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].heuredepart
//                                         ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv].heuredepart))} ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv].heuredepart))}`
//                                         : "N/A"}
//                                 </td>
//                                 <td>
//                                     {ticket.voyage && ticket.voyage.idv && voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].heurearrivee
//                                         ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv].heurearrivee))} ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv].heurearrivee))}`
//                                         : "N/A"}
//                                 </td>
//                                 <td>
//                                     {ticket.voyage && ticket.voyage.idv && voyageInfo[ticket.voyage.idv] && voyageInfo[ticket.voyage.idv].prix
//                                         ? voyageInfo[ticket.voyage.idv].prix
//                                         : "N/A"}
//                                 </td>
//                                 <td>
//                                     <Link className="btn btn-primary mx-2" to={`/viewticket/${ticket.idt}`}>
//                                         <FontAwesomeIcon icon={faEye}/> View
//                                     </Link>
//                                     <Link className="btn btn-success mx-2" to={`/editticket/${ticket.idt}`}>
//                                         <FontAwesomeIcon icon={faEdit}/> Edit
//                                     </Link>
//                                     <button className="btn btn-danger mx-2" onClick={() => deleteTicket(ticket.idt)}>
//                                         <FontAwesomeIcon icon={faTrash}/> Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// }






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faEye, faEdit, faTrash, faPlusSquare, faFileDownload} from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import * as XLSX from "xlsx";
//
// export default function Tickets() {
//     // const [tickets, setTickets] = useState([]);
//     const [tickets, setTickets] = useState([]);
//     const [searchKeyword, setSearchKeyword] = useState("");
//     const [voyageInfo, setVoyageInfo] = useState({}); // Define state for Voyage information
//
//     useEffect(() => {
//         loadTickets();
//     }, []);
//
//     const loadTickets = async () => {
//         try {
//             const result = await axios.get("http://localhost:8099/ticketss");
//             setTickets(result.data);
//             const voyageIds = result.data.map((ticket) => ticket.voyage.idv).join(',');
//             const voyageResponse = await axios.get("http://localhost:8099/voyages", {
//                 params: { ids: voyageIds },
//             });
//             const voyageData = {};
//             voyageResponse.data.forEach((voyage) => {
//                 voyageData[voyage.idv] = voyage;
//             });
//             setVoyageInfo(voyageData);
//         } catch (error) {
//             console.error("Error loading tickets:", error);
//         }
//     };
//
//     const deleteTicket = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8099/tickets/${id}`);
//             loadTickets();
//         } catch (error) {
//             console.error("Error deleting ticket:", error);
//         }
//     };
//
//     const filteredTickets = tickets.filter((ticket) => {
//         const idString = ticket.id?.toString() || "";
//         const depart = ticket.depart || "";
//         const arrivee = ticket.arrivee || "";
//         const prixString = ticket.prix?.toString() || "";
//
//         return (
//             idString.includes(searchKeyword) ||
//             depart.includes(searchKeyword) ||
//             arrivee.includes(searchKeyword) ||
//             prixString.includes(searchKeyword)
//         );
//     });
//
//     const parseDateTime = (dateTimeStr) => {
//         return new Date(dateTimeStr);
//     };
//
//     const formatDate = (date) => {
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };
//
//     const formatTime = (date) => {
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         return `${hours}:${minutes}`;
//     };
//
//     const exportToExcel = () => {
//         const data = tickets.map((ticket) => ({
//             "Ticket ID": ticket.id,
//             "Depart": ticket.depart,
//             "Arrivee": ticket.arrivee,
//             "Prix": ticket.prix,
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "tickets");
//         XLSX.writeFile(wb, "ticketsList.xlsx");
//     };
//
//     return (
//         <div className="container">
//             <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                     <br />
//                     <div className="input-group mb-3">
//                         <b>
//                             <h5 style={{ margin: "0 15px 0 0" }}>Search : </h5>
//                         </b>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search tickets"
//                             aria-label="Search tickets"
//                             aria-describedby="search-icon"
//                             value={searchKeyword}
//                             onChange={(e) => setSearchKeyword(e.target.value)}
//                         />
//                     </div>
//                 </div>
//                 <button className="btn btn-success" onClick={exportToExcel}>
//                     <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
//                 </button>
//                 <Link className="btn btn-primary" to="/addticket">
//                     <FontAwesomeIcon icon={faPlusSquare} /> Add new ticket
//                 </Link>
//             </div>
//             <div className="py-4">
//                 <table className="table border shadow">
//                     <thead>
//                     <tr>
//                         <th scope="col">Ticket ID</th>
//                         <th scope="col">Depart</th>
//                         <th scope="col">Arrivee</th>
//                         <th scope="col">Prix</th>
//                         <th scope="col">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredTickets.map((ticket, index) => (
//                         <tr key={ticket.idt}>
//                             <th scope="row">{index + 1}</th>
//                             <td>
//                                 {voyageInfo[ticket.voyage.idv]?.heuredepart
//                                     ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv]?.heuredepart))} ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv]?.heuredepart))}`
//                                     : "N/A"}
//                             </td>
//                             <td>
//                                 {voyageInfo[ticket.voyage.idv]?.heurearrivee
//                                     ? `${formatDate(parseDateTime(voyageInfo[ticket.voyage.idv]?.heurearrivee))} ${formatTime(parseDateTime(voyageInfo[ticket.voyage.idv]?.heurearrivee))}`
//                                     : "N/A"}
//                             </td>
//                             <td>
//                                 {voyageInfo[ticket.voyage.idv]?.prix
//                                     ? voyageInfo[ticket.voyage.idv]?.prix
//                                     : "N/A"}
//                             </td>
//                             <td>
//                                 <Link className="btn btn-primary mx-2" to={`/viewticket/${ticket.idt}`}>
//                                     <FontAwesomeIcon icon={faEye} /> View
//                                 </Link>
//                                 <Link className="btn btn-success mx-2" to={`/editticket/${ticket.idt}`}>
//                                     <FontAwesomeIcon icon={faEdit} /> Edit
//                                 </Link>
//                                 <button className="btn btn-danger mx-2" onClick={() => deleteTicket(ticket.idt)}>
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
