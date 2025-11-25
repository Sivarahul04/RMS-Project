import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManageRequest.module.css';
import { useNavigate } from 'react-router-dom';

const ManageRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('http://localhost:8080/requests/data')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        setError('Failed to load requests');
      });
  };

  const handleStatusUpdate = (id, status) => {
    axios.put(`http://localhost:8080/requests/${id}/${status}`)
      .then(response => {
        setRequests(requests.map(req => 
          req.requestId === id ? response.data : req
        ));
        console.log(response.data);
        
        setSuccess(`Request #${id} updated to ${status}`);
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(error => {
        setError('Failed to update request status');
        setTimeout(() => setError(''), 3000);
      });
  };

  const getServiceName = (serviceId) => {
    const services = {
      1: 'Plumbing',
      2: 'Electricity',
      3: 'Garbage',
      4: 'Maintenance',
      5: 'Cleaning',
      6: 'Security'
    };
    return services[serviceId] || `Service ${serviceId}`;
  };

  return (
    <div className={styles.container}>
      <h2>Manage Service Requests</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.requestList}>
        {requests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          requests.map(request => (
            <div key={request.requestId} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>Request {request.requestId}</h3>
                <span className={`${styles.status} ${styles[request.status]}`}>
                  {request.status}
                </span>
              </div>
              
              <div className={styles.requestDetails}>
                <p><strong>User ID:</strong> {request.userId}</p>
                <p><strong>Service:</strong> {getServiceName(request.serviceId)}</p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Submitted:</strong> {new Date(request.createDate).toLocaleString()}</p>
              </div>

              <div className={styles.requestActions}>
                {request.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(request.requestId, 'In Progress')}
                      className={styles.actionButton}
                    >
                      Start Progress
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(request.requestId, 'Cancelled')}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </>
                )}
                {request.status === 'In Progress' && (
                  <button 
                    onClick={() => handleStatusUpdate(request.requestId, 'Completed')}
                    className={styles.actionButton}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
       <button onClick={() => navigate('/admindashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default ManageRequest;