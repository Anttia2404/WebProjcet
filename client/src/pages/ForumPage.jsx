import '../../public/styles/Forum.css';
import React, { useState, useEffect } from 'react';
import PostList from '../components/forum/PostList';
import CreatePost from '../components/forum/CreatePost';
import api from '../services/api';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (err) {
            console.error("Lỗi khi tải bài đăng:", err);
            if (err.response && err.response.status === 401) {
                setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            } else {
                setError('Không thể tải danh sách bài đăng. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <div className="forum-page">
            <h2>Diễn đàn KTX Khu B</h2>
            <CreatePost onPostCreated={handlePostCreated} />
            {loading && <p>Đang tải bài đăng...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && <PostList posts={posts} />}
        </div>
    );
};

export default ForumPage;
