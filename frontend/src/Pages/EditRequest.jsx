import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './EditRequest.module.css';

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    serviceId: '',
    description: '',
    status: '',
    createDate: '',
    exceptCompletionDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (location.state?.request) {
          const {
            serviceId,
            description,
            status,
            createDate,
            exceptCompletionDate
          } = location.state.request;

          setFormData({
            serviceId: String(serviceId),
            description: description || '',
            status: status || '',
            createDate: createDate || '',
            exceptCompletionDate: exceptCompletionDate || ''
          });
        } else {
          const res = await axios.get(`http://localhost:8080/requests/${id}`);
          const {
            serviceId,
            description,
            status,
            createDate,
            exceptCompletionDate
          } = res.data;

          setFormData({
            serviceId: String(serviceId),
            description: description || '',
            status: status || '',
            createDate: createDate || '',
            exceptCompletionDate: exceptCompletionDate || ''
          });
        }
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedRequest = {
        serviceId: parseInt(formData.serviceId, 10),
        description: formData.description.trim(),
        // if in future you want to edit these, add them:
        // status: formData.status,
        // createDate: formData.createDate,
        // exceptCompletionDate: formData.exceptCompletionDate,
      };

      console.log('UPDATE PAYLOAD:', updatedRequest);

      await axios.put(
        `http://localhost:8080/requests/edit/${id}`,
        updatedRequest
      );

      setMessage('Request updated successfully!');
      setTimeout(() => navigate('/viewrequest'), 1500);
    } catch (err) {
      console.error('Error updating request:', err);
      setError(
        err.response?.data?.message || 'Failed to update request'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading request details...</div>;
  }
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Edit Request</h2>
      {message && <div className={styles.success}>{message}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Service Type:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Select Service</option>
            <option value="1">Plumbing</option>
            <option value="2">Electricity</option>
            <option value="3">Garbage Collection</option>
            <option value="4">Maintenance</option>
            <option value="5">Cleaning</option>
            <option value="6">Security</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status:</label>
          <input
            name="status"
            value={formData.status}
            readOnly // keep as display-only
          />
        </div>

        <div className={styles.formGroup}>
          <label>Create Date:</label>
          <input
            name="createDate"
            value={formData.createDate}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label>Expect Completion Date:</label>
          <input
            name="exceptCompletionDate"
            value={formData.exceptCompletionDate}
            readOnly
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Request'}
          </button>
          <button
            className={styles.cancel}
            type="button"
            onClick={() => navigate(`/requestdetail/${id}`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRequest;
