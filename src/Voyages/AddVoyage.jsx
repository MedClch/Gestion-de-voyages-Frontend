import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddVoyage() {
    let navigate = useNavigate();
    const [voyage, setVoyage, setVoyages] = useState({
        lieudepart: "",
        lieuarrivee: "",
        heuredepart: "",
        heurearrivee: "",
        prix: 0.0,
    });

    const { lieudepart, lieuarrivee, heuredepart, heurearrivee, prix } = voyage;

    const onInputChange = (e) => {
        setVoyage({ ...voyage, [e.target.name]: e.target.value });
    };

    const loadAllVoyages = async () => {
        try {
            const result = await axios.get("http://localhost:8099/voyages");
            setVoyages(result.data);
        } catch (error) {
            toast.error("Error loading trips");
        }
    };

    const validateForm = () => {
        if (new Date(heurearrivee) <= new Date(heuredepart)) {
            toast.error("Arrival time must be greater than departure time.");
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const newVoyage = {
                lieudepart,
                lieuarrivee,
                heuredepart: new Date(heuredepart),
                heurearrivee: new Date(heurearrivee),
                prix,
            };

            await axios.post("http://localhost:8099/savevoyage", newVoyage);
            await loadAllVoyages();
            navigate("/voyages");
        } catch (error) {
            toast.error("Error saving new voyage!");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
                    <h2 className="text-center m-4">Add new voyage</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="lieudepart" className="form-label">
                                Departure Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="lieudepart"
                                value={lieudepart}
                                onChange={(e) => onInputChange(e)}
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
                                onChange={(e) => onInputChange(e)}
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
                                onChange={(e) => onInputChange(e)}
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
                                onChange={(e) => onInputChange(e)}
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
                                onChange={(e) => onInputChange(e)}
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










// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
//
// export default function AddVoyage() {
//     let navigate = useNavigate();
//     const [voyage, setVoyage, setVoyages] = useState({
//         lieudepart: "",
//         lieuarrivee: "",
//     });
//
//     const { lieudepart, lieuarrivee } = voyage;
//
//     const onInputChange = (e) => {
//         setVoyage({ ...voyage, [e.target.name]: e.target.value });
//     };
//
//     const loadAllVoyages = async () => {
//         try {
//             const result = await axios.get("http://localhost:8099/voyages");
//             setVoyages(result.data);
//         } catch (error) {
//             toast.error("Error loading trips");
//         }
//     };
//
//     const onSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost:8099/savevoyage", voyage);
//             await loadAllVoyages();
//             navigate("/Voyages");
//         } catch (error) {
//             toast.error("Error saving new voyage!");
//         }
//     };
//
//     return (
//         <div className="container">
//             <div className="row">
//                 <div className="col-md-6 offset-md-3 border rounded p-4 mt-2">
//                     <h2 className="text-center m-4">Add new voyage</h2>
//                     <form onSubmit={(e) => onSubmit(e)}>
//                         <div className="mb-3">
//                             <label htmlFor="lieudepart" className="form-label">
//                                 Departure Location
//                             </label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="lieudepart"
//                                 value={lieudepart}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="lieuarrivee" className="form-label">
//                                 Arrival Location
//                             </label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="lieuarrivee"
//                                 value={lieuarrivee}
//                                 onChange={(e) => onInputChange(e)}
//                             />
//                         </div>
//                         <button type="submit" className="btn btn-outline-primary">
//                             Submit
//                         </button>
//                         <Link type="submit" className="btn btn-outline-danger mx-2" to="/voyages">
//                             Cancel
//                         </Link>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }