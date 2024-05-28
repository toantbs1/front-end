
import Meta from 'antd/es/card/Meta'
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperPriceText, WrapperReportText } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { Image } from 'antd'

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled } = props

    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <Image src={logo} style={{
                top: '-18px',
                left: '-2px',
                borderTopLefRadius: '3px',
                position: 'absolute',
                height: '14px',
                width: '68px',
            }} />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span><StarFilled style={{ fontSize: '12px', color: 'yellow' }}></StarFilled>
                </span>
                <span> | Da ban {selled || 1000}+</span>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{price}</span>
                <WrapperDiscountText>
                    -{discount || 5}%
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent