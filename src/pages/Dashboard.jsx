import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/ui/Loader";
import Toast from "../components/ui/Toast";
import { api } from "../services/api";

function Dashboard({ darkMode, setDarkMode }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reviewsData, statsData] = await Promise.all([
        api.getReviews(),
        api.getStats()
      ]);
      
      setReviews(reviewsData.data);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div
        style={{
          padding: "40px",
          minHeight: "60vh",
        }}
      >
        <h1
          style={{
            color: darkMode ? "white" : "black",
            marginBottom: "20px",
          }}
        >
          Dashboard
        </h1>

        {error && (
          <Toast 
            message={`Error: ${error}`} 
          />
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {stats && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                  marginBottom: "40px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>Total Reviews</h3>
                  <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                    {stats.totalReviews}
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>Average Rating</h3>
                  <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                    {stats.averageRating}/5
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>Positive</h3>
                  <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                    {stats.sentimentCounts.positive}
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>Negative</h3>
                  <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
                    {stats.sentimentCounts.negative}
                  </p>
                </div>
              </div>
            )}

            <h2
              style={{
                color: darkMode ? "white" : "black",
                marginBottom: "20px",
              }}
            >
              Recent Reviews
            </h2>

            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>{review.guestName}</strong>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        backgroundColor:
                          review.sentiment === "positive"
                            ? "#10b981"
                            : review.sentiment === "negative"
                            ? "#ef4444"
                            : "#6b7280",
                        color: "white",
                      }}
                    >
                      {review.sentiment}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 10px 0" }}>{review.text}</p>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "14px",
                      color: darkMode ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    <span>Rating: {review.rating}/5</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                  {review.themes.length > 0 && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {review.themes.map((theme) => (
                        <span
                          key={theme}
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            backgroundColor: darkMode ? "#374151" : "#e5e7eb",
                          }}
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default Dashboard;