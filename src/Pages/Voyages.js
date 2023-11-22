import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faPlusSquare, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Voyages() {
    const [voyages, setVoyages] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        loadVoyages();
    }, []);

    const loadVoyages = async () => {
        try {
            const result = await axios.get("http://localhost:8099/voyages");
            setVoyages(result.data);
        } catch (error) {
            console.error("Error loading voyages:", error);
        }
    }

    const deleteVoyage = async (id) => {
        try {
            await axios.delete(`http://localhost:8099/voyages/${id}`);
            loadVoyages();
        } catch (error) {
            console.error("Error deleting voyage:", error);
        }
    }

    const filteredVoyages = voyages.filter((voyage) => {
        const idString = voyage.id?.toString() || "";
        const ldepart = voyage.lieudepart || "";
        const larrivee = voyage.lieuarrivee || "";
        const hdepart = voyage.heuredepart || "";
        const harrivee = voyage.heurearrivee || "";
        const prixString = voyage.prix?.toString() || "";

        return (
            idString.includes(searchKeyword) ||
            ldepart.includes(searchKeyword) ||
            larrivee.includes(searchKeyword) ||
            hdepart.includes(searchKeyword) ||
            harrivee.includes(searchKeyword) ||
            prixString.includes(searchKeyword)
        );
        // voyage.lieudepart.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        // voyage.lieuarrivee.toLowerCase().includes(searchKeyword.toLowerCase())
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
        const data = voyages.map((voyage) => ({
            "Voyage ID": voyage.idVoyage,
            "Departure Location": voyage.lieudepart,
            "Arrival Location": voyage.lieuarrivee,
            "Departure Time": voyage.heuredepart,
            "Arrival Time": voyage.heurearrivee,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Voyages");
        XLSX.writeFile(wb, "VoyagesList.xlsx");
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
                            placeholder="Search voyages"
                            aria-label="Search voyages"
                            aria-describedby="search-icon"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-success" onClick={exportToExcel}>
                    <FontAwesomeIcon icon={faFileDownload} /> Export to Excel
                </button>
                <Link className="btn btn-primary" to="/addvoyage">
                    <FontAwesomeIcon icon={faPlusSquare} /> Add new voyage
                </Link>
            </div>

            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                    <tr>
                        <th scope="col">Voyage ID</th>
                        <th scope="col">Departure Location</th>
                        <th scope="col">Arrival Location</th>
                        <th scope="col">Departure Time</th>
                        <th scope="col">Arrival Time</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredVoyages.map((voyage, index) => (
                        <tr key={voyage.idv}>
                            <th scope="row">{index + 1}</th>
                            <td>{voyage.lieudepart}</td>
                            <td>{voyage.lieuarrivee}</td>
                            <td>{formatDate(parseDateTime(voyage.heuredepart))} {formatTime(parseDateTime(voyage.heuredepart))}</td>
                            <td>{formatDate(parseDateTime(voyage.heurearrivee))} {formatTime(parseDateTime(voyage.heurearrivee))}</td>
                            <td>
                                <Link className="btn btn-primary mx-2" to={`/viewvoyage/${voyage.idv}`}>
                                    <FontAwesomeIcon icon={faEye} /> View
                                </Link>
                                <Link className="btn btn-success mx-2" to={`/editvoyage/${voyage.idv}`}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </Link>
                                <button className="btn btn-danger mx-2" onClick={() => deleteVoyage(voyage.idv)}>
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
