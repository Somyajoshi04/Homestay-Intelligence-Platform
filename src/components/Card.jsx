function Card({ title, description }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px"
    }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Card;