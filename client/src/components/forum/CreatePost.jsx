import React, { useState } from 'react';
import api from '../../services/api';
import '../../../public/styles/Forum.css';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!title.trim() || !content.trim()) {
            setError('Vui lòng nhập cả tiêu đề và nội dung.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/posts', { title, content });
            if (onPostCreated) onPostCreated(response.data);
            setTitle('');
            setContent('');
        } catch (err) {
            console.error("Lỗi khi tạo bài đăng:", err);
            setError(err.response?.data?.message || 'Không thể tạo bài đăng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-post-form">
            <h3>Tạo bài đăng mới</h3>
            {error && <p className="auth-error">{error}</p>}
            <div>
                <label htmlFor="post-title">Tiêu đề:</label>
                <input
                    type="text"
                    id="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label htmlFor="post-content">Nội dung:</label>
                <textarea
                    id="post-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
            </button>
        </form>
    );
};

export default CreatePost;
