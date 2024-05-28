import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../util';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <MailOutlined />),
    ];
    const [selectedKeys, setSelectedKeys] = useState('');
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            default:
                return <div></div>
        }
    }
    const handleOnClick = ({ key }) => {
        setSelectedKeys(key)
    }
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '15px' }}>
                    {renderPage(selectedKeys)}
                </div>
            </div>
        </>
    )
}

export default AdminPage