import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'

const ProductDetailPage = () => {
    return (
        <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
            <h4>Trang chủ</h4>
            <div style={{ display: 'flex', background: '#ffffff' }}>
                <ProductDetailComponent />
            </div>
        </div>
    )
}

export default ProductDetailPage