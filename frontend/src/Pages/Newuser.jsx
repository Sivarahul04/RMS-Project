import React, { useState } from 'react';
import styles from './Newuser.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Newuser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '',
    email: '',
    mobileNo: '',
    block: '',
    floor: '',
    doorNo: '',
    role: 'Resident',
    password: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  const payload = {
    userName: form.userName,
    email: form.email,
    mobileNo: parseInt(form.mobileNo),
    block: form.block,
    floor: parseInt(form.floor),
    doorNo: parseInt(form.doorNo),
    role: form.role, 
    password: form.password
  };
  
  axios.post("http://localhost:8080/users/save", payload)
    .then((response) => {
      console.log(response.data);
      setSuccessMessage('Account created successfully!');
      setForm({
        userName: '',
        email: '',
        mobileNo: '',
        block: '',
        floor: '',
        doorNo: '',
        role: '',
        password: ''
      });
    })
    .catch(error => {
      console.error("Error creating user:", error);
      setSuccessMessage('Error creating account. Please try again.');
    });
};

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.new}>
          <input type="text" name="userName" id="userName" value={form.userName} onChange={handleChange} placeholder="Enter your name" required />
          <input type="email" name="email" id="email" value={form.email} onChange={handleChange} placeholder="Enter Email" required />
          <input type="number" name="mobileNo" id="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="Enter Mobile number" required />
          <div className={styles.container}>
            <select name="block" id="block" value={form.block} onChange={handleChange} required>
              <option value="">Select Block</option>
              <option value="A">Block - A</option>
              <option value="B">Block - B</option>
              <option value="C">Block - C</option>
              <option value="D">Block - D</option>
              <option value="E">Block - E</option>
              <option value="F">Block - F</option>
            </select>

            <select name="floor"id="floor"value={form.floor}onChange={handleChange}required>
              <option value="">Select Floor</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor</option>
              <option value="5">5th Floor</option>
            </select>
            <input type="number" name="doorNo" id="doorNo" value={form.doorNo} onChange={handleChange} placeholder="Enter Door Number" required />
            <select name="role" id="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="Resident">Resident</option>
            </select>
            <input type="password" name="password" id="password" value={form.password} onChange={handleChange} placeholder="Enter Password" required />
            <button type="submit">Create Account</button>
          </div>

          {successMessage && (
            <p className={styles.success}>{successMessage}</p>
          )}
        </div>
      </form>
      <button className={styles.back} onClick={()=>navigate('/superadmindashboard')}>Back</button>
    </>
  );
};

export default Newuser;
