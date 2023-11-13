import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ViewVoyage() {
    const { id } = useParams();
    const [voyage, setVoyage] = useState({
        lieudepart: '',
        lieuarrivee: '',
        heuredepart: '',
        heurearrivee: '',
        prix: 0.0,
    });

    useEffect(() => {
        const loadVoyage = async () => {
            try {
                const response = await axios.get(`http://localhost:8099/voyages/${id}`);
                setVoyage(response.data);
            } catch (error) {
                console.error('Error loading voyage details:', error.message);
            }
        };

        loadVoyage();
    }, [id]);


    const formatDate = (date) => {
        const formattedDate = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDateString = formattedDate.toLocaleDateString(undefined, options);
        const formattedTimeString = formattedDate.toLocaleTimeString();
        return `Le ${formattedDateString} à ${formattedTimeString}`;
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">View voyage information</h2>
                    <div className="card">
                        <div className="card-header">
                            <b>
                                <i style={{ textDecoration: 'underline' }}>Details of voyage N°{id} :</i>
                            </b>
                            <br />
                            <br />
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>Departure Location: </b>
                                    <b>{voyage.lieudepart}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Arrival Location: </b>
                                    <b>{voyage.lieuarrivee}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Departure Time: </b>
                                    <b>{formatDate(voyage.heuredepart)}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Arrival Time: </b>
                                    <b>{formatDate(voyage.heurearrivee)}</b>
                                </li>
                                <li className="list-group-item">
                                    <b>Price: </b>
                                    <b>{voyage.prix} DH</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link to="/voyages" className="btn btn-primary my-2">
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back to list
                    </Link>
                </div>
            </div>
        </div>
    );
}
