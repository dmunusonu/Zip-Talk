import React, { useState,useRef } from 'react'
import { PiUserCircle } from "react-icons/pi";
import upload from'../Assets/upload.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const EmailPage = () => {
  
const navigate= useNavigate();
const location=useLocation();
console.log(location)

  const [data,setData]=useState({
    email : "",
  })

  

  
  
const handleSubmit=async(e)=>{
e.preventDefault()


const URL= `${process.env.REACT_APP_BACKEND_URL}/api/email`

try {
   const response= await axios.post(URL,data)
toast.success(response.data.message)
if (response.data.sucess) {
  setData({
    
    email :""
    
  })
  navigate('/password',{
    state: response?.data?.data
    
  })
  
}
   
} catch (error) {
  toast.error(error?.response?.data?.message)
  console.log("error here",error)
  
}
}

  const handleOnChange = (e)=>{
    const {name, value}=e.target
    setData(
      {...data, [name]: value})
  }
  return (
<div>
      <div className='mt-5'>
    <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-5 mx-auto'>
      <div className='w-fit mx-auto'>
      <PiUserCircle 
      size={70}
      
      />
      </div>
      <h1 className='text-2xl font-bold text-center mb-5'>Welcome to Zip-Talk</h1>

    

      <form  className='grid gap-4 mt-5' onSubmit={handleSubmit}>
       
      
       
        
        <div className=' flex flex-col gap-1'>
          <label htmlFor="email">Email :</label>
          <input type="email"
           id="email" 
           name="email"
            placeholder="Enter Registered Email"
            className='bg-slate-100 px-2 py-1 rounded focus:outline-primary'
            value={data.email} 
            onChange={handleOnChange}/>
        </div>
       
        <button className='bg-secondary text-lg px-4 py-1 hover:bg-primary rounded mt-4 font-bold text-white leading-relaxed tracking-wider'>
          Verify
          </button>
       
      </form>
      <p className='my-3 text-center'>Create an account ? <Link to={"/register"} className='hover:text-primary font-semibold'>Register</Link></p>
    </div>
      </div>
    </div>
  )
}

export default EmailPage
