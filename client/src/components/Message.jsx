import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile'
import { IoClose } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import backGround from '../Assets/background.jpg'
import LoadingSpinner from './LoadingSpinner'
import moment from 'moment'
const Message = () => {
  
  const params= useParams()
  const user= useSelector(state=>state?.user)
  const socketConnection=useSelector(state=>state?.user?.socketConnection)
const[dataUser,setDataUser]= useState({
  name:"",
  email:"",
  profile_pic : "",
  online : false,
  _id:""
})
const [openImageVideoUpload,setOpenImageVideoUpload]= useState(false)
const [message,setMessage]=useState({
  text:"",
  imageUrl:"",
  videoUrl:""
})
const [loading,setLoading]= useState(false)
const[allMessages,setAllMessages]=useState([])
const currentMessage = useRef()
  
useEffect(()=>{
if(currentMessage.current){
  currentMessage.current.scrollIntoView({behavior:"smooth",block:"end"})
}
})


const handleUploadImageVideoOpen=()=>{
  setOpenImageVideoUpload(preve=>!preve)
}

const handleUploadImage=async(e)=>{
 const file=e.target.files[0]
 setLoading(true)
 const uploadPhoto = await uploadFile(file)
 setLoading(false)
 setOpenImageVideoUpload(false)
 setMessage(preve=>{
  return{
    ...preve,
    imageUrl:uploadPhoto.url
  }
 })

}

const handleClearUploadImage=()=>{
  setMessage(preve=>{
    return{
      ...preve,
      imageUrl:""
    }
   })
}


const handleUploadVideo=async(e)=>{
  const file=e.target.files[0]
  setLoading(true)
  const uploadPhoto = await uploadFile(file)
  setLoading(false)
  setOpenImageVideoUpload(false)

  setMessage(preve=>{
    return{
      ...preve,
      videoUrl:uploadPhoto.url
    }
   })
}
const handleClearUploadVieo=()=>{
  setMessage(preve=>{
    return{
      ...preve,
      videoUrl:""
    }
   })
}



  useEffect(()=>{
    if (socketConnection && params.userid) {
      // Validate that userid is not "home" or invalid
      if (params.userid === "home" || params.userid.length !== 24) {  // MongoDB ObjectIds are 24 chars
        console.error("Invalid user ID:", params.userid);
        return;
      }
  
      socketConnection.emit('message-page', params.userid);
      socketConnection.emit('seen', params.userid);
      
      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });
  
      socketConnection.on('message', (data) => {
        setAllMessages(data);
      });
  
      // Clean up socket listeners
      return () => {
        socketConnection.off('message-user');
        socketConnection.off('message');
      };
    }
  }, [socketConnection, params?.userid, user]);

const handleOnChange=(e)=>{
  const {name,value}=e.target
  setMessage(preve=>{
    return{
      ...preve,
      text: value
    }
  })
}

