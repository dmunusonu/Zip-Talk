import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'

import Sidebar from '../components/Sidebar'
import logo from '../Assets/logo.png'
import io from'socket.io-client'
const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const location = useLocation()
  

   
  const fetchUserDetails= async()=>{
    try{
         const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response= await axios({
        url: URL,
        withCredentials :true
      })
      dispatch(setUser(response.data.data))
      if (response.data.data.logout) {
        dispatch(logout())
        navigate("/email")
      }
      console.log("current user details",response)
      
  }
  catch(error){
    console.log("error",error)

  }}
  useEffect(()=>{
    fetchUserDetails()
  },[])

  /**
   * socket connection
   */
  useEffect(()=>{
    const socketConnection=io(process.env.REACT_APP_BACKEND_URL,{
      auth :{
        token : localStorage.getItem('token')
      }
    })
    socketConnection.on('onlineUser',(data)=>{
      console.log("onlineUser",data)
      dispatch(setOnlineUser(data))
      })
      dispatch(setSocketConnection(socketConnection))
      
    return ()=>{
      socketConnection.disconnect()
    }
  },[])

  const basepath=location.pathname ==='/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen '>
     <section className={`bg-zinc-300 ${!basepath && "hidden"} lg:block`}>
      < Sidebar />
     </section>
     {/* message component */}
      <section className={`${basepath && "hidden"}`}>
        <Outlet  />
      </section>
    <div className={` justify-center items-center flex-col gap-2 hidden ${!basepath ? "hidden": "lg:flex"}`}>
      <div>
        <img src={logo} alt="logo" width={250} />
      </div>
      <p className='text-lg text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
