import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../util'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [phone, setPhone] = useState(user?.phone)
    const [address, setAddress] = useState(user?.address)
    const [avatar, setAvatar] = useState(user?.avatar)
    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )
    const dispatch = useDispatch()
    const { isPending, isSuccess, isError } = mutation

    useEffect(() => {
        setName(user?.name)
        setEmail(user?.email)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }

    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }
    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })

    }
    return (
        <div style={{ width: '1270px', margin: '0 auto' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isPending={isPending}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputForm
                            id="name"
                            style={{ width: '300px' }}
                            value={name}
                            onChange={handleOnChangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                background: 'white'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm
                            id="email"
                            style={{ width: '300px' }}
                            value={email}
                            onChange={handleOnChangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                background: 'white'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                        <InputForm
                            id="phone"
                            style={{ width: '300px' }}
                            value={phone}
                            onChange={handleOnChangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                background: 'white'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Address</WrapperLabel>
                        <InputForm
                            id="address"
                            style={{ width: '300px' }}
                            value={address}
                            onChange={handleOnChangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                background: 'white'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select file</Button>
                        </WrapperUploadFile>
                        {
                            avatar && (
                                <img src={avatar} style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }} alt='avatar' />
                            )
                        }
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px',
                                background: 'white'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26, 148, 255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage