function Footer({ darkMode }) {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        background: darkMode ? "#111827" : "#dbeafe",
        color: darkMode ? "white" : "black",
        marginTop: "40px",
      }}
    >
      <p>© 2026 Homestay Intelligence Platform</p>
      <p>Built by Somya Joshi</p>
    </footer>
  );
}

export default Footer;