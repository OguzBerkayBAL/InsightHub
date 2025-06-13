import React from "react";
import { useState, useEffect } from "react";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./SignUp.css"

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formValid, setFormValid] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Form alanlarının değişikliğini izleyip buton rengini güncelleme
  useEffect(() => {
    // Tüm alanlar doldurulmuş mu kontrol et
    const isValid = formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "";
    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const missing = [];

    if (!formData.name.trim()) missing.push("Name");
    if (!formData.email.trim()) missing.push("Email");
    if (!formData.password.trim()) missing.push("Password");

    return missing;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Form doğrulama kontrolü
    const missingFieldsList = validateForm();

    if (missingFieldsList.length > 0) {
      setMissingFields(missingFieldsList);
      setPopupVisible(true);
      return;
    }

    console.log("Form Data:", formData);  // Gönderilen veriyi kontrol et
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("Response Status:", response.status);  // Yanıt durumunu kontrol et

      if (response.ok) {
        const data = await response.json();
        console.log("Response Data:", data); // Cevap verisini kontrol et

        // Save token to localStorage
        if (data.user && data.user.token) {
          localStorage.setItem("token", data.user.token);
        } else if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Use the login function from AuthContext
        const userData = data.user || data;
        login(userData);

        // Kullanıcı rolüne göre yönlendirme yap
        const userRole = data.user ? data.user.role : data.role; // API yanıt formatına göre rolü al
        console.log("User Role from Backend:", userRole);

        message.success("Kayıt başarılı! Giriş yapıldı.");

        if (userRole === 'admin') {
          navigate("/admin");  // Admin sayfasına yönlendir
        } else {
          navigate("/");  // Kullanıcıyı ana sayfaya yönlendir
        }
      } else {
        // Hata detaylarını almaya çalış
        try {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes("Email already exists")) {
            message.error("Bu email adresi zaten kullanılıyor. Lütfen başka bir email adresi deneyin.");
          } else {
            message.error("Kayıt başarısız: " + (errorData.message || "Bilinmeyen hata"));
          }
        } catch (e) {
          // Hata cevabı JSON formatında değilse
          message.error("Kayıt başarısız. Lütfen tekrar deneyin.");
        }
      }
    } catch (error) {
      message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2><i className="bi bi-person-circle"></i> Sign up</h2>

        <ul className="benefits-list">
          <li>Perform 5 searches/day for free</li>
          <li>Ask follow-up questions</li>
          <li>No credit card required</li>
        </ul>

        <button className="google-login-btn">
          <GoogleLogo />
          Sign in with Google
        </button>

        <div className="divider">— or —</div>

        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">İsim</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Neslihan Berkay"
              required
              onChange={handleInputChange}
              name="name"
              value={formData.name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@email.com"
              required
              onChange={handleInputChange}
              name="email"
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
              onChange={handleInputChange}
              name="password"
              value={formData.password}
            />
          </div>

          <button
            type="submit"
            className={`signup-submit-btn ${formValid ? 'active' : ''}`}
            onClick={handleRegister}
          >
            Sign Up Now
          </button>
        </form>

        <p className="terms">
          By signing up you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>

      {/* Missing Fields Modal */}
      <Modal
        title="Missing Information"
        open={popupVisible}
        onOk={() => setPopupVisible(false)}
        onCancel={() => setPopupVisible(false)}
        footer={[
          <button
            key="ok"
            className="modal-ok-btn"
            onClick={() => setPopupVisible(false)}
          >
            OK
          </button>
        ]}
      >
        <p>Please fill in the following fields:</p>
        <ul className="missing-fields-list">
          {missingFields.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </Modal>
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

export default SignUp;
