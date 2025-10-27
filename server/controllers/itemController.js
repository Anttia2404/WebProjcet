import { getAllItemsModel, createItemModel } from '../models/item.model.js';

export const getAllItems = async (req, res) => {
    try {
        const items = await getAllItemsModel();
        res.status(200).json(items);
    } catch (err) {
        console.error("Lỗi controller lấy items:", err);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách đồ." });
    }
};

export const createItem = async (req, res) => {
    try {
        const { itemName, description, price, imageUrl } = req.body;
        const userId = req.user.id;

        if (!itemName || price === undefined || price === null) {
            return res.status(400).json({ message: "Vui lòng nhập tên món đồ và giá." });
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return res.status(400).json({ message: "Giá không hợp lệ." });
        }

        const newItem = await createItemModel(
            itemName,
            description || '',
            price,
            imageUrl || null,
            userId
        );
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Lỗi controller tạo item:", err);
        res.status(500).json({ message: "Lỗi server khi tạo món đồ." });
    }
};
