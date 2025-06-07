import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import EventsList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ReservationsList from "./components/ReservationsList";
import ReservationsCalendar from "./components/ReservationsCalendar";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div>
          {/* <Breadcrumbs /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reservations" element={<ReservationsList />} />
            <Route path="/calendar" element={<ReservationsCalendar />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
