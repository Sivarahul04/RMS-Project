import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SuperAdminReports.module.css';

const SuperAdminReports = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelayed, setShowDelayed] = useState(false);

  useEffect(() => {
  
    axios.get('http://localhost:8080/requests/data')
      .then(requestsRes => {
        setRequests(requestsRes.data);

    
        return axios.get('http://localhost:8080/users/data');
      })
      .then(usersRes => {
        setUsers(usersRes.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.container}>Loading reports...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  const totalRequests = requests.length;
  const completedRequests = requests.filter(req => req.status === 'Completed').length;
  const pendingRequests = requests.filter(req => req.status === 'Pending').length;
  const totalResidents = users.filter(user => user.role === 'Resident').length;

  const delayedRequests = requests.filter(req => {
    if (req.status === 'Pending') {
      const createdDate = new Date(req.createDate);
      const now = new Date();
      const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
      return diffDays > 2;
    }
    return false;
  });

  return (
    <div className={styles.container}>
      <h2>Super Admin Reports</h2>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h4>Total Requests</h4>
          <p>{totalRequests}</p>
        </div>
        <div className={styles.card}>
          <h4>Completed</h4>
          <p>{completedRequests}</p>
        </div>
        <div className={styles.card}>
          <h4>Pending</h4>
          <p>{pendingRequests}</p>
        </div>
        <div className={styles.card}>
          <h4>Total Residents</h4>
          <p>{totalResidents}</p>
        </div>
      </div>

      <div className={styles.delayedSection}>
        <h3>Delayed Requests ({delayedRequests.length})</h3>
        <button 
          onClick={() => setShowDelayed(!showDelayed)} 
          className={styles.toggleButton}
        >
          {showDelayed ? 'Hide Delayed Requests' : 'Show Delayed Requests'}
        </button>

        {showDelayed && delayedRequests.length > 0 && (
          <table className={styles.delayedTable}>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>User ID</th>
                <th>Service ID</th>
                <th>Created Date</th>
                <th>Days Pending</th>
              </tr>
            </thead>
            <tbody>
              {delayedRequests.map(req => {
                const createdDate = new Date(req.createDate);
                const now = new Date();
                const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={req.requestId}>
                    <td>{req.requestId}</td>
                    <td>{req.userId}</td>
                    <td>{req.serviceId}</td>
                    <td>{createdDate.toLocaleDateString()}</td>
                    <td>{diffDays}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {showDelayed && delayedRequests.length === 0 && (
          <p>No delayed requests found.</p>
        )}
      </div>

  
      <div className={styles.userStats}>
        <h3>User Statistics</h3>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Super Admin</td>
              <td>{users.filter(u => u.role === 'Super Admin').length}</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>{users.filter(u => u.role === 'Admin').length}</td>
            </tr>
            <tr>
              <td>Resident</td>
              <td>{users.filter(u => u.role === 'Resident').length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminReports;
