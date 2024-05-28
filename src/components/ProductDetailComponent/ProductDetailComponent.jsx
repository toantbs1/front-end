import { Col, Row, Image, InputNumber } from 'antd'
import React from 'react'
import imageProduct from '../../assets/images/imageProduct.webp'
import imageProductSmall from '../../assets/images/imageProductSmall.webp'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNamber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProDuct } from './style'
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ProductDetailComponent = () => {
    return (
        <Row style={{ padding: '16px', background: '#ffffff', borderRadius: '4px' }}>
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                <Image src={imageProduct} alt='imageProduct' preview={false} />
                <Row style={{ padding: '10px', justifyContent: 'space-between' }}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={imageProductSmall} alt='imageProductSmall' preview={false} />
                    </WrapperStyleColImage>
                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '10px' }}>
                <WrapperStyleNameProDuct>Iphone 13</WrapperStyleNameProDuct>
                <div>
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                    <span> | Da ban 1000+</span>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>
                        20.000.000d
                    </WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span>Giao đến </span>
                    <span className='address'>Q. 1, P. Bến Nghé, Hồ Chí Minh * </span>
                    <span className='change-address'>Đổi địa chỉ</span>
                </WrapperAddressProduct>
                <div style={{ margin: '10 0 20px', borderTop: '1px solid #e5e5e5', padding: '10px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ marginBottom: '10px' }}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{ background: 'transparent', border: 'none' }}>
                            <MinusOutlined style={{ color: '#000000', fontSize: '20px' }} />
                        </button>
                        <WrapperInputNamber defaultValue={0} size='small' />
                        <button style={{ background: 'transparent', border: 'none' }}>
                            <PlusOutlined style={{ color: '#000000', fontSize: '20px' }} />
                        </button>
                    </WrapperQualityProduct>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '15px' }}>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '220px',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                        textButton={'Chọn mua'}
                        styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: '700' }}
                    >
                    </ButtonComponent>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: 'white',
                            height: '48px',
                            width: '220px',
                            borderRadius: '4px'
                        }}
                        textButton={'Mua trả sau'}
                        styleTextButton={{ color: 'rgb(13, 92, 182', fontSize: '15px', fontWeight: '700' }}
                    >
                    </ButtonComponent>
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetailComponent