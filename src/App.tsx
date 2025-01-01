import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Boilerplate from "./pages/tools/Boilerplate";
import Headline from "./pages/tools/Headline";
import Quote from "./pages/tools/Quote";
import CTA from "./pages/tools/CTA";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/help" element={<Help />} />
        <Route path="/tools/boilerplate" element={<Boilerplate />} />
        <Route path="/tools/headline" element={<Headline />} />
        <Route path="/tools/quote" element={<Quote />} />
        <Route path="/tools/cta" element={<CTA />} />
      </Routes>
    </Router>
  );
}

export default App;