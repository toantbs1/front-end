import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import HeaderComponent from './components/HeaderComponent/HeaderComponent'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './util'
import { jwtDecode } from 'jwt-decode'
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'

function App() {
  const user = useSelector((state) => state.user)
  const [loading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true)
    const { decode, storageData } = handleDecode();
    if (decode?.id) {
      handleGetDetailsUser(decode?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  const handleDecode = () => {
    let storageData = JSON.stringify(localStorage.getItem('access_token'))
    let decode = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decode = jwtDecode(storageData)
    }
    return { decode, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const { decode } = handleDecode()
    const currentTime = new Date()
    if (decode?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Beare ${data?.access_token}`
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  })
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))

  }

  return (
    <div>
      <Loading isPending={loading}>
        <Router>
          <Routes>
            {
              routes.map((route) => {
                const Page = route.page
                const ischeckAuth = !route.isPrivate || user.isAdmin
                const Layout = route.isShowHeader ? DefaultComponent : Fragment
                return (
                  <Route key={route.path} path={ischeckAuth ? route.path : undefined} element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                )
              })
            }
          </Routes>
        </Router>
      </Loading>

    </div>
  )
}

export default App