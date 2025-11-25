import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RequestDetail.module.css';

const RequestDetail = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No request ID provided');
      setLoading(false);
      return;
    }

    // Fetch request details
    axios.get(`http://localhost:8080/requests/${id}`)
      .then(requestResponse => {
        if (!requestResponse.data) throw new Error('No request data received');
        setRequest(requestResponse.data);

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching request:', error);
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    navigate(`/editrequest/${id}`, { state: { request } });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      axios
        .delete(`http://localhost:8080/requests/${id}`)   // ✅ URL FIXED
        .then(() => {
          alert('Request deleted successfully');
          navigate('/viewrequest', { replace: true });
        })
        .catch(error => {
          console.error('Error deleting request:', error);
          alert(
            `Failed to delete request: ${error.response?.data?.message || error.message
            }`
          );
        });
    }
  };


  const handleBack = () => {
    navigate('/viewrequest');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  if (loading) return <div className={styles.detailContainer}>Loading...</div>;
  if (error) return <div className={styles.detailContainer}>Error: {error}</div>;
  if (!request) return <div className={styles.detailContainer}>No request found</div>;

  return (
    <div className={styles.detailContainer}>
      <h3>Request Details</h3>

      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Service Type:</span>
          <span className={styles.detailValue}>
            {request.serviceId === 1 && 'Plumbing'}
            {request.serviceId === 2 && 'Electricity'}
            {request.serviceId === 3 && 'Garbage Collection'}
            {request.serviceId === 4 && 'Maintenance'}
            {request.serviceId === 5 && 'Cleaning'}
            {request.serviceId === 6 && 'Security'}
            {!request.serviceId && 'Not specified'}
          </span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>User ID:</span>
          <span className={styles.detailValue}>{request.userId}</span>
        </div>



        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Description:</span>
          <span className={styles.detailValue}>{request.description || 'Not provided'}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={`${styles.detailValue} ${styles[request.status?.toLowerCase()]}`}>
            {request.status || 'Unknown'}
          </span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Created Date:</span>
          <span className={styles.detailValue}>{formatDate(request.createDate)}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Expected Completion:</span>
          <span className={styles.detailValue}>{formatDate(request.exceptCompletionDate)}</span>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={handleEdit} className={styles.editButton}>Edit</button>
        <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
        <button onClick={handleBack} className={styles.backButton}>Back to Requests</button>
      </div>
    </div>
  );
};

export default RequestDetail;
