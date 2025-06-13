import React, { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useI18n } from '../../../hooks/useI18n';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { t } = useI18n();

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
            <a href="/assistant" className="nav-link">{t('nav.assistant')}</a>
            <span>|</span>
            <a href="/trending" className="nav-link">{t('nav.trending')}</a>
            <span>|</span>
            <a href="/newsletter" className="nav-link">{t('nav.newsletter')}</a>
            <span>|</span>
            <a href="/pricing" className="nav-link">{t('nav.pricing')}</a>
            <span>|</span>

            <LanguageSwitcher />
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
                  {t('nav.logout')}
                </a>
              </>
            ) : (
              <>
                <a href="/login" className="nav-link">{t('nav.login')}</a>
                <span>|</span>
                <a href="/signup" className="nav-link">{t('nav.signup')}</a>
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
          <a href="/assistant" className="nav-link" onClick={toggleMenu}>{t('nav.assistant')}</a>
          <a href="/trending" className="nav-link" onClick={toggleMenu}>{t('nav.trending')}</a>
          <a href="/newsletter" className="nav-link" onClick={toggleMenu}>{t('nav.newsletter')}</a>
          <a href="/pricing" className="nav-link" onClick={toggleMenu}>{t('nav.pricing')}</a>

          <div style={{ padding: '10px 0' }}>
            <LanguageSwitcher />
          </div>

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
                {t('nav.logout')}
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link" onClick={toggleMenu}>{t('nav.login')}</a>
              <a href="/signup" className="nav-link" onClick={toggleMenu}>{t('nav.signup')}</a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
