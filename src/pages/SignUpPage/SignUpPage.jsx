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

const SignUpPage = () => {
    const navigate = useNavigate()
    const mutation = useMutationHook(
        data => UserService.signupUser(data)
    )

    const { data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    })

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }
    const handleSignUp = () => {
        mutation.mutate({
            email,
            password,
            confirmPassword
        })

    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ccc',
                height: '100vh'
            }}>
            <div style={{
                display: 'flex',
                width: '800px',
                height: '445px',
                borderRadius: '6px',
                background: 'white'
            }}>
                <WrapperContainerLeft>
                    <p style={{ fontSize: '24px' }}>Xin chào</p>
                    <p style={{ fontSize: '14px' }}>Đăng nhập và tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder='abc@gmail.com'
                        value={email}
                        onChange={handleOnChangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <InputForm
                            style={{ marginBottom: '10px' }}
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
                    <div style={{ position: 'relative' }}>
                        <InputForm
                            placeholder=' confirm password'
                            type={isShowConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleOnChangeConfirmPassword} />
                        <span
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            style={{
                                zIndex: '18px',
                                position: 'absolute',
                                top: '11px',
                                right: '8px',
                            }}>
                            {
                                isShowConfirmPassword ? (
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
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px',
                            }}
                            textButton={'Đăng ký'}
                            styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                    <p style={{ fontSize: '14px', paddingTop: '5px' }}>Bạn đã có tài khoản? <WrapperTextLight style={{ cursor: 'pointer' }} onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight></p>
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

export default SignUpPage