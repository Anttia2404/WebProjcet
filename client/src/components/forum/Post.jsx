import React from 'react';
import '../../../public/styles/Forum.css';

const Post = ({ title, content, authorEmail, createdAt }) => {
    const formattedDate = new Date(createdAt).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <article className="post-item">
            <h3 className="post-title">{title}</h3>
            <p className="post-content">{content}</p>
            <div className="post-meta">
                <span className="post-author">Đăng bởi: {authorEmail}</span>
                <span className="post-date"> - {formattedDate}</span>
            </div>
        </article>
    );
};

export default Post;

