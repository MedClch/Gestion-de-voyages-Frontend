import React from "react";
import {Link} from "react-router-dom";

export default function Navbar(){
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to={"/"}><b>Projet A.D.C</b></Link>
                    <Link className="navbar-brand" to={"/Voyages"}><b>Voyages</b></Link>
                    <Link className="navbar-brand" to={"/Tickets"}><b>Tickets</b></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/*<Link className="btn btn-outline-light" to="/adduser"><FontAwesomeIcon icon={faPlusSquare} /> Add new user</Link>*/}
                </div>
            </nav>
        </div>
    )
}