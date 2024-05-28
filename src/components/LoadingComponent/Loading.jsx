import { Spin } from 'antd'
import React from 'react'

const Loading = ({ children, isPending, delay = 2000 }) => {
    return (
        <Spin spinning={isPending} delay={delay}>
            {children}
        </Spin>
    )
}

export default Loading