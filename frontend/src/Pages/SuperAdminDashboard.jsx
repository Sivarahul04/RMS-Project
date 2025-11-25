import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SuperAdminDashboard.module.css';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    totalResidents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let requests = [];
    let users = [];

    axios.get('http://localhost:8080/requests/data')
      .then((requestsRes) => {
        requests = requestsRes.data;
        return axios.get('http://localhost:8080/users/data');
      })
      .then((usersRes) => {
        users = usersRes.data;

        setStats({
          totalRequests: requests.length,
          completedRequests: requests.filter(r => r.status === 'Completed').length,
          pendingRequests: requests.filter(r => r.status === 'Pending').length,
          inProgressRequests: requests.filter(r => r.status === 'In Progress').length,
          totalResidents: users.filter(u => u.role === 'Resident').length
        });
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCreateUsers = () => {
    navigate('/newuser');
  };

  const handleManageUsers = () => {
    navigate('/manageusers');
  };

  const handleCardClick = (status) => {
    if (status) {
      navigate(`/requests?status=${encodeURIComponent(status)}`);
    } else {
      navigate('/requests');
    }
  };

  if (loading) return <div className={styles.container}>Loading dashboard...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Super Admin Dashboard</h2>

      <div className={styles.cards}>
        <button className={styles.card} onClick={() => handleCardClick(null)}>
          <h4>Total Requests</h4>
          <p>{stats.totalRequests}</p>
        </button>
        <button className={styles.card} onClick={() => handleCardClick('Completed')}>
          <h4>Completed</h4>
          <p>{stats.completedRequests}</p>
        </button>
        <button className={styles.card} onClick={() => handleCardClick('Pending')}>
          <h4>Pending</h4>
          <p>{stats.pendingRequests}</p>
        </button>
        <button className={styles.card} onClick={() => handleCardClick('In Progress')}>
          <h4>In Progress</h4>
          <p>{stats.inProgressRequests}</p>
        </button>
        <div className={styles.card}>
          <h4>Total Residents</h4>
          <p>{stats.totalResidents}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.userManagement}>
          <button onClick={handleCreateUsers} className={styles.userButton}>
            Create Users
          </button>
          <button onClick={handleManageUsers} className={styles.userButton}>
            Manage Users
          </button>
          <button onClick={()=>navigate('/admin')} className={styles.userButton}>
            Manage Admin
          </button>
        </div>

        <Link to="/reports" className={styles.reportsButton}>
          View Detailed Reports
        </Link>
      </div>

      <div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;