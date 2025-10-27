import React, { useState, useEffect } from 'react';
import ItemList from '../components/marketplace/ItemList';
import CreateItem from '../components/marketplace/CreateItem';
import api from '../services/api';
import '../../public/styles/Marketplace.css';

const MarketplacePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            const response = await api.get('/items');
            setItems(response.data);
        } catch (err) {
            console.error("Lỗi fetch items:", err);
            if (!error) setError('Không thể tải danh sách đồ. Vui lòng thử lại.');
        } finally {
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleItemCreated = (newItem) => {
        console.log('Item mới đã được tạo:', newItem);
        fetchItems();
    };

    return (
        <div className="marketplace-page">
            <h2>Chợ đồ KTX Khu B</h2>
            <CreateItem onItemCreated={handleItemCreated} />
            {loading && <p>Đang tải danh sách đồ...</p>}
            {error && !loading && <p className="error-message">{error}</p>}
            {!loading && !error && <ItemList items={items} />}
        </div>
    );
};

export default MarketplacePage;
