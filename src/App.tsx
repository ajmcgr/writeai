import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Index from "./pages/Index";
import Write from "./pages/Write";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Boilerplate from "./pages/tools/Boilerplate";
import Headline from "./pages/tools/Headline";
import Quote from "./pages/tools/Quote";
import CTA from "./pages/tools/CTA";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/write" element={<Write />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/tools/boilerplate" element={<Boilerplate />} />
        <Route path="/tools/headline" element={<Headline />} />
        <Route path="/tools/quote" element={<Quote />} />
        <Route path="/tools/cta" element={<CTA />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;