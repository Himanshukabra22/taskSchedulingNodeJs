const express = require("express")
const router = express.Router()

const {registerUser,loginUser, updateUser} = require('../controllers/userauth.js')
const {protect} = require('../middlewares/authMiddleware')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/update').put(protect,updateUser)

module.exports = router;