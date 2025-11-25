import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RaiseRequest.module.css';

const RaiseRequest = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔴 VERY IMPORTANT: KEY NAME MUST MATCH LOGIN CODE
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios
      .get('http://localhost:8080/services/data')
      .then((response) => {
        setServices(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setMessage('Failed to load services. Please try again later.');
        setIsError(true);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!selectedService || !description.trim()) {
      setMessage('Please fill all fields');
      setIsError(true);
      return;
    }

    if (!userId) {
      setMessage('User not logged in. Please login again.');
      setIsError(true);
      return;
    }

    const serviceIdNum = parseInt(selectedService, 10);
    const userIdNum = parseInt(userId, 10);

    if (Number.isNaN(serviceIdNum) || Number.isNaN(userIdNum)) {
      setMessage('Invalid user or service id.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    // 👇 only send what backend really needs
    const newRequest = {
      serviceId: serviceIdNum,
      userId: userIdNum,
      description: description.trim(),
      // status / dates remove pannirukken – backend set pannattum
    };

    console.log('Submitting request:', newRequest);

    axios
      .post('http://localhost:8080/requests/save', newRequest)
      .then(() => {
        setSelectedService('');
        setDescription('');
        setIsError(false);
        setMessage('Request submitted successfully!');

        // 2 sec delay, then go to dashboard
        setTimeout(() => navigate('/userdashboard'), 2000);
      })
      .catch((error) => {
        console.error('Error submitting request:', error);
        setMessage(
          error.response?.data?.message || 'Something went wrong. Try again.'
        );
        setIsError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
        // clear message after 5 sec
        setTimeout(() => setMessage(''), 5000);
      });
  };

  if (loading) return <div className={styles.loading}>Loading services...</div>;

  return (
    <div className={styles.container}>
      <h2>Raise New Request</h2>

      {message && (
        <div className={isError ? styles.error : styles.success}>{message}</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="service">Select Service:</label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={styles.select}
            required
            disabled={isSubmitting || services.length === 0}
          >
            <option value="">-- Select a service --</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            placeholder="Describe your request in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !selectedService}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/userdashboard')}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      <button onClick={() => navigate('/userdashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default RaiseRequest;
