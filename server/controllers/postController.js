import { getAllPostsModel, createPostModel } from '../models/post.model.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await getAllPostsModel();
        res.status(200).json(posts);
    } catch (err) {
        console.error("Lỗi controller lấy posts:", err);
        res.status(500).json({ message: "Lỗi server khi lấy bài đăng." });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!title || !content) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ tiêu đề và nội dung." });
        }

        const newPost = await createPostModel(title, content, userId);
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Lỗi controller tạo post:", err);
        res.status(500).json({ message: "Lỗi server khi tạo bài đăng." });
    }
};
