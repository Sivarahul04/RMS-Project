import React, { useEffect, useState } from "react";
import styles from "./ViewRequest.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewRequest = () => {
  const userId = parseInt(localStorage.getItem("userId"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/requests/user/${userId}`)
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  const handleSubmit = (selectedRequest) => {
    navigate(`/requestdetail/${selectedRequest.requestId}`, {
      state: { request: selectedRequest },
    });
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>View My Requests</h3>
      {requests.length === 0 ? (
        <p className={styles.noRequests}>No requests yet.</p>
      ) : (
        <ul className={styles.list}>
          {requests.map((req) => (
            <li key={req.requestId} className={styles.listItem}>
              <p>
                <strong>Service ID:</strong> {req.serviceId}
              </p>
              <p>
                <strong>Service Name:</strong>{" "}
                {req.serviceId === 1? "Plumbing"
                  : req.serviceId === 2
                  ? "Electricity"
                  : req.serviceId === 3
                  ? "Garbage Collection"
                  : req.serviceId === 4
                  ? "Maintenance"
                  : req.serviceId === 5
                  ? "Cleaning"
                  : req.serviceId === 6
                  ? "Security"
                  : "Unknown"}
              </p>

              <p>
                <strong>Description:</strong> {req.description}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>
              <button type="button" onClick={() => handleSubmit(req)}>
                View Request Detail
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        className={styles.back}
        onClick={() => navigate("/userdashboard")}
      >
        Back to Dashoard
      </button>
    </div>
  );
};

export default ViewRequest;
