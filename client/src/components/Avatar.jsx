import React from 'react';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';
import { setOnlineUser } from '../redux/userSlice';
const Avatar = ({ userId, imageUrl, name, height, width }) => {
 
 const onlineUser= useSelector(state => state?.user?.onlineUser)
 
  let avatarName = "";
 
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    'bg-gray-600',
    'bg-red-500',
    'bg-orange-300',
    'bg-orange-950',
    'bg-amber-500',
    'bg-yellow-400',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
  ];
  const random = Math.floor(Math.random() * 10);
 const isOnline = onlineUser.includes(userId)
  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={` relative rounded-full flex justify-center items-center ${bgColor[random]}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          height={height}
          width={width}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <span
          style={{
            fontSize: `${Math.min(width, height) / 2}px`, // Adjust font size dynamically
          }}
        >
          {avatarName}
        </span>
      ) : (
        <PiUserCircle size={Math.min(width, height)} />
      )}
      {
        isOnline && (
          <div className=' bg-green-500 p-1.5 absolute bottom-0 right-0 rounded-full z-10'>
            
          </div>
        )
      }
    </div>
  );
};

export default Avatar;
