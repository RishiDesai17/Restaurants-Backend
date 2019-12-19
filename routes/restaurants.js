const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const MenuItem = require('../models/menu');

router.get('/', (req,res,next)=>{
  Restaurant.find((err,found) => {
      if(!err){
        MenuItem.find((err1,found1) => {
            if(!err1){
              found.forEach(x => {
                let newArr = found1.filter(item=>{item.restaurantId===x._id})
                x.menu=newArr;
              });
              const response = {
                count: found.length,
                restaurants: found.map(item=>{
                  return {
                    name: item.name,
                    address: item.address,
                    _id: item._id,
                    menu: found1,
                    request:{
                      type: 'GET',
                      url: 'http://localhost:3002/restaurant/'+item._id
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

router.post('/', (req,res,next)=>{
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
    const id = req.params.restaurantId;
    Restaurant.findById(id).select('name price _id').exec().then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json({
              name: doc.name,
              address: doc.address,
              _id: doc._id,
              menu: MenuItem.filter(item=>{doc._id===item.RestaurantId})
            });
        }
        else{
            res.status(404).json({message: "No valid entry found for provided ID"})
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
});

router.patch('/:restaurantId', (req,res,next)=>{
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

router.delete('/:restaurantId', (req,res,next)=>{
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
