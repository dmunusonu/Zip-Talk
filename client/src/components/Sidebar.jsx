import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import {  FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { TiUserAdd } from "react-icons/ti";
import SearchUser from './SearchUser';
import { logout } from '../redux/userSlice';
const Sidebar = () => {
  const user = useSelector((state) => state?.user);
    const[editUserOpen,setEditUserOpen]= useState(false);
    const [allUser,setAllUser]=useState([])
    const [openSearchUser,setOpenSearchUser]=useState(false)
  const socketConnection=useSelector(state=>state?.user?.socketConnection)
   const dispatch=useDispatch()
  const navigate=useNavigate()


   useEffect(()=>{
      if(socketConnection){
        socketConnection.emit('sidebar',user._id)
      socketConnection.on('conversation',(data)=>{
       


        const conversationUserData = data.map((conversationUser,index)=>{
         if(conversationUser?.sender?._id===conversationUser?.receiver?._id){
          return{
            ...conversationUser,
            userDetails:conversationUser.sender
          }
         }
         else if(conversationUser?.receiver?._id!==user?._id){
          return{
            ...conversationUser,
            userDetails:conversationUser.receiver
            }
         }
         else{
          return{
            ...conversationUser,
            userDetails:conversationUser.sender
            }
            
         }
        })



        setAllUser(conversationUserData)
      })
      
      }
   },[socketConnection,user])


const handleLogout=()=>{
  dispatch(logout())
  navigate("/email")
  localStorage.clear()
}

  








  return (
    <div className=' w-full h-full grid grid-cols-[48px,1fr] bg-white'>
      <div className=' bg-slate-400 w-12 h-full rounded-tr-sm rounded-br-sm py-5 text-zinc-600 flex flex-col justify-between'>
            <div>
                <NavLink className={({isActive})=>`h-12 w-12 hover:bg-zinc-300 rounded flex justify-center items-center cursor-pointer ${isActive && "bg-zinc-300"}`} title='Chat'>
                     <AiFillMessage 
                        size={25}
                     />
                </NavLink>
                <div onClick={()=>setOpenSearchUser(true)} className='h-12 w-12 hover:bg-zinc-300 rounded flex justify-center items-center cursor-pointer ' title='Add Person' >
                    <FaUserPlus 
                     size={25}
                     />

                </div>
            </div>

            <div className='flex flex-col items-center'>
              
                <button className='mx-auto py-3'title={user?.name} onClick={()=>setEditUserOpen(true)}>
                    < Avatar 
                  height={40}
                  width={40}
                  name={user?.name}
                  imageUrl={user?.profile_pic}
                  userId={user?._id}/>
                </button>
                 <button onClick={handleLogout} className='h-12 w-12 hover:bg-zinc-300 rounded flex justify-center items-center cursor-pointer ' title='Log Out' >
                <TbLogout2 
                size={25}/>
                </button>
            </div>
      </div>
      <div className='w-full'>
        <div className='h-16 flex items-center'>
        <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
        </div>
        <div className='bg-slate-200 p-[0.5px]'></div>
        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
            {
              allUser.length===0 &&(
                <div className='mt-12'>
                  <div className='flex justify-center items-center my-4 text-slate-500'>
                  <TiUserAdd 
                  size={50}/>
                    </div>
                    <p className='text-lg text-center text-slate-400'>Explore friends to start a conversation</p>
                  </div>
              )
            }
            {
              allUser.map((conver, index) => {
                return (
                <NavLink to={"/"+conver?.userDetails?._id} key={conver?._id} className='flex items-center gap-2 px-2 border py-3 border-transparent hover:bg-slate-300 rounded'>
                  <div>
                        <Avatar
                        imageUrl={conver?.userDetails?.profile_pic}
                        name={conver?.userDetails?.name} 
                        width={40}
                        height={40} />
                  </div>
                  <div>
                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conver?.userDetails?.name}</h3>
                  <div className='text-slate-500 text-sm flex items-center gap-1 '>
                      <div className='flex items-center gap-1'>
                        {
                          conver?.lastMsg?.imageUrl &&(
                           <div className='flex items-center gap-1'>
                             <span><FaImage/></span>
                            {!conver?.lastMsg?.text && <span>Image</span>} 
                           </div>
                          )
                        }
                        {
                          conver?.lastMsg?.videoUrl &&(
                           <div className='flex items-center gap-1'>
                             <span><FaVideo/></span>
                             {!conver?.lastMsg?.text && <span>Video</span>}
                           </div>
                          )
                        }
                      </div>

                    <p className='text-ellipsis line-clamp-1' >{conver?.lastMsg?.text}</p>
                  </div>
                  
                  </div>
                        {
                          Boolean(conver?.unseenMsg) &&(
                           <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-blue-400 text-white font-semibold rounded-full'>{conver?.unseenMsg}</p>
                          )
                        }
                </NavLink>
                )})
            }
        </div>
      </div>

      {/**Edit user details */}
      {
        editUserOpen &&(
          <EditUserDetails onClose ={()=>setEditUserOpen(false)} user = {user}/>
        )
      }
      {/* search user */}
      {
        openSearchUser && (
          <SearchUser onClose={()=>setOpenSearchUser(false)} user = {user}/>
        )
      }
    </div>
  )
}

export default Sidebar
