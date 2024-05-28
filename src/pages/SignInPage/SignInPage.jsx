import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogin from '../../assets/images/login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )

    const { data, isPending, isSuccess, isError } = mutation
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
            navigate('/')
            localStorage.setItem('access_token', data?.access_token)
            if (data?.access_token) {
                const decode = jwtDecode(data?.access_token)
                if (decode?.id) {
                    handleGetDetailsUser(decode?.id, data?.access_token)
                }
            }

        } else if (isError || data?.status === 'ERR') {
            message.error()
        }
    })

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const navigate = useNavigate()
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
            <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', background: 'white' }}>
                <WrapperContainerLeft>
                    <p style={{ fontSize: '24px' }}>Xin chào</p>
                    <p style={{ fontSize: '14px' }}>Đăng nhập và tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder='abc@gmail.com' value={email}
                        onChange={handleOnChangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <InputForm
                            placeholder='password'
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnChangePassword} />
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: '18px',
                                position: 'absolute',
                                top: '11px',
                                right: '8px',
                            }}>
                            {
                                isShowPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>

                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isPending={isPending}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px',
                            }}
                            onClick={handleSignIn}
                            textButton={'Đăng nhập'}
                            styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
                    <p style={{ fontSize: '14px', paddingTop: '5px' }}>Chưa có tài khoản?<WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogin} preview={false} alt='image-login' height='203px' width='203px' />
                    <h3>Mua sắm tại LT</h3>
                    <h3>Ưu đãi tại đây</h3>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage