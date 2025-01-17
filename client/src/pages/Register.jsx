import React, { useState,useRef } from 'react'
import upload from'../Assets/upload.png'
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
const Register = () => {
const [image,setImage]=useState("");
const navigate= useNavigate();

  const [data,setData]=useState({
    name: "",
    email : "",
    password : "",
    profile_pic: ""
  })

  const inputRef=useRef(null);

  const handleImageClick=()=>{
    inputRef.current.click();

  }
  const handleImageChange=async(event)=>{
    const file = event.target.files[0];
    console.log(file[0]);
    setImage(event.target.files[0]);
    const uploadPhoto= await uploadFile(file);
    setData({...data,profile_pic:uploadPhoto?.url})
    console.log("uploadphoto",uploadPhoto)

    

  }
const handleSubmit=async(e)=>{
e.preventDefault()


const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
try {
   const response= await axios.post(URL,data)
toast.success(response.data.message)
if (response.data.success) {
  setData({
    name: "",
    email : "",
    password : "",
    profile_pic: ""
  })
  navigate('/email')
}
   
} catch (error) {
  toast.error(error?.response?.data?.message)
  
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
    <h1 className='text-2xl font-bold text-center mb-5'>Welcome to Zip-Talk</h1>


      <form  className='grid gap-4 mt-5' onSubmit={handleSubmit}>
       
      <div className='h-30 w-32 ml-24 mx-auto cursor-pointer ' onClick={handleImageClick}>
        {image ? <img src={URL.createObjectURL(image)} alt="" />:<img src={upload} alt="" />}
          <input className='rounded-full' onChange={handleImageChange} style={{display:'none'}} type="file" name="profile_pic" id="profile_pic" ref={inputRef}  />
        </div>
       
        <div className=' flex flex-col gap-1'>
          <label htmlFor="name">Name :</label>
          <input type="text"
           id="name" 
           name="name"
            placeholder="Enter Your Name"
            className='bg-slate-100 px-2 py-1 rounded focus:outline-primary'
            value={data.name} 
            onChange={handleOnChange}/>
        </div>
        <div className=' flex flex-col gap-1'>
          <label htmlFor="email">Email :</label>
          <input type="email"
           id="email" 
           name="email"
            placeholder="Enter Your Email"
            className='bg-slate-100 px-2 py-1 rounded focus:outline-primary'
            value={data.email} 
            onChange={handleOnChange}/>
        </div>
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
          Register
          </button>
       
      </form>
      <p className='my-3 text-center'>Already have an account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
    </div>
      </div>
    </div>
  )
}

export default Register
