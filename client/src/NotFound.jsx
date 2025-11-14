import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound-container">

      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-title">Page Not Found</p>

        <p className="notfound-text">
          The page you are looking for doesn't exist or may have moved.
        </p>

        <div className="notfound-buttons">
          <Link to="/" className="btn back-btn">
            ← Go Home
          </Link>

          <Link to="/about" className="btn subtle">
            About Project
          </Link>
        </div>
      </div>
    </div>
  );
}
