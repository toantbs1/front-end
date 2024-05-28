import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { size, placeholder, textButton,
        bordered, backgroundColorInput = 'white',
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = 'white'
    } = props
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ backgroundColor: backgroundColorInput }}
                {...props} />

            <ButtonComponent
                size={size}
                icon={<SearchOutlined style={{ color: colorButton }} />}
                bordered={bordered}
                style={{ backgroundColor: backgroundColorButton, border: !bordered && 'none' }}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div>
    )
}

export default ButtonInputSearch