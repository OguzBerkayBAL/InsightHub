import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import './Comments.css'; // CSS dosyasını dahil et

const getPosts = (t) => [
  {
    id: 1,
    title: t('comments.posts.aiResearch.title'),
    href: '#',
    description: t('comments.posts.aiResearch.description'),
    date: t('comments.posts.aiResearch.date'),
    datetime: '2024-01-15',
    category: { title: t('comments.posts.aiResearch.category'), href: '#' },
    author: {
      name: t('comments.posts.aiResearch.author.name'),
      role: t('comments.posts.aiResearch.author.role'),
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: t('comments.posts.machinelearning.title'),
    href: '#',
    description: t('comments.posts.machinelearning.description'),
    date: t('comments.posts.machinelearning.date'),
    datetime: '2024-01-10',
    category: { title: t('comments.posts.machinelearning.category'), href: '#' },
    author: {
      name: t('comments.posts.machinelearning.author.name'),
      role: t('comments.posts.machinelearning.author.role'),
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: t('comments.posts.dataanalysis.title'),
    href: '#',
    description: t('comments.posts.dataanalysis.description'),
    date: t('comments.posts.dataanalysis.date'),
    datetime: '2024-01-05',
    category: { title: t('comments.posts.dataanalysis.category'), href: '#' },
    author: {
      name: t('comments.posts.dataanalysis.author.name'),
      role: t('comments.posts.dataanalysis.author.role'),
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108755-2616c6a96ad1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

export default function Comments() {
  const { t } = useI18n();
  const posts = getPosts(t);

  return (
    <div className="comments-container">
      <div className="header">
        <h2>{t('comments.title')}</h2>
        <p>{t('comments.description')}</p>
      </div>
      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <div className="card-header">
              <div className="card-date">{post.date}</div>
              <a href={post.category.href} className="card-category">
                {post.category.title}
              </a>
            </div>
            <h3 className="card-title">
              <a href={post.href}>{post.title}</a>
            </h3>
            <p className="card-description">{post.description}</p>
            <div className="card-footer">
              <img alt="" src={post.author.imageUrl} className="author-image" />
              <div className="author-info">
                <p className="author-name">
                  <a href={post.author.href}>{post.author.name}</a>
                </p>
                <p className="author-role">{post.author.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
