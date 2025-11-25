import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import bg from "../Assets/Resident_bg.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      email: form.email.trim(),
      password: form.password.trim(),
      role: form.role.trim()
    };

    console.log("LOGIN PAYLOAD:", payload);

    axios
      .post("http://localhost:8080/users/login", payload)
      .then((response) => {
        const user = response.data;

        if (!user || !user.role) {
          setMessage("Invalid credentials");
          return;
        }

        // backend sends "id", not "userId"
        if (user.id != null) {
          localStorage.setItem("userId", String(user.id));
        }
        localStorage.setItem("userRole", user.role);

        switch (user.role) {
          case "Super Admin":
            navigate("/superadmindashboard");
            break;
          case "Admin":
            navigate("/admindashboard");
            break;
          case "Resident":
            navigate("/userdashboard");
            break;
          default:
            setMessage("Invalid role");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);

        if (error.response) {
          console.log(
            "STATUS:",
            error.response.status,
            "DATA:",
            error.response.data
          );

          if (error.response.status === 401) {
            setMessage("Invalid email or password");
          } else {
            // show backend message if any
            setMessage(
              typeof error.response.data === "string"
                ? error.response.data
                : "Login failed. Please try again."
            );
          }
        } else {
          setMessage("Cannot reach server. Check if backend is running.");
        }
      });
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h1 className={styles.head}>My Colony</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? styles.errorInput : ""}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? styles.errorInput : ""}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={errors.role ? styles.errorInput : ""}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Resident">Resident</option>
          </select>
          {errors.role && (
            <span className={styles.errorText}>{errors.role}</span>
          )}
        </div>

        {message && <div className={styles.errorMessage}>{message}</div>}

        <div className={styles.links}>
          <Link to="/forgot">Forgot Password?</Link>
        </div>

        <button type="submit" className={styles.loginButton}>
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
