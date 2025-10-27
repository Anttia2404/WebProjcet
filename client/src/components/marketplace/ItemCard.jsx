import React from 'react';
import '../../../public/styles/Marketplace.css';

const placeholderImage = (size = '300x200') => `https://placehold.co/${size}/E0E0E0/grey?text=No+Image`;

const ItemCard = ({ itemName, description, price, imageUrl, sellerName, createdAt }) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    const formattedDate = new Date(createdAt).toLocaleDateString('vi-VN');

    return (
        <div className="item-card">
            <img
                src={imageUrl || placeholderImage()}
                alt={itemName}
                className="item-image"
                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage(); }}
            />
            <div className="item-info">
                <h3 className="item-name">{itemName}</h3>
                <p className="item-description">{description || 'Không có mô tả.'}</p>
                <div className="item-details">
                    <span className="item-price">{formattedPrice}</span>
                    <span className="item-seller">Đăng bởi: {sellerName || 'Người dùng'}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
