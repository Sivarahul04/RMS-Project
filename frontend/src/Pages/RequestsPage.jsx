import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './RequestsPage.module.css';

const RequestsPage = () => {
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  useEffect(() => {
    axios.get('http://localhost:8080/requests/reqdata')
      .then(res => {
        const allRequests = res.data;
          console.log("API response:", res.data); 

        if (statusFilter) {
          const filtered = allRequests.filter(r => r.status === statusFilter);
          setFilteredRequests(filtered);
        } else {
          setFilteredRequests(allRequests);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [statusFilter]);

  if (loading) return <div className={styles.container}>Loading requests...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Requests {statusFilter && `(Status: ${statusFilter})`}</h2>
      {filteredRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Resident Name</th>
              <th>Request Type</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.residentName}</td>
                <td>{request.requestType}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsPage;
