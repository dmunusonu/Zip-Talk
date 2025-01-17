import React, { useState,useRef, useEffect } from 'react'

import Avatar from '../components/Avatar';
import { Link, useNavigate,useLocation } from 'react-router-dom';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const PasswordPage = () => {
  
  
const navigate= useNavigate();
const location= useLocation();
const dispatch= useDispatch();


useEffect(()=>{
  if (!location?.state?.name ){
    navigate('/email')
  }
})

  const [data,setData]=useState({ 
    password:"",
    userId:""
  })

  
  
  
const handleSubmit=async(e)=>{
e.preventDefault()


const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
try {
   const response= await axios({
    method: 'POST',
    url: URL,
    data :{
      userId : location?.state?._id,
      password : data.password
    },
    withCredentials :true
})
   
toast.success(response.data.message)

if (response.data.success) {
  dispatch(setToken(response?.data?.token))
  localStorage.setItem('token',response?.data?.token)
  setData({
    password :""
  })
  navigate('/home')
  
}
   
} catch (error) {
  toast.error(error?.response?.data?.message)
  
}
}

  const handleOnChange = (e)=>{
    const {name, value}=e.target
    setData(
      {...data,
         [name]: value})
  }
  return (
<div>
      <div className='mt-5'>
    <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-5 mx-auto'>
      <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
      {/* <PiUserCircle 
      size={70}
      
      /> */}
      <Avatar 
      height={70}
      width={70}
      name={location?.state?.name}
      imageUrl={location?.state?.profile_pic} />
      </div>
      <h1 className='text-2xl font-bold text-center mb-5'>{location?.state?.name}</h1>

    

      <form  className='grid gap-4 mt-5' onSubmit={handleSubmit}>
       
      
       
        
       
        <div className=' flex flex-col gap-1'>
          <label htmlFor="password">Password :</label>
          <input type="password"
           id="password" 
           name="password"
            placeholder="Enter Password"
            className='bg-slate-100 px-2 py-1 rounded focus:outline-primary'
            value={data.password } 
            onChange={handleOnChange}/>
        </div>
        <button className='bg-secondary text-lg px-4 py-1 hover:bg-primary rounded mt-4 font-bold text-white leading-relaxed tracking-wider'>
          Sign in
          </button>
       
      </form>
      <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password ?</Link></p>

    </div>
      </div>
    </div>
  )
}

export default PasswordPage
