import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RoutesPage from "./pages/RoutesPage";
import RouteDetailPage from "./pages/RouteDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/routes" element={<RoutesPage />} />
      <Route path="/route/:id" element={<RouteDetailPage />} />
    </Routes>
  );
}

export default App;
