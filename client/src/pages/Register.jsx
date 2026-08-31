import { useState } from "react";
import "../styles/register.css";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name:"",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await registerUser(formData);

    toast.success(response.data.message);

    console.log(response.data);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed"
    );

  }
};

  return (
    <div className="register-container">

      <form className="register-card" onSubmit={handleSubmit}>

        <h2>Create Account</h2>
        <input
  type="text"
  name="name"
  placeholder="Full Name"
  value={formData.name}
  onChange={handleChange}
  required
/>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;