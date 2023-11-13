import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditTicket() {
    const navigate = useNavigate();
    const { id } = useParams();

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
                const ticketResponse = await axios.get(`http://localhost:8099/tickets/${id}`);
                console.log("Ticket Response:", ticketResponse.data);
                const editedTicket = ticketResponse.data;
                console.log("Edited Ticket Data:", editedTicket);
                setTicket({
                    voyageId: editedTicket.voyage ? editedTicket.voyage.idv : "",
                    clientId: editedTicket.client ? editedTicket.client.idc : "",
                });
            } catch (error) {
                toast.error("Error loading data");
            }
        }
        fetchData();
    }, [id]);

    const onInputChange = (e) => {
        setTicket({ ...ticket, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedTicket = {
                voyageId: parseInt(ticket.voyageId),
                clientId: parseInt(ticket.clientId),
            };
            await axios.put(`http://localhost:8099/tickets/${id}`, updatedTicket, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate("/Tickets");
        } catch (error) {
            toast.error("Error updating the ticket");
        }
    };
    if (!voyages || voyages.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Edit Ticket</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="voyageId" className="form-label">
                                Select trip
                            </label>
                            <select
                                className="form-control"
                                name="voyageId"
                                value={ticket.voyageId}
                                onChange={(e) => onInputChange(e)}
                            >
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
                                onChange={(e) => onInputChange(e)}
                            >
                                {clients.map((client) => (
                                    <option key={client.idc} value={client.idc}>
                                        {client.fullname} - {client.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Update
                        </button>
                        <button onClick={() => navigate("/Tickets")} className="btn btn-outline-danger mx-2">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
