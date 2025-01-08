import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
              <li><a href="https://blog.works.xyz/" className="text-gray-600 hover:text-gray-900">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/boilerplate" className="text-gray-600 hover:text-gray-900">Boilerplate Generator</Link></li>
              <li><Link to="/tools/headline" className="text-gray-600 hover:text-gray-900">Headline Generator</Link></li>
              <li><Link to="/tools/quote" className="text-gray-600 hover:text-gray-900">Quote Generator</Link></li>
              <li><Link to="/tools/cta" className="text-gray-600 hover:text-gray-900">CTA Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://x.com/trywriteai" className="text-gray-600 hover:text-gray-900">Follow on X</a></li>
              <li><a href="mailto:support@trywrite.ai" className="text-gray-600 hover:text-gray-900">Email Support</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            Copyright © 2025 Works App, Inc. A <a href="https://www.works.xyz/" className="hover:text-gray-900">Works</a> product
          </p>
        </div>
      </div>
    </footer>
  );
};