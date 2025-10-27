import db from '../config/db.js';

export const getAllItemsModel = async () => {
    try {
        const query = `
            SELECT
                items.id,
                items.item_name,
                items.description,
                items.price,
                items.image_url,
                items.created_at,
                users.email AS seller_email,
                users.full_name AS seller_name
            FROM items
            JOIN users ON items.user_id = users.id
            ORDER BY items.created_at DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error("Lỗi model lấy tất cả items:", err);
        throw err;
    }
};

export const createItemModel = async (itemName, description, price, imageUrl, userId) => {
    try {
        const query = `
            INSERT INTO items (item_name, description, price, image_url, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const numericPrice = parseFloat(price);
        const params = [itemName, description, numericPrice, imageUrl, userId];
        const result = await db.query(query, params);
        return result.rows[0];
    } catch (err) {
        console.error("Lỗi model tạo item:", err);
        throw err;
    }
};
