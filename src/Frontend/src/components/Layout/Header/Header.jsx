import React, { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      logout();
      window.location.href = "/";
    }
  };

  return (
    <div className="header bg-gray-100 shadow">
      <div className="container">
        <nav className="flex">
          <div className="logo">
            <a href="/" className="logo-text">Insight Hub</a>
          </div>
          <div className="nav-links">
            <a href="/assistant" className="nav-link">Assistant</a>
            <span>|</span>
            <a href="/trending" className="nav-link">Trending</a>
            <span>|</span>
            <a href="/newsletter" className="nav-link">Newsletter</a>
            <span>|</span>
            <a href="/pricing" className="nav-link">Pricing</a>
            <span>|</span>

            {currentUser ? (
              <>
                <a href="/profile" className="nav-link">👤 {currentUser.name || "User"}</a>
                <span>|</span>
                <a
                  href="#"
                  className="nav-link logout-text"
                  onClick={handleLogout}
                >
                  Log Out
                </a>
              </>
            ) : (
              <>
                <a href="/login" className="nav-link">Log in</a>
                <span>|</span>
                <a href="/signup" className="nav-link">Sign up</a>
              </>
            )}
          </div>
          {/* Hamburger Menü İkonu */}
          <div className="hamburger" onClick={toggleMenu}>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
          </div>
        </nav>
      </div>
      {/* Mobil Menü */}
      {isOpen && (
        <div className="mobile-menu">
          <a href="/assistant" className="nav-link" onClick={toggleMenu}>Assistant</a>
          <a href="/trending" className="nav-link" onClick={toggleMenu}>Trending</a>
          <a href="/newsletter" className="nav-link" onClick={toggleMenu}>Newsletter</a>
          <a href="/pricing" className="nav-link" onClick={toggleMenu}>Pricing</a>

          {currentUser ? (
            <>
              <a href="/profile" className="nav-link" onClick={toggleMenu}>👤 {currentUser.name || "User"}</a>
              <a
                href="#"
                className="nav-link logout-text"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                Log Out
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link" onClick={toggleMenu}>Log in</a>
              <a href="/signup" className="nav-link" onClick={toggleMenu}>Sign up</a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
