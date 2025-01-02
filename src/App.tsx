import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Write from "./pages/Write";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import Boilerplate from "./pages/tools/Boilerplate";
import CTA from "./pages/tools/CTA";
import Headline from "./pages/tools/Headline";
import Quote from "./pages/tools/Quote";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/write" element={<Write />} />
        <Route path="/write/:id" element={<Write />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/tools/boilerplate" element={<Boilerplate />} />
        <Route path="/tools/cta" element={<CTA />} />
        <Route path="/tools/headline" element={<Headline />} />
        <Route path="/tools/quote" element={<Quote />} />
      </Routes>
    </Router>
  );
}

export default App;