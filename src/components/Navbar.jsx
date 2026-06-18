import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
      flexWrap: "wrap",
      background: "#2563eb",
      color: "white"
    }}>
      <h2>Homestay-Intelligence-Platform</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        <Link to="/about" style={{ color: "white" }}>About</Link>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link to="/login" style={{ color: "white" }}>Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;