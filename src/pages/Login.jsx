// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {error && <p className="error" id="login-error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input id="email" type="email" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input id="password" type="password" placeholder="Password"
               value={password} onChange={e => setPassword(e.target.value)} />
        <button id="login-btn" type="submit">Login</button>
      </form>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
