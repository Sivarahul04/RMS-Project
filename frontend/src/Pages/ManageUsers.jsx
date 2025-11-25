import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageUsers.module.css';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    userName: '',
    email: '',
    mobileNo: '',
    block: '',
    floor: '',
    doorNo: '',
    role: 'Resident' 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:8080/users/data")
      .then((response) => {
        const residents = response.data.filter(user => user.role === 'Resident');
        setUsers(residents);
      })
      .catch((error) => {
        console.log("Error Fetching Users:", error);
      });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this Resident?')) {
      axios.delete(`http://localhost:8080/users/delete/${userId}`)
        .then(() => {
          setUsers(users.filter(user => user.userId !== userId));
          setSuccess("Resident Deleted Successfully");
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch((error) => {
          console.log("Failed to delete resident", error);
          setSuccess("Failed to delete resident");
          setTimeout(() => setSuccess(''), 3000);
        });
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.userId);
    setEditFormData({
      userName: user.userName,
      email: user.email,
      mobileNo: user.mobileNo,
      block: user.block,
      floor: user.floor,
      doorNo: user.doorNo,
      role: user.role
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) =>({
      ...prev,[name]:value
    }))
  };

  const handleEditFormSubmit = (userId) => {
    axios.put(`http://localhost:8080/users/update1/${userId}`, editFormData)
      .then(() => {
        setSuccess("Resident Updated Successfully");
        setEditingUserId(null);
        fetchUsers(); // Refresh the resident list
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((error) => {
        console.log("Failed to update resident", error);
        setSuccess("Failed to update resident: " + error.message);
        setTimeout(() => setSuccess(''), 3000);
      });
      console.log(setEditFormData);
      
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  return (
    <>
    <div className={styles.container}>
      <h2>Manage Residents</h2>
      
      {success && <div className={styles.success}>{success}</div>}

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              
              {editingUserId === user.userId ? (
                <>
                  <td>
                    <input

                      type="text"
                      name="userName"
                      value={editFormData.userName}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="mobileNo"
                      value={editFormData.mobileNo}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td className={styles.addressInputs}>
                    <input
                      type="text"
                      name="block"
                      value={editFormData.block}
                      onChange={handleEditFormChange}
                      placeholder="Block"
                    />
                    <input
                      type="text"
                      name="floor"
                      value={editFormData.floor}
                      onChange={handleEditFormChange}
                      placeholder="Floor"
                    />
                    <input
                      type="text"
                      name="doorNo"
                      value={editFormData.doorNo}
                      onChange={handleEditFormChange}
                      placeholder="Door No"
                    />
                  </td>
                  <td> Resident</td>
                </>
              ) : (
                <>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNo}</td>
                  <td>{user.block}-{user.floor}-{user.doorNo}</td>
                  <td>{user.role}</td>
                </>
              )}
              
              <td className={styles.actionButtons}>
                {editingUserId === user.userId ? (
                  <>
                    <button 
                      onClick={() => handleEditFormSubmit(user.userId)}
                      className={styles.saveBtn}
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancelClick}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEditClick(user)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.userId)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    <button onClick={() =>{
        const role = localStorage.getItem('userRole');
        console.log(role);
        
        if(role ==='Admin'){
          navigate('/admindashboard')
        }
        else{
          navigate('/superadmindashboard')
        }
      }} className={styles.backBtn}>
        Back to Dashboard
      </button>
    </>
  );
};

export default ManageUsers;