import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserDashboard.module.css';


const UserDashboard = ({ addRequest, requests }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };

  const handleRaiseRequest = () => {
    navigate('/raiserequest');
  };

  const handleViewRequest = () => {
    navigate('/viewrequest');
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2>Welcome to Resident Dashboard</h2>
      <div className={styles.buttonGroup}>
        <button onClick={handleRaiseRequest}>Raise Request</button>
        <button onClick={handleViewRequest}>View Requests</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserDashboard;
