import React, { useEffect, useState } from "react";
import "./TrendingPapers.css"
// JSON verilerini doğrudan içeri aktaralım (gerçek API yerine yerel veri kullanacağız)
const papersData = [
  {
    "author": "LG",
    "title": "Were RNNs All We Needed?",
    "published": "Oct 2",
    "views": "3.1k",
    "comments": 99
  },
  {
    "author": "LG",
    "title": "Old Optimizer, New Norm: An Anthology",
    "published": "Sep 30",
    "views": "1.5k",
    "comments": 50
  },
  {
    "author": "CV",
    "title": "Depth Pro: Sharp Monocular Metric Depth in Less Than a Second",
    "published": "Oct 2",
    "views": 614,
    "comments": 43
  },
  {
    "author": "DM",
    "title": "The bunkbed conjecture is false",
    "published": "Oct 3",
    "views": "1.1k",
    "comments": 30
  }
];

const TrendingPapers = () => {
  const [papers, setPapers] = useState([]);

  // useEffect ile JSON verisini alalım (gerçek API değil, yerel veri)
  useEffect(() => {
    // JSON verisini state'e yerleştiriyoruz
    setPapers(papersData);
  }, []);

  return (
    <div className="trending-container">
      <h2>Trending Comp Sci Papers</h2>
      <table className="papers-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Title</th>
            <th>Published</th>
            <th>Views</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper, index) => (
            <tr key={index}>
              <td className="author-icon">{paper.author}</td>
              <td>{paper.title}</td>
              <td>{paper.published}</td>
              <td>{paper.views}</td>
              <td>{paper.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendingPapers;
