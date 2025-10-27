import React from 'react';
import ItemCard from './ItemCard';
import '../../../public/styles/Marketplace.css';

const ItemList = ({ items }) => {
    if (!items || items.length === 0) {
        return <p>Chưa có món đồ nào được đăng bán.</p>;
    }

    return (
        <div className="item-list">
            {items.map((item) => (
                <ItemCard
                    key={item.id}
                    itemName={item.item_name}
                    description={item.description}
                    price={item.price}
                    imageUrl={item.image_url}
                    sellerName={item.seller_name} 
                    createdAt={item.created_at}
                />
            ))}
        </div>
    );
};

export default ItemList;
