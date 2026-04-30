import { useLocation, useNavigate } from "react-router-dom";

function CollegeDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const college = location.state;

  if (!college) {
    return (
      <div style={styles.container}>
        <h2>No college data found</h2>
        <button style={styles.button} onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>🎓 College Finder</div>

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>

        <div style={styles.card}>
          <h1 style={styles.title}>{college.name}</h1>

          <p>📍 <b>Location:</b> {college.location}</p>
          <p>💰 <b>Fees:</b> ₹{college.fees}</p>
          <p>⭐ <b>Rating:</b> {college.rating}</p>
          <p>📊 <b>Placement:</b> {college.placement}%</p>

          <hr style={styles.hr} />

          <h2 style={styles.section}>Courses</h2>
          <ul>
            <li>B.Tech</li>
            <li>M.Tech</li>
            <li>MBA</li>
          </ul>

          <h2 style={styles.section}>Placements</h2>
          <p>Top companies: Google, Microsoft, Amazon</p>

          <h2 style={styles.section}>Reviews</h2>
          <p>⭐ 4.5 - Very good college with strong placements</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(to right, #eef2ff, #f8fafc)",
    minHeight: "100vh",
  },
  navbar: {
    background: "#1e3a8a",
    color: "white",
    padding: "15px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    marginBottom: "15px",
  },
  section: {
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  button: {
    background: "#2563eb",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backBtn: {
    marginBottom: "15px",
    background: "#e5e7eb",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  hr: {
    margin: "20px 0",
  },
};

export default CollegeDetail;