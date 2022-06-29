const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");


// REGISTER
router.post('/register', async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // save user return respond
        const userCreds = await user.save()
        res.status(200).json(userCreds)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // !user && res.status(404).json("user not found")
        if(!user) {
            res.status(404).json("User not found")
            return ;
        }

        const validPass = await bcrypt.compare(req.body.password, user.password)
        
        if(!validPass){
            res.status(400).json("wrong password");
            return ;
        }

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;