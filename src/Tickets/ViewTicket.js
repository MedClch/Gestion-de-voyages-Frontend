import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ViewTicket() {
    const { id } = useParams();
    const [ticket, setTicket] = useState({});
    const [voyageInfo, setVoyageInfo] = useState({});

    useEffect(() => {
        loadTicket();
    }, []);

    const loadTicket = async () => {
        try {
            const result = await axios.get(`http://localhost:8099/tickets/${id}`);
            setTicket(result.data);

            const voyageResponse = await axios.get(`http://localhost:8099/voyages/${result.data.voyage.idv}`);
            setVoyageInfo(voyageResponse.data);
        } catch (error) {
            console.error('Error loading ticket:', error);
        }
    };

    const formatDate = dateTime => {
        const formattedDate = new Date(dateTime);
        return formattedDate.toLocaleString();
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">View Ticket Information</h2>
                    <div className="card">
                        <div className="card-header">
                            <b>
                                <i style={{ textDecoration: 'underline' }}>Details of Ticket ID: {id}</i>
                            </b>
                            <br />
                            <br />
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>Departure Time: </b>
                                    <b>
                                        {voyageInfo.heuredepart ? formatDate(voyageInfo.heuredepart) : 'N/A'}
                                    </b>
                                </li>
                                <li className="list-group-item">
                                    <b>Arrival Time: </b>
                                    <b>
                                        {voyageInfo.heurearrivee ? formatDate(voyageInfo.heurearrivee) : 'N/A'}
                                    </b>
                                </li>
                                <li className="list-group-item">
                                    <b>Price: </b>
                                    <b>{voyageInfo.prix ? voyageInfo.prix : 'N/A'}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link to="/tickets" className="btn btn-primary my-2">
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back to Ticket List
                    </Link>
                </div>
            </div>
        </div>
    );
}
