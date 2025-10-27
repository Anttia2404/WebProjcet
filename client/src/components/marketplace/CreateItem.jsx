import React, { useState } from 'react';
import api from '../../services/api';
import '../../../public/styles/Marketplace.css';

const CreateItem = ({ onItemCreated }) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!itemName.trim()) {
            setError('Vui lòng nhập tên món đồ.');
            setIsSubmitting(false);
            return;
        }
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            setError('Vui lòng nhập giá hợp lệ (là số không âm).');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post('/items', {
                itemName,
                description,
                price: numericPrice,
                imageUrl
            });

            if (onItemCreated) {
                onItemCreated(response.data);
            }

            setItemName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
        } catch (err) {
            console.error("Lỗi khi tạo item:", err);
            setError(err.response?.data?.message || 'Không thể đăng bán. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-item-form">
            <h3>Đăng bán đồ mới</h3>
            {error && <p className="auth-error">{error}</p>}

            <div>
                <label htmlFor="item-name">Tên món đồ:</label>
                <input
                    type="text"
                    id="item-name"
                    className="auth-input"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor="item-description">Mô tả:</label>
                <textarea
                    id="item-description"
                    className="auth-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    rows={3}
                />
            </div>

            <div>
                <label htmlFor="item-price">Giá (VND):</label>
                <input
                    type="number"
                    id="item-price"
                    className="auth-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="1000"
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label htmlFor="item-image-url">Link hình ảnh (tùy chọn):</label>
                <input
                    type="url"
                    id="item-image-url"
                    className="auth-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                />
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng...' : 'Đăng bán'}
            </button>
        </form>
    );
};

export default CreateItem;
