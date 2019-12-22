const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const MenuItem = require('../models/menu');
const checkAuth = require('../middleware/check-auth');

router.get('/', (req,res,next)=>{
  Restaurant.find((err,found) => {
      if(!err){
        MenuItem.find((err1,found1) => {
            if(!err1){
              found.forEach(x => {
                found1.forEach(item=>{
                  if(item.restaurantId.toString()===x._id.toString()){
                    x.menu.push(item);
                  }
                });
              });
              const response = {
                count: found.length,
                restaurants: found.map(restro=>{
                  return {
                    name: restro.name,
                    address: restro.address,
                    _id: restro._id,
                    menu: restro.menu,
                    request:{
                      type: 'GET',
                      url: 'http://localhost:3002/restaurant/'+restro._id
                    }
                }
            })
          }
          res.status(200).json(response);
      }
      else{
          res.status(500).json({
            error: err
          });
      }
    })
  }
 });
});

router.post('/',checkAuth, (req,res,next)=>{
    const restaurant = new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        menu: []
    });
    restaurant.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Handling post req',
            createdRestaurant: {
                name: result.name,
                address: result.address,
                _id: result._id,
                menu: result.menu,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3002/restaurant/'+result._id
                }
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

});

router.get('/:restaurantId', (req,res,next)=>{
  Restaurant.findOne({_id: req.params.restaurantId},(err,found) => {
      if(!err){
        MenuItem.find((err1,found1) => {
            if(!err1){
              console.log(found);

                found1.forEach(item=>{
                  if(item.restaurantId.toString()===found._id.toString()){
                    found.menu.push(item);
                  }
                });

              const response = {
                count: found.length,
                restaurants: found
          }
          res.status(200).json(response);
      }
      else{
          res.status(500).json({
            error: err
          });
      }
    })
  }
 });
});

router.patch('/:restaurantId',checkAuth, (req,res,next)=>{
    const id = req.params.restaurantId;
    Restaurant.update({_id: id}, {$set: req.body}).exec().then(result=>{
        res.status(200).json({
            message: 'Restaurant Updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3002/restaurant/'+id
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.delete('/:restaurantId',checkAuth, (req,res,next)=>{
    const id = req.params.restaurantId;
    Restaurant.remove({_id: id}).exec().then(result=>{
        res.status(200).json({
            message: 'restaurant deleted',
            request:{
                type: 'GET',
                url: 'http://localhost:3002/restaurant'
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;
