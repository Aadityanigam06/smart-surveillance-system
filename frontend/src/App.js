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



return (
  <>
    <div style={{ marginBottom: "20px" }}>
      <h3>Add New Face</h3>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
    <div style={styles.container}>
      <h1 style={styles.heading}>Smart Surveillance Dashboard</h1>

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
  }
};

export default App;