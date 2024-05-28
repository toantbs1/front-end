import React from 'react'
import { Drawer } from 'antd'

const DrawerComponent = ({ title = 'Drawer', placement = 'right', open = false, children, ...rests }) => {
    return (
        <Drawer title={title} placement={placement} open={open} {...rests}>
            {children}
        </Drawer>
    )
}

export default DrawerComponent