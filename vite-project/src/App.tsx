import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FlightList from "./components/FlightList";
import FlightDetails from "./components/FlightDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/flights" element={<FlightList />} />
        <Route path="/flights/:id" element={<FlightDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
