import React, {useEffect, useState } from 'react';
import styles from './Forgot.module.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Forgot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const users = location.state?.users;

  const [form, setForm] = useState({
    email:'',
    password: ''
  });

  useEffect(() => {
    if (users) {
      setForm({
        email:users.email,
        password:users.password
      });
    }
  }, [users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(form.email);
    console.log(`Requesting: http://localhost:8080/users/update/${form.email}`);
    axios.put(`http://localhost:8080/users/update/${form.email}`, form).then((response) => {
        console.log('Updated:', response.data);
        navigate('/login');
      })
  
  };
  return (
    <>
    <div className={styles.forgotContainer}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleUpdate}>
        <input type="email" name="email" id="email"value={form.email} onChange={handleChange}className={styles.forgotInput} placeholder='Enter your email' />
        <input type="password" name="password" id="password" value={form.password}onChange={handleChange} placeholder='Enter new password'className={styles.forgotInput}/>
        <button type="submit" className={styles.forgotButton}>Submit</button>
      </form>
    </div>
    </>
  )
}

export default Forgot
