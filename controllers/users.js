const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req,res,next)=>{
    User.find({email: req.body.email}).exec().then(user=>{
        if(user.length>0){
            res.status(409).json({
                message: "Email exists"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        })
                    }).catch(err=>{
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
}

exports.login = (req,res,next)=>{
    User.find({email: req.body.email}).exec().then(user=>{
        if(user.length===0){
            return res.status(401).json({
                message: 'Authorization failed'
            })
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
                if(err){
                    res.status(401).json({
                        message: 'Authorization failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, "SECRETKEY", {
                        expiresIn: '1h'
                    })
                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token
                    })
                }
                else{
                    return res.status(401).json({
                        message: 'Authorization failed'
                    })
                }
            })
        }
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    })
}

exports.delete_user =  (req,res,next)=>{
    User.remove({_id: req.params.userId}).exec().then(result=>{
        res.status(200).json({
            message: "user Deleted"
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    })
}
