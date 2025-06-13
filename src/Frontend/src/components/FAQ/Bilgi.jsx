import React from 'react'
import "./Bilgi.css"
const Bilgi = () => {
  return (
    <div className="faq-container">
        <h1>FAQs</h1>
        <div className="faq-box">
            <h2>What is Emergent Mind</h2>
            <p><strong>Emergent Mind</strong> is a new AI research assistant that helps answer questions about computer science research.</p>

            <h3>How is it different than ChatGPT?</h3>
            <ul>
                <li>We're hyper-focused on computer science research, ensuring answers are grounded in computer science and don't mix in research from other fields.</li>
                <li>We factor in citations (via Semantic Scholar) and social metrics (from X, HackerNews, YouTube, and GitHub) to identify trending new papers that haven't been cited yet.</li>
                <li>We provide references so you know what papers Emergent Mind is using to answer your question.</li>
                <li>We're always up-to-date with the latest papers on arXiv.</li>
                <li>We encourage exploration using automatically-generated follow-up questions and embedded topic links.</li>
            </ul>

            <h3>What type of questions can Emergent Mind answer?</h3>
            <p>For this beta version of Emergent Mind, it uses a combination of abstracts and paper summaries to try to answer questions. For this reason, it excels at answering high-level questions like the examples above. We are working on getting full papers into the system to help answer more complex questions.</p>

            <h3>How can I make suggestions?</h3>
            <p>We'd love any feedback you have, especially with respect to improving the quality of the answers.</p>
            <p>Drop us a note anytime at <a href="mailto:help@emergentmind.com">help@emergentmind.com</a>.</p>

            <h3>How much does it cost?</h3>
            <p>You can sign up for an account to perform 5 searches/day for free. To perform unlimited searches, you can upgrade to our Pro plan for just $12/month.</p>

            <button className="sign-up-button">Sign up for free</button>
        </div>
    </div>
  )
}

export default Bilgi