export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-auto border-t border-blue-950">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-blue-200">
          &copy; {new Date().getFullYear()} National Community of Philatelists. All rights reserved.
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex space-x-6 text-sm">
            <li>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
