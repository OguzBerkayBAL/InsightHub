import React from "react";
import { message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import "./Login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Track form completeness and update button state
  useEffect(() => {
    // Check if all fields are filled
    const isValid = formData.email.trim() !== "" &&
      formData.password.trim() !== "";
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.email.trim() || !formData.password.trim()) {
      message.error("Lütfen email ve şifre alanlarını doldurunuz.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response.data);

      // Store token in localStorage
      localStorage.setItem("token", response.data.user.token);

      // Use the login function from AuthContext to update user state
      login(response.data.user);

      // Başarılı giriş mesajı göster
      message.success("Giriş başarılı!");

      // Kullanıcı rolüne göre yönlendirme yap
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Hata mesajlarını kontrol et ve uygun uyarıyı göster
      if (error.response) {
        // Sunucudan dönen hata
        const status = error.response.status;

        if (status === 401) {
          message.error("Email veya şifre hatalı!");
        } else if (status === 404) {
          message.error("Bu email adresi ile kayıtlı kullanıcı bulunamadı.");
        } else {
          message.error("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } else if (error.request) {
        // Sunucuya ulaşılamadı
        message.error("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        // Diğer hatalar
        message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log in</h2>
        <p className="account-text">
          Don't have an account? <a href="/signup">Sign up for free.</a>
        </p>

        <button className="google-login-btn">
          <GoogleLogo />
          Sign in with Google
        </button>

        <div className="divider">— or —</div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              required
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              required
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button
            type="submit"
            className={`login-submit-btn ${formValid ? 'active' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const GoogleLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
    className="google-logo"
  >
    <path
      fill="#4285F4"
      d="M24 9.5c3.3 0 6 1.1 8.2 3.1l6.1-6.1C34.8 3.4 29.7 1.5 24 1.5 14.8 1.5 7 8.6 4.5 17.5l7.1 5.5c1.3-5 5.9-10 12.4-10z"
    />
    <path
      fill="#34A853"
      d="M46.5 24c0-1.5-.1-2.9-.4-4.3H24v8.2h12.8c-.5 2.9-2.1 5.3-4.6 7L40 39.5c4.2-3.9 6.5-9.7 6.5-15.5z"
    />
    <path
      fill="#FBBC05"
      d="M11.6 28.1c-1-3-1-6.2 0-9.1L4.5 13.5c-2.9 5.7-2.9 12.3 0 18.1l7.1-5.5z"
    />
    <path
      fill="#EA4335"
      d="M24 46.5c5.7 0 10.5-1.9 14.1-5.3l-7.1-5.5c-2.1 1.4-4.8 2.3-7.1 2.3-6.4 0-11.1-5-12.4-10l-7.1 5.5c2.5 8.9 10.3 15.1 19.5 15.1z"
    />
  </svg>
);

export default Login;
