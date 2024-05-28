import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover } from 'antd'
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextHeaderSmall, WrapperContentPopup } from './style'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlice';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }
    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        localStorage.removeItem('access_token')
        setLoading(false)
    }
    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup >
            <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    }

    return (
        <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}>
            <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
                <Col span={5}>
                    <WrapperTextHeader style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        LAPTRINH
                    </WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                        <ButtonInputSearch
                            size="large"
                            textButton="Tìm kiếm"
                            placeholder="input search text"
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <Loading isPending={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <img src={userAvatar} alt="avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <UserOutlined style={{ fontSize: '30px' }} />
                            )}
                            {user?.access_token ? (
                                <Popover content={content} style={{ cursor: 'pointer' }} trigger="click">
                                    <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.name}</div>
                                </Popover>
                            ) : (
                                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <div>
                            <Badge count={4} size={'small'}>
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: 'white' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                </Col>
            </WrapperHeader>
        </div>
    )
}

export default HeaderComponent