import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageServices.module.css';
import { useNavigate } from 'react-router-dom';

const ManageServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ 
    serviceName: '',
    isAvailable: true,
    status: 'Active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [defaultServicesAdded, setDefaultServicesAdded] = useState(false);

  useEffect(() => {
    const defaultServices = [
      { serviceName: 'Plumbing'},
      { serviceName: 'Electricity'},
      { serviceName: 'Garbage Collection'},
      { serviceName: 'Maintenance'},
      { serviceName: 'Cleaning'},
      { serviceName: 'Security'}
    ];

    const addDefaultServices = () => {
      const promises = defaultServices.map(service => 
        axios.post('http://localhost:8080/services/save', service)
      );

      Promise.all(promises)
        .then(responses => {
          const addedServices = responses.map(res => res.data);
          setServices(addedServices);
          setDefaultServicesAdded(true);
          setSuccess('');
        })
        .catch(error => {
          setError('Failed to initialize default services');
          console.error('Error adding default services:', error);
        });
    };

    axios.get('http://localhost:8080/services/data')
      .then(response => {
        setServices(response.data);
        if (response.data.length === 0 && !defaultServicesAdded) {
          addDefaultServices();
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        setError('Failed to load services. Please try again.');
        console.error('Error fetching services:', error);
        setLoading(false);
      });
  }, [defaultServicesAdded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    
    if (!newService.serviceName.trim()) {
      setError('Service name cannot be empty');
      return;
    }

    axios.post('http://localhost:8080/services/save', newService)
      .then(response => {
        setServices([...services, response.data]);
        setNewService({ 
          serviceName: '',
          isAvailable: true,
          status: 'Active'
        });
        setSuccess('Service added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(error => {
        setError('Failed to add service. Please try again.');
        console.error('Error adding service:', error);
      });
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      axios.delete(`http://localhost:8080/services/delete/${serviceId}`)
        .then(() => {
          setServices(services.filter(service => service.serviceId !== serviceId));
          setSuccess('Service deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch(error => {
          setError('Failed to delete service. Please try again.');
          console.error('Error deleting service:', error);
        });
    }
  };

  if (loading) return <div className={styles.loading}>Loading services...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Manage Services</h2>
      
      {success && <div className={styles.success}>{success}</div>}

      <table className={styles.servicesTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Service Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.serviceId}>
              <td>{service.serviceId}</td>
              <td>{service.serviceName}</td>
              <td>
                <button 
                  onClick={() => handleDeleteService(service.serviceId)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddService} className={styles.serviceForm}>
        <h3>Add New Service</h3>
        
        <div className={styles.formGroup}>
          <label>Service Name:</label>
          <input
            type="text"
            name="serviceName"
            value={newService.serviceName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Status:</label>
          <select
            name="status"
            value={newService.status}
            onChange={handleChange}
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.addBtn}>
            Add Service
          </button>
          
        </div>
      </form>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/admindashboard')}>
            Back to Dashboard
          </button>
    </div>
  );
};

export default ManageServices;
