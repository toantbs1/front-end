import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import * as message from '../../components/Message/Message'
import { useMutationHook } from '../../hooks/useMutationHook'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../util'
import { useSelector } from 'react-redux'

const AdminUser = () => {

    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);

    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: '',
        address: '',
        avatar: '',
    });
    const [form] = Form.useForm()

    const mutationUpdate = useMutationHook(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,
                { ...rests },
                token,

            )
            return res
        }
    )
    const mutationDelete = useMutationHook(
        (data) => {
            const {
                id,
                token } = data
            const res = UserService.deleteUser(
                id,
                token,
            )
            return res
        }
    )

    const mutationDeleteMany = useMutationHook(
        (data) => {
            const {

                token, ...Ids } = data
            const res = UserService.deleteManyUser(
                Ids,
                token,

            )
            return res
        }
    )

    const getAllUser = async () => {
        const res = await UserService.getAllUser()
        return res
    }

    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser })
    const { isPending: isPendingUsers, data: users } = queryUser
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated, isErrorUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted, isErrorDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            isAdmin: '',
            address: '',
            avatar: '',
        })
        form.resetFields()
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch()
                }
            })
    }

    const handleDeleteManyUser = (Ids) => {
        mutationDeleteMany.mutate({ Ids: Ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch()
                }
            })
    }
    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetail },
            {
                onSettled: () => {
                    queryUser.refetch()
                }
            })
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetail({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
            })
        }
        setIsPendingUpdate(false)

    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetail)
    }, [form, stateUserDetail])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsPendingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    const handleOpenDeleteUser = () => {
        setIsModalOpenDelete(true)
    }

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value })
    }
    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateUserDetail({ ...stateUserDetail, avatar: file.preview })
    }
    const renderAction = () => {
        return (
            <div>
                <EditOutlined onClick={handleDetailsUser} style={{ color: 'rgb(26, 148, 255)', cursor: 'pointer', fontSize: '30px' }} />
                <DeleteOutlined onClick={handleOpenDeleteUser} style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters) => {
        clearFilters();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },

            ],
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isAdmin === 'True'
                }
                else if (value === false) {
                    return record.isAdmin === 'False'
                }
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone'),

        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),

        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'True' : 'False' };
    })

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} data={dataTable} isPending={isPendingUsers} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }, // click row
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isPending={isPendingDeleted}>
                    <div>Bạn có chác chắn muốn xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
                <Loading isPending={isPendingUpdate || isPendingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        style={{ paddingTop: '20px' }}
                        initialValues={{ remember: true }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <InputComponent value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <InputComponent value={stateUserDetail.email} onChange={handleOnChangeDetail} name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your Phone!' }]}
                        >
                            <InputComponent value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Admin"
                            name="isAdmin"
                            rules={[{ required: true, message: 'Please input your isAdmin!' }]}
                        >
                            <InputComponent value={stateUserDetail.isAdmin} onChange={handleOnChangeDetail} name="isAdmin" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <InputComponent value={stateUserDetail.address} onChange={handleOnChangeDetail} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[{ message: 'Please input your avatar!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetail} maxCount={1}>
                                <Button >Select file</Button>
                                {
                                    stateUserDetail?.avatar && (
                                        <img src={stateUserDetail?.avatar} style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }} alt='avatar' />
                                    )
                                }
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
        </div>
    )
}

export default AdminUser