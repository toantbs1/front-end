
import React from 'react'
import { WrapperStyleInput } from './style'

const InputForm = (props) => {
    const { placeholder = 'Nhập text', ...rests } = props
    const handleOnChangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return (
        <WrapperStyleInput placeholder={placeholder} value={props.value} {...rests} onChange={handleOnChangeInput} />
    )
}

export default InputForm