const handleSendMessage=(e)=>{
e.preventDefault()
if(message.text||message.imageUrl||message.videoUrl){
   if (socketConnection && params.userid && params.userid !== "home") {
    socketConnection.emit('new message',{
      text:message.text,
      imageUrl:message.imageUrl,
      videoUrl:message.videoUrl,
      sender:user._id,
      receiver: params.userid,
      msgByUserId:user?._id
  })
  setMessage({
    text:"",
    imageUrl:"",
    videoUrl:""
  })
  }
}
}




  return (
    <div style={{backgroundImage : `url(${backGround})`}} className='bg-no-repeat bg-cover'>
      <header className='flex justify-between items-center px-4 sticky top-0 h-16 bg-white'>
          <div className='flex items-center gap-4 '>
          <button onClick={() => window.history.back()} className="lg:hidden">
           <FaAngleLeft size={25} />
          </button>
            <div className='mt-1'>
              <Avatar 
              height={45}
              width={45}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
              
              />
            </div>
            <div>
              <h3 className='font-semibold text-lg my-0'>{dataUser.name}</h3>
              <p className='-my-2 '>
                {dataUser.online ? <span className='text-blue-400'>online</span>:<span className='text-gray-400'>offline</span>}
              </p>
            </div>
          </div>
          <div>
            <button className='  text-xl cursor-pointer hover:text-slate-400'>
            <HiDotsVertical />
            </button>
          </div>
      </header>
    {/* user chat section */}
    <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-400 bg-opacity-50'>
           


          { /**show all messages */}
          <div ref={currentMessage} className='flex flex-col gap-2 p py-2 mx-2'>
            {
              allMessages.map((msg,index)=>{
                return(
                  <div  className={` p-1 py-1 rounded w-fit ${user._id === msg.msgByUserId? "ml-auto bg-teal-100":"bg-white"}`}>
                      <div className="w-full">
                          {msg?.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              className="w-auto max-w-[200px] max-h-[200px] rounded object-cover"
                              alt="Chat Image"
                            />
                               )}
        
                                            {msg?.videoUrl && (
                                              <video
                                                src={msg.videoUrl}
                                                className="w-auto max-w-[200px] max-h-[200px] rounded object-cover"
                                                alt="video"
                                                controls
                                              />
                                            )}
                                     </div>


                    <p className='px-2 text-lg text-ellipsis break-words whitespace-pre-wrap break-all'>{msg.text}</p>
                    <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                  </div>
                )
              })
            }
          </div>

             {/* display upload image */}
           {
            message.imageUrl &&(
              <div className='sticky bottom-0 h-full w-full bg-slate-600 bg-opacity-30 flex justify-center items-center rounded-lg overflow-hidden'>
                    <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadImage}>
                        <IoClose
                        size={30} />

                    </div>
                  <div className='bg-white p-3'>
                      <img src={message.imageUrl}
                      className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                      alt="Upload Image" />
                  </div>
            </div>
            )
           }
           
           {
            message.videoUrl &&(
              <div className=' sticky bottom-0 h-full w-full bg-slate-600 bg-opacity-30 flex justify-center items-center rounded-lg overflow-hidden'>
                    <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadVieo}>
                        <IoClose
                        size={30} />

                    </div>
                  <div className='bg-white p-3'>
                     <video src={message.videoUrl}
                    controls
                    autoPlay
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'>
                     </video>
                  </div>
            </div>
            )
           }
           
           {
            loading &&(
              
              < div className='sticky bottom-0 h-full w-full flex justify-center items-center'>
                  <LoadingSpinner/>
              
              </div>
            )
          } 
           
    </section>
    {/* send section */}

    <section className='h-16 bg-white flex items-center px-4'>
      <div className=' relative'>
           <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-slate-400 hover:text-white'>
               <FaPlus size={20} />
           </button>
           {/* audio images and videos */}
           {
            openImageVideoUpload &&(
              <div className='bg-white shadow rounded-md absolute bottom-14 w-36 p-2'>
              <form action="">
                    <label htmlFor="uploadImage" className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 rounded-lg cursor-pointer'>
                        <div className='text-blue-400 '>
                          <FaImage size={18} />
                        </div>
                        <p>Image</p>
                    </label>
                    <label htmlFor="uploadVideo" className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 rounded-lg cursor-pointer'>
                        <div className='text-purple-400'>
                          <FaVideo size={18} />
                        </div>
                        <p>Video</p>
                    </label>
                    <input 
                    className='hidden'
                    type="file"
                    id='uploadImage' 
                    onChange={handleUploadImage}
                    />
                     <input 
                     className='hidden'
                    type="file"
                    id='uploadVideo' 
                    onChange={handleUploadVideo}
                    />
              </form>
        </div>
            )
           }
          
      </div>
      {/* input box */}
      <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
      
        <input type="text" 
        placeholder='Type Message'
        className='py-1 px-4 outline-none w-full h-full'
        value={message.text}
        onChange={handleOnChange} />
      <button className='hover:text-blue-400'>
        <IoSend size={30}/>
      </button>
      </form>
    </section>
    </div>
  )
}

export default Message
