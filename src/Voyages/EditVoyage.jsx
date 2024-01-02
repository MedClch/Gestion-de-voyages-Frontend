import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditVoyage() {
    let navigate = useNavigate();
    let { id } = useParams(); // Assuming the ID of the voyage is passed through the URL

    const [voyage, setVoyage] = useState({
        lieudepart: '',
        lieuarrivee: '',
        heuredepart: '',
        heurearrivee: '',
        prix: 0.0,
    });

    const { lieudepart, lieuarrivee, heuredepart, heurearrivee, prix } = voyage;

    useEffect(() => {
        loadVoyageDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadVoyageDetails = async () => {
        try {
            const result = await axios.get(`http://localhost:8099/voyages/${id}`);
            setVoyage(result.data);
        } catch (error) {
            toast.error('Error loading voyage details');
        }
    };

    const onInputChange = e => {
        setVoyage({ ...voyage, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (new Date(heurearrivee) <= new Date(heuredepart)) {
            toast.error('Arrival time must be greater than departure time.');
            return false;
        }
        return true;
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const updatedVoyage = {
                lieudepart,
                lieuarrivee,
                heuredepart: heuredepart,
                heurearrivee: heurearrivee,
                prix,
            };

            await axios.put(`http://localhost:8099/voyages/${id}`, updatedVoyage);
            navigate('/voyages');
        } catch (error) {
            toast.error('Error updating voyage');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Edit Voyage</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="lieudepart" className="form-label">
                                Departure Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="lieudepart"
                                value={lieudepart}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lieuarrivee" className="form-label">
                                Arrival Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="lieuarrivee"
                                value={lieuarrivee}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="heuredepart" className="form-label">
                                Departure Time
                            </label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="heuredepart"
                                value={heuredepart}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="heurearrivee" className="form-label">
                                Arrival Time
                            </label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                name="heurearrivee"
                                value={heurearrivee}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="prix" className="form-label">
                                Price
                            </label>
                            <input
                                type="number"
                                step="1.00"
                                className="form-control"
                                name="prix"
                                value={prix}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link to="/voyages" className="btn btn-outline-danger mx-2">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
