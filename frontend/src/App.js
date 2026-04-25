import React, { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const[name, setName] = useState("");
  const[image, setImage] = useState(null);

useEffect(() => {
  const fetchData = () => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  };

  fetchData(); // initial load

  const interval = setInterval(fetchData, 5000); // every 3 sec

  return () => clearInterval(interval); // cleanup
}, []);


const handleUpload = async () => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);

  try {
    const res = await fetch("http://localhost:5000/add-face", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

const total = events.length;
const known = events.filter(e => e.status === "known").length;
const unknown = total - known;

return (
  <>

    <div style={{ marginBottom: "20px" },{textAlign:"center"}}>
      <h1>Add New Face</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
       styles={styles.input}
        type="file"
        onChange={(e) => setImage(e.target.files[0])}/>

      <button style={styles.button} onClick={handleUpload}>
        Upload
      </button>
    </div>
    <div style={styles.container}>
      <h1 style={styles.heading}>Smart Surveillance Dashboard</h1>
<div style={styles.statsContainer}>
  <div style={{ ...styles.card, backgroundColor: "#3498db" }}>
    <h3>Total</h3>
    <p>{total}</p>
  </div>

  <div style={{ ...styles.card, backgroundColor: "#2ecc71" }}>
    <h3>Known</h3>
    <p>{known}</p>
  </div>

  <div style={{ ...styles.card, backgroundColor: "#e74c3c" }}>
    <h3>Unknown</h3>
    <p>{unknown}</p>
  </div>
</div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.cell}>ID</th>
            <th style={styles.cell}>Name</th>
            <th style={styles.cell}>Status</th>
            <th style={styles.cell}>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr key={event.id} style={styles.cell}>
              <td style={styles.cell}>{event.id}</td>
              <td style={styles.cell}>{event.name}</td>

              <td
                style={{
                  color: event.status === "known" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {event.status}
              </td>

              <td>{new Date(event.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
  padding: "8px 15px",
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
},
input: {
  margin: "5px",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc"
},
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  cell: {
    padding: "19px",
    borderBottom: "2px solid #ddd",
  },
  statsContainer: {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "20px",
},

card: {
  flex: 1,
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
}
};

export default App;