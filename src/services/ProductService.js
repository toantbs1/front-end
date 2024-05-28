import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search) => {
    let res = {}
    if (search.length) {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all?filter=name&filter=${search}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/get-all`)
    }

    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_KEY}/product/create`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_KEY}/product/detail/${id}`)
    return res.data
}

export const updateProduct = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_KEY}/product/update/${id}`, data, {
        headers: {
            token: `Beare ${access_token}`,
        },
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_KEY}/product/delete/${id}`, {
        headers: {
            token: `Beare ${access_token}`,
        },
    })
    return res.data
}
export const deleteManyProduct = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/product/delete-many`, data, {
        headers: {
            token: `Beare ${access_token}`,
        },
    })
    return res.data
}