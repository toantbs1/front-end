import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../util'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        price: '',
        rating: '',
        description: '',
        image: '',
        countInStock: '',
    });
    const [stateProductDetail, setStateProductDetail] = useState({
        name: '',
        type: '',
        price: '',
        rating: '',
        description: '',
        image: '',
        countInStock: '',
    });
    const [form] = Form.useForm()
    const mutation = useMutationHook(
        (data) => {
            const {
                name,
                type,
                price,
                rating,
                description,
                image,
                countInStock } = data
            const res = ProductService.createProduct(
                {
                    name,
                    type,
                    price,
                    rating,
                    description,
                    image,
                    countInStock,
                })
            return res
        }
    )

    const mutationUpdate = useMutationHook(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            const res = ProductService.updateProduct(
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
            const res = ProductService.deleteProduct(
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
            const res = ProductService.deleteManyProduct(
                Ids,
                token,

            )
            return res
        }
    )

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { isPending: isPendingProducts, data: products } = queryProduct
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

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
        setStateProductDetail({
            name: '',
            type: '',
            price: '',
            rating: '',
            description: '',
            image: '',
            countInStock: '',
        })
        form.resetFields()
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch()
                }
            })
    }

    const handleDeleteManyProduct = (Ids) => {
        mutationDeleteMany.mutate({ Ids: Ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch()
                }
            })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            price: '',
            rating: '',
            description: '',
            image: '',
            countInStock: '',
        })
        form.resetFields()
    };
    const onFinish = () => {
        mutation.mutate(stateProduct,
            {
                onSettled: () => {
                    queryProduct.refetch()
                }
            })
    }
    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetail },
            {
                onSettled: () => {
                    queryProduct.refetch()
                }
            })
    }
    const handleOnChange = (e) => {
        setStateProduct({ ...stateProduct, [e.target.name]: e.target.value })
    }
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateProduct({ ...stateProduct, image: file.preview })
    }
    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetail({
                name: res?.data?.name,
                type: res?.data?.type,
                price: res?.data?.price,
                rating: res?.data?.rating,
                description: res?.data?.description,
                image: res?.data?.image,
                countInStock: res?.data?.countInStock,
            })
        }
        setIsPendingUpdate(false)

    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetail)
    }, [form, stateProductDetail])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsPendingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const handleOpenDeleteProduct = () => {
        setIsModalOpenDelete(true)
    }

    const handleOnChangeDetail = (e) => {
        setStateProductDetail({ ...stateProductDetail, [e.target.name]: e.target.value })
    }
    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setStateProductDetail({ ...stateProductDetail, image: file.preview })
    }
    const renderAction = () => {
        return (
            <div>
                <EditOutlined onClick={handleDetailsProduct} style={{ color: 'rgb(26, 148, 255)', cursor: 'pointer', fontSize: '30px' }} />
                <DeleteOutlined onClick={handleOpenDeleteProduct} style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
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
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '< 50',
                    value: '<',
                },

            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                }
                else if (value === '<') {
                    return record.price < 50
                }
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 4',
                    value: '>=',
                },
                {
                    text: '< 4',
                    value: '<',
                },

            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 4
                }
                else if (value === '<') {
                    return record.rating < 4
                }
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    })
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => { setIsModalOpen(true) }}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} data={dataTable} isPending={isPendingProducts} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }, // click row
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isPending={isPending}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ borderTop: '1px solid #cccccc', paddingTop: '20px' }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your Type!' }]}
                        >
                            <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="CountInStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your Count in Stock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your Price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your Rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your Description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your Image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                <Button >Select file</Button>
                                {
                                    stateProduct?.image && (
                                        <img src={stateProduct?.image} style={{
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
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
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
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <InputComponent value={stateProductDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your Type!' }]}
                        >
                            <InputComponent value={stateProductDetail.type} onChange={handleOnChangeDetail} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="CountInStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your Count in Stock!' }]}
                        >
                            <InputComponent value={stateProductDetail.countInStock} onChange={handleOnChangeDetail} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your Price!' }]}
                        >
                            <InputComponent value={stateProductDetail.price} onChange={handleOnChangeDetail} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your Rating!' }]}
                        >
                            <InputComponent value={stateProductDetail.rating} onChange={handleOnChangeDetail} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your Description!' }]}
                        >
                            <InputComponent value={stateProductDetail.description} onChange={handleOnChangeDetail} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your Image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetail} maxCount={1}>
                                <Button >Select file</Button>
                                {
                                    stateProductDetail?.image && (
                                        <img src={stateProductDetail?.image} style={{
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

export default AdminProduct