import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.dashboardContainer}>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/manageusers')}>Manage Users</button>
      <button onClick={() => navigate('/manageservices')}>Manage Services</button>
      <button onClick={() => navigate('/managerequests')}>Manage Requests</button>
      
    </div>
       <button className={styles.logout}onClick={() => navigate('/')}>Logout</button>
 </>
  );
};

export default AdminDashboard;