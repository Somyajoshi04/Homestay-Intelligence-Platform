import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div style={{ padding: "40px" }}>
        <h1>About Homestay Intelligence Platform</h1>

        <p>
          <p>
  Homestay Intelligence Platform helps homestay owners understand guest feedback using AI.
  It provides insights that help improve customer satisfaction and service quality.
</p>
        </p>
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default About;