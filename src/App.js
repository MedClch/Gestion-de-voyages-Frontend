import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "./Layout/Navbar";
import Clients from "./Pages/Clients";
import AddClient from "./Clients/AddClient";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import EditClient from "./Clients/EditClient";
import ViewClient from "./Clients/ViewClient";
import Login from "./Clients/Login";
import Register from "./Clients/Register";
import Tickets from "./Pages/Tickets";
import Voyages from "./Pages/Voyages";
import AddTicket from "./Tickets/AddTicket";
import EditTicket from "./Tickets/EditTicket";
import ViewTicket from "./Tickets/ViewTicket";
import AddVoyage from "./Voyages/AddVoyage";
import EditVoyage from "./Voyages/EditVoyage";
import ViewVoyage from "./Voyages/ViewVoyage";

export default function App() {
  return (
      <div className="App">
        <Router>
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Clients/>}></Route>
            <Route path="/Tickets" element={<Tickets/>}></Route>
            <Route path="/Voyages" element={<Voyages/>}></Route>
            <Route path="/addclient" element={<AddClient/>}></Route>
            <Route path="/editclient/:id" element={<EditClient/>}></Route>
            <Route path="/viewclient/:id" element={<ViewClient/>}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/addticket" element={<AddTicket/>}></Route>
            <Route path="/editticket/:id" element={<EditTicket/>}></Route>
            <Route path="/viewticket/:id" element={<ViewTicket/>}></Route>
            <Route path="/addvoyage" element={<AddVoyage/>}></Route>
            <Route path="/editvoyage/:id" element={<EditVoyage/>}></Route>
            <Route path="/viewvoyage/:id" element={<ViewVoyage/>}></Route>
          </Routes>
        </Router>
      </div>
  );
}
