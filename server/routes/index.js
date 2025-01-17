const express= require('express');
const RegisterUser = require('../controller/RegisterUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logout = require('../controller/logout');
const updateUser = require('../controller/updateUser');
const SearchUser=require('../controller/SearchUser')
const router= express.Router();
// create user api
router.post('/register',RegisterUser)
// check user email
router.post('/email',checkEmail)
// check user password
router.post('/password',checkPassword)
// login user details
router.get('/user-details',userDetails)
//  logout 
router.get('/logout',logout)
// update user details
router.post('/update-user',updateUser)
//search user
router.post('/search-user',SearchUser)
module.exports = router;