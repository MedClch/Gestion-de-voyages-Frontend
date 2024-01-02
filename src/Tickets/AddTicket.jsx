import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddTicket() {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        voyageId: "",
        clientId: "",
    });
    const [clients, setClients] = useState([]);
    const [voyages, setVoyages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const clientsResponse = await axios.get("http://localhost:8099/clients");
                const voyagesResponse = await axios.get("http://localhost:8099/voyages");
                setClients(clientsResponse.data);
                setVoyages(voyagesResponse.data);
            } catch (error) {
                toast.error("Error loading clients and voyages");
            }
        }
        fetchData();
    }, []);

    const loadAllTickets = async () => {
        try {
            const result = await axios.get("http://localhost:8099/tickets");
            // Do something with the result if needed
        } catch (error) {
            toast.error("Error loading tickets");
        }
    };

    const onInputChange = (e) => {
        setTicket({ ...ticket, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTicket = {
                voyageId: parseInt(ticket.voyageId),
                clientId: parseInt(ticket.clientId),
            };

            const response = await axios.post(`http://localhost:8099/savetickett?voyageId=${newTicket.voyageId}&clientId=${newTicket.clientId}`, newTicket, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                toast.success("Ticket saved successfully!");
                await loadAllTickets();
                navigate("/tickets");
            } else {
                toast.error("Error saving new ticket!");
            }
        } catch (error) {
            toast.error("Error saving new ticket!");
        }
    };





    // const onSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const newTicket = {
    //             voyageId: parseInt(ticket.voyageId),
    //             clientId: parseInt(ticket.clientId),
    //         };
    //
    //         const response = await axios.post("http://localhost:8099/saveticket", newTicket);
    //
    //         if (response.status === 201) {
    //             toast.success("Ticket saved successfully!");
    //             await loadAllTickets();
    //             navigate("/tickets");
    //         } else {
    //             toast.error("Error saving new ticket!");
    //         }
    //     } catch (error) {
    //         toast.error("Error saving new ticket!");
    //     }
    // };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Buy a new ticket</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="voyageId" className="form-label">
                                Select trip
                            </label>
                            <select
                                className="form-control"
                                name="voyageId"
                                value={ticket.voyageId}
                                onChange={onInputChange}
                            >
                                <option value="" disabled>
                                    -- Select trip --
                                </option>
                                {voyages.map((voyage) => (
                                    <option key={voyage.idv} value={voyage.idv}>
                                        {voyage.lieudepart} to {voyage.lieuarrivee}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="clientId" className="form-label">
                                Select client
                            </label>
                            <select
                                className="form-control"
                                name="clientId"
                                value={ticket.clientId}
                                onChange={onInputChange}
                            >
                                <option value="" disabled>
                                    -- Select client --
                                </option>
                                {clients.map((client) => (
                                    <option key={client.idc} value={client.idc}>
                                        {client.fullname} - {client.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link to="/tickets" className="btn btn-outline-danger mx-2">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}









// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
//
// export default function AddTicket() {
//     let navigate = useNavigate();
//     const [ticket, setTicket] = useState({
//         voyageId: "",
//         clientId: "",
//     });
//     const [clients, setClients] = useState([]);
//     const [voyages, setVoyages] = useState([]);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const clientsResponse = await axios.get("http://localhost:8099/clients");
//                 const voyagesResponse = await axios.get("http://localhost:8099/voyages");
//                 setClients(clientsResponse.data);
//                 setVoyages(voyagesResponse.data);
//             } catch (error) {
//                 toast.error("Error loading clients and voyages");
//             }
//         }
//         fetchData();
//     }, []);
//
//     const loadAllTickets = async () => {
//         try {
//             const result = await axios.get("http://localhost:8099/tickets");
//         } catch (error) {
//             toast.error("Error loading tickets");
//         }
//     };
//
//     const onInputChange = (e) => {
//         setTicket({ ...ticket, [e.target.name]: e.target.value });
//     };
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const newTicket = {
//                 voyageId: parseInt(ticket.voyageId),
//                 clientId: parseInt(ticket.clientId),
//             };
//             await axios.post("http://localhost:8099/saveticket", newTicket, {
//                 params: {
//                     voyageId: newTicket.voyageId,
//                     clientId: newTicket.clientId,
//                 },
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             await loadAllTickets();
//             navigate("/Tickets");
//             setTicket({
//                 voyageId: "",
//                 clientId: "",
//             });
//         } catch (error) {
//             toast.error("Error saving new ticket!");
//         }
//     };
//
//     return (
//         <div className="container">
//             <div className="row">
//                 <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
//                     <h2 className="text-center m-4">Buy a new ticket</h2>
//                     <form onSubmit={(e) => onSubmit(e)}>
//                         <div className="mb-3">
//                             <label htmlFor="voyageId" className="form-label">
//                                 Select trip
//                             </label>
//                             <select
//                                 className="form-control"
//                                 name="voyageId"
//                                 value={ticket.voyageId}
//                                 onChange={(e) => onInputChange(e)}
//                             >
//                                 <option value="" disabled>
//                                     -- Select trip --
//                                 </option>
//                                 {voyages.map((voyage) => (
//                                     <option key={voyage.idv} value={voyage.idv}>
//                                         {voyage.lieudepart} to {voyage.lieuarrivee}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="clientId" className="form-label">
//                                 Select client
//                             </label>
//                             <select
//                                 className="form-control"
//                                 name="clientId"
//                                 value={ticket.clientId}
//                                 onChange={(e) => onInputChange(e)}
//                             >
//                                 <option value="" disabled>
//                                     -- Select client --
//                                 </option>
//                                 {clients.map((client) => (
//                                     <option key={client.idc} value={client.idc}>
//                                         {client.fullname} - {client.username}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button type="submit" className="btn btn-outline-primary">
//                             Submit
//                         </button>
//                         <Link to="/tickets" className="btn btn-outline-danger mx-2">
//                             Cancel
//                         </Link>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }










// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
//
// export default function AddTicket() {
//     let navigate = useNavigate();
//     const [ticket, setTicket,setTickets] = useState({
//         depart: "",
//         arrivee: "",
//         prix: 0.0,
//         voyageId: "",
//         clientId: "",
//     });
//
//     const [clients, setClients] = useState([]);
//     const [voyages, setVoyages] = useState([]);
//
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const clientsResponse = await axios.get("http://localhost:8099/clients");
//                 const voyagesResponse = await axios.get("http://localhost:8099/voyages");
//                 setClients(clientsResponse.data);
//                 setVoyages(voyagesResponse.data);
//             } catch (error) {
//                 toast.error("Error loading clients and trips");
//             }
//         }
//         fetchData();
//     }, []);
//
//     const loadAllTickets = async () => {
//         try {
//             const result = await axios.get("http://localhost:8099/tickets");
//             setTickets(result.data);
//         } catch (error) {
//             toast.error("Error loading tickets");
//         }
//     };
//
//     const { depart, arrivee, prix, voyageId, clientId } = ticket;
//
//     const onInputChange = (e) => {
//         setTicket({ ...ticket, [e.target.name]: e.target.value });
//     };
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         if (new Date(arrivee) <= new Date(depart)) {
//             toast.error("Arrival time must be greater than departure time.");
//             return;
//         }
//         try {
//             await axios.post("http://localhost:8099/saveticket", ticket);
//             await loadAllTickets();
//             navigate("/tickets");
//         } catch (error) {
//             toast.error("Error saving new ticket!");
//         }
//     };
//
//     return (
//         <div className="container">
//             <div className="row">
//                 <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
//                     <h2 className="text-center m-4">Buy new ticket</h2>
//                     <form onSubmit={(e) => onSubmit(e)}>
//                         <div className="mb-3">
//                             <label htmlFor="depart" className="form-label">
//                                 Departure time
//                             </label>
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 name="depart"
//                                 value={depart}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="arrivee" className="form-label">
//                                 Arrival time
//                             </label>
//                             <input
//                                 type="datetime-local"
//                                 className="form-control"
//                                 name="arrivee"
//                                 value={arrivee}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="prix" className="form-label">
//                                 Price
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 className="form-control"
//                                 name="prix"
//                                 value={prix}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="voyageId" className="form-label">
//                                 Select trip
//                             </label>
//                             <select
//                                 className="form-control"
//                                 name="voyageId"
//                                 value={voyageId}
//                                 onChange={(e) => onInputChange(e)}
//                             >
//                                 <option value="" disabled>
//                                     -- Select trip --
//                                 </option>
//                                 {voyages.map((voyage) => (
//                                     <option key={voyage.idVoyage} value={voyage.idVoyage}>
//                                         {voyage.lieudepart} to {voyage.lieuarrivee}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="clientId" className="form-label">
//                                 Select client
//                             </label>
//                             <select
//                                 className="form-control"
//                                 name="clientId"
//                                 value={clientId}
//                                 onChange={(e) => onInputChange(e)}
//                             >
//                                 <option value="" disabled>
//                                     -- Select client --
//                                 </option>
//                                 {clients.map((client) => (
//                                     <option key={client.id} value={client.id}>
//                                         {client.fullname} {client.username}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button type="submit" className="btn btn-outline-primary">
//                             Submit
//                         </button>
//                         <Link type="submit" className="btn btn-outline-danger mx-2" to="/tickets">
//                             Cancel
//                         </Link>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }
