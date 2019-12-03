const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/restaurantDB", { useNewUrlParser: true });

const menuItemsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  veg: String,
  jain_option: String,
  category: String,
});

const restaurantsSchema = new mongoose.Schema({
  name: String,
  address: String,
  menu: Object
});

const Restaurant = new mongoose.model("Restaurant", restaurantsSchema);
const MenuItem = new mongoose.model("MenuItem", menuItemsSchema);

let arr=[];
app.route("/menu")
  .get((req,res) => {
    MenuItem.find((err,found) => {
      if(!err){
          res.send(found);
      }
      else{
          res.send(err);
      }
    })
  })
  .post((req,res) => {
    const newItem = new MenuItem({
      name: req.body.name,
      price: req.body.price,
      veg: req.body.veg,
      jain_option: req.body.jain_option,
      category: req.body.category
    });
    newItem.save((err)=>{
      if(!err){
          res.send("success");
      }
      else{
          res.send(err);
      }
    });
  })
  .delete((req,res) => {
    MenuItem.deleteMany((err) => {
       if(!err){
           res.send("Successfully deleted all items");
       }
       else{
           res.send(err);
       }
   });
 });
 app.route("/menu/:id")
   .get((req,res) => {
     MenuItem.findOne({_id: req.params.id}, (err,found) => {
      if(found){
          res.send(found);
      }
      else{
        res.send(err);
      }
    })
   })
   .put((req,res) => {
     MenuItem.update(
      {_id: req.params.id},
      {name: req.body.name,
      price: req.body.price,
      veg: req.body.veg,
      jain_option: req.body.jain_option,
      category: req.body.category,
      },
      {overwrite: true},
      (err) => {
          if(!err){
              res.send("Success");
          }
          else{
              res.send(err);
          }
      }
    );
   })
   .patch((req,res) => {
      MenuItem.update(
          {_id: req.params.id},
          {$set: req.body},
          (err) => {
            if(!err){
                res.send("Success");
            }
            else{
                res.send(err);
            }
          }
      );
  })
   .delete((req,res) => {
      MenuItem.deleteOne(
        {_id: req.params.id},
        (err) => {
            if(!err){
                res.send("Success");
            }
            else{
                res.send(err);
            }
        }
     );
  });

app.route("/restaurants")
  .get((req,res) => {
    Restaurant.find((err,found) => {
      if(!err){
        MenuItem.find((err1,found1) => {
            if(!err1){
              found.forEach(x => {
                x.menu=found1;
              });
            }res.send(found);
        });

      }
      else{
          res.send(err);
      }
    })
  })
  .post((req,res) => {
    const newRes = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      menu: arr
     });
      newRes.save((err)=>{
        if(!err){
            res.send("success");
        }
        else{
            res.send(err);
        }
      });
   })
   .delete((req,res) => {
     Restaurant.deleteMany((err) => {
        if(!err){
            res.send("Successfully deleted all restaurants");
        }
        else{
            res.send(err);
        }
    });
  });

  app.route("/restaurants/:id")
    .get((req,res) => {
      Restaurant.findOne({_id: req.params.id}, (err,found) => {
       if(!err && found){
           res.send(found);
       }
       else{
         res.send(err);
       }
     })
    })
    .put((req,res) => {
      Restaurant.update(
       {_id: req.params.id},
       {name: req.body.name,
       address: req.body.address,
       menu: arr},
       {overwrite: true},
       (err) => {
           if(!err){
               res.send("Success");
           }
           else{
               res.send(err);
           }
       }
     );
    })
    .patch((req,res) => {
       Restaurant.update(
           {_id: req.params.id},
           {$set: req.body},
           (err) => {
             if(!err){
                 res.send("Success");
             }
             else{
                 res.send(err);
             }
           }
       );
     })
     .delete((req,res) => {
       Restaurant.deleteOne(
        {_id: req.params.id},
        (err) => {
            if(!err){
                res.send("Success");
            }
            else{
                res.send(err);
            }
        }
    );
    });


app.listen(3002, function() {
  console.log("Server started on port 3002");
});
