import React from 'react'
import logo from '../Assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
    <header className='flex justify-center items-center py-3 h-20 shadow-lg bg-white'>
        <img src={logo} alt= 'logo' height={180} width={60}  />
    </header>
    { children }
    </>
  )
}

export default AuthLayouts
