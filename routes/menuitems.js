const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/menu');
const Restaurant = require('../models/restaurant');

router.get('/', (req,res,next)=>{
    MenuItem.find().exec().then(docs=>{
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc=>{
                return{
                    _id: doc._id,
                    restaurantId: doc.restaurantId,
                    name: doc.name,
                    price: doc.price,
                    veg: doc.veg,
                    jain_option: doc.jain_option,
                    category: doc.category,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3002/menu/'+doc._id
                    }
                }
            }),
        });
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    })
});

router.post('/', (req,res,next)=>{
    Restaurant.findById(req.body.restaurantId).then(item=>{
        if(!item){
            res.status(500).json({
                message: 'Restaurant Not Found'
            });
            return ;
        }
        const newItem = new MenuItem({
          _id: new mongoose.Types.ObjectId(),
          restaurantId: req.body.restaurantId,
          name: req.body.name,
          price: req.body.price,
          veg: req.body.veg,
          jain_option: req.body.jain_option,
          category: req.body.category,
        });
        return newItem.save()
    }).then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'MenuItem created',
            createdMenuItem:{
              _id: result._id,
              restaurantId: result.restaurantId,
              name: result.name,
              price: result.price,
              veg: result.veg,
              jain_option: result.jain_option,
              category: result.category,
            },
            request:{
                type: 'GET',
                url: 'http://localhost:3002/menu/'+result._id
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.get('/:menuId', (req,res,next)=>{
    MenuItem.findById(req.params.orderId).exec().then(item=>{
        if(!item){
            res.status(404).json({
                message: 'MenuItem Not Found'
            })
        }
        res.status(200).json({
          _id: item._id,
          restaurantId: item.restaurantId,
          name: item.name,
          price: item.price,
          veg: item.veg,
          jain_option: item.jain_option,
          category: item.category,
            request:{
                type: 'GET',
                url: 'http://localhost:3002/menu/'
            }
        }).catch(err=>{
            res.status(500).json({
                error: err
            })
        })
    })
});

router.patch('/:menuId', (req,res,next)=>{
    const id = req.params.menuId;
    MenuItem.update({_id: id}, {$set: req.body}).exec().then(result=>{
        res.status(200).json({
            message: 'Menu Updated',
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

router.delete('/:menuId', (req,res,next)=>{
    MenuItem.remove({_id: req.params.menuId}).exec().then(result=>{
        res.status(200).json({
            message: 'MenuItem Deleted',
            request:{
                type: 'GET',
                url: 'http://localhost:3002/menu/'
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;
