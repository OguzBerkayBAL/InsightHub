import React from 'react'
import "./Faq.css"
const Faq = () => {
  return (
    <div className="faq-container">
    <h2 className="faq-title">Common Questions</h2>
    <div className="faq-row">
      <div className="faq-item">
        <h3 className="faq-question">Can I try it without a credit card?</h3>
        <p className="faq-answer">
          Yes, you can sign up without a credit card to perform 5 searches/day for free with our AI research assistant. For unlimited searches, you can upgrade to the Pro plan for just $12/month.
        </p>
      </div>
      <div className="faq-item">
        <h3 className="faq-question">What payment methods do you accept?</h3>
        <p className="faq-answer">
          We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. For teams, we also accept invoice payments.
        </p>
      </div>
    </div>
    <div className="faq-row">
      <div className="faq-item">
        <h3 className="faq-question">Can I cancel anytime?</h3>
        <p className="faq-answer">
          Yes, if you upgrade to the Pro plan, you can cancel at any time and won't be charged going forward.
        </p>
      </div>
      <div className="faq-item">
        <h3 className="faq-question">What if I have more questions?</h3>
        <p className="faq-answer">
          Contact us anytime at help@emergentmind.com.
        </p>
      </div>
    </div>
  </div>
  )
}

export default Faq