import db from '../config/db.js';

export const getAllPostsModel = async () => {
    try {
        const query = `
            SELECT
                posts.id,
                posts.title,
                posts.content,
                posts.created_at,
                users.email AS author_email,
                users.full_name AS author_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            ORDER BY posts.created_at DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error("Lỗi model lấy tất cả posts:", err);
        throw err;
    }
};

export const createPostModel = async (title, content, userId) => {
    try {
        const query = `
            INSERT INTO posts (title, content, user_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const params = [title, content, userId];
        const result = await db.query(query, params);
        return result.rows[0];
    } catch (err) {
        console.error("Lỗi model tạo post:", err);
        throw err;
    }
};
