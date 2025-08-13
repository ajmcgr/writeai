import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-inter font-medium mb-4 text-base">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-900 hover:text-gray-700 text-sm">About</Link></li>
              <li><a href="https://blog.works.xyz/" className="text-gray-900 hover:text-gray-700 text-sm">Blog</a></li>
              <li><a href="https://discord.gg/TZsd4cR7" className="text-gray-900 hover:text-gray-700 text-sm">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-medium mb-4 text-base">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-900 hover:text-gray-700 text-sm">Support</Link></li>
              <li><Link to="/terms" className="text-gray-900 hover:text-gray-700 text-sm">Terms</Link></li>
              <li><Link to="/privacy" className="text-gray-900 hover:text-gray-700 text-sm">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-medium mb-4 text-base">Free Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/press-release-builder" className="text-gray-900 hover:text-gray-700 text-sm">Press Release Builder</Link></li>
              <li><Link to="/tools/pitch-personalizer" className="text-gray-900 hover:text-gray-700 text-sm">Pitch Personalizer</Link></li>
              <li><Link to="/tools/crisis-response" className="text-gray-900 hover:text-gray-700 text-sm">Crisis Response Generator</Link></li>
              <li><Link to="/tools/headline-analyzer" className="text-gray-900 hover:text-gray-700 text-sm">Headline Analyzer</Link></li>
              <li><Link to="/tools/launch-timeline" className="text-gray-900 hover:text-gray-700 text-sm">Launch Timeline Planner</Link></li>
              <li><Link to="/tools/boilerplate" className="text-gray-900 hover:text-gray-700 text-sm">Boilerplate Generator</Link></li>
              <li><Link to="/tools/headline" className="text-gray-900 hover:text-gray-700 text-sm">Headline Generator</Link></li>
              <li><Link to="/tools/quote" className="text-gray-900 hover:text-gray-700 text-sm">Quote Generator</Link></li>
              <li><Link to="/tools/cta" className="text-gray-900 hover:text-gray-700 text-sm">CTA Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-medium mb-4 text-base">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://x.com/trywriteai" className="text-gray-900 hover:text-gray-700 text-sm">X</a></li>
              <li><a href="https://www.linkedin.com/company/102985648/a" className="text-gray-900 hover:text-gray-700 text-sm">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8">
          <p className="text-center text-gray-600 text-sm">
            Copyright © 2025 Works App, Inc. Built with ♥️ by <a href="https://works.xyz/" className="hover:text-gray-900">Works</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};