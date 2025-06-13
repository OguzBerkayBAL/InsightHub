import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h2>Plans and Pricing</h2>
      <p></p>
      <div className="plans">
        {/* Free Plan */}
        <div className="plan-card">
          <h3 className="plan-title">Free</h3>
          <p>Try Emergent Mind for free</p>
          <p className="plan-price">$0</p>
          <button className="plan-button">Try it Free</button>
          <p className="no-card">No credit card required</p>
          <ul>
            <li>5 Searches/Day</li>
            <li>Follow-Up Questions</li>
            <li>Search History</li>
            <li>Trending Papers</li>
            <li className="disabled">Centralized Billing</li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="plan-card">
          <h3 className="plan-title">Pro</h3>
          <p>For individual researchers</p>
          <p className="plan-price">$12/month</p>
          <button className="plan-button">Try it Free</button>
          <p className="cancel-anytime">Cancel anytime</p>
          <ul>
            <li>Unlimited Searches</li>
            <li>Follow-Up Questions</li>
            <li>Search History</li>
            <li>Trending Papers</li>
            <li className="disabled">Centralized Billing</li>
          </ul>
        </div>

        {/* Team Plan */}
        <div className="plan-card">
          <h3 className="plan-title">Team</h3>
          <p>For universities & labs</p>
          <p className="plan-price">Custom</p>
          <button className="plan-button">Contact Us</button>
          <p className="cancel-anytime">Cancel anytime</p>
          <ul>
            <li>Unlimited Searches</li>
            <li>Follow-Up Questions</li>
            <li>Search History</li>
            <li>Trending Papers</li>
            <li>Centralized Billing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
