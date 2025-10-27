import React from 'react';
import Post from './Post';
import '../../../public/styles/Forum.css';

const PostList = ({ posts }) => {
    // Kiểm tra nếu không có bài đăng hoặc mảng rỗng
    if (!posts || posts.length === 0) {
        return <p className="no-posts-message">Chưa có bài đăng nào.</p>;
    }

    return (
        <div className="post-list">

            {posts.map((post) => (
                <Post
                    key={post.id} 
                    title={post.title}
                    content={post.content}
            
                    authorEmail={post.author_email}
                    createdAt={post.created_at}
                />
            ))}
        </div>
    );
};

export default PostList;

