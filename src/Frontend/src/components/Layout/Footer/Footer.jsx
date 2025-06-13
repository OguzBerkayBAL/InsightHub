import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <nav>
        <ul className="footer-links">
          <li>About </li>
          <li>Let's Chat</li>
          <li>Updates</li>
          <li>Terms</li>
          <li>Privacy</li>
          <li>RSS</li>
          <li>Contact</li>
          <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
