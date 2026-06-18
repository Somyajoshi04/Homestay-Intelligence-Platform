import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        <h1>Dashboard</h1>

        <p>
          Review analytics and insights will be displayed here.
        </p>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;