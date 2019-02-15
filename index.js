var express = require('express'),
  app = express(),
  port = 3000,
  bodyParser = require('body-parser');
const body_parser = require('body-parser');
const urlencoded_parser = body_parser.urlencoded({ extended: false});

const mysql = require("mysql");
const con = mysql.createConnection({
  host: "52.31.85.242",
  user: "v1user",
  password: "c0nygre",
  database: "ProductsDB"
});
con.connect(function(err){
  if(err) throw err;
  console.log("Connected!");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
// GET /products
app.get('/products',(req,res)=>{
	  var sql = "SELECT * FROM products";
	  con.query(sql,function (err, result) {
	    if (err) throw err;
      //console.log(result);
      res.send(result);
	   });
});
// GET /products/id
app.get('/products/id',(req,res)=>{
  if(req.query.id.length>=1){
	  var sql = "SELECT * FROM products WHERE id = ?";
	  con.query(sql,[req.query.id],function (err, result) {
	    if (err) throw err;
      //console.log(result);
      res.send(result);
	   });
  }
  else{
    res.send("ID must be at least 1 digit long");
  }
});
// POST /products
// new product
app.post('/products',urlencoded_parser,(req,res)=>{
  if(req.body.name.length>=1 && req.body.price.length>=1){
    var input = [req.body.name,parseFloat(req.body.price),parseInt(req.body.stock)];
  	  var sql = "INSERT INTO products (name,price,stock) VALUES (?,?,?);";
  	  con.query(sql,input,function (err, result) {
  	    if (err) throw err;
        //console.log(result);
        res.send(result);
  	   });
    }
  else{
    res.send("Name and price are required fields");
  }
});
// PUT /products/id
// update product
app.put('/products/id',urlencoded_parser,(req,res)=>{
  if(req.body.id.length>=1 && req.body.name.length>=1 && req.body.price.length>=1){
    var input = [req.body.name,parseFloat(req.body.price),parseInt(req.body.stock),parseInt(req.body.id)];
  	  var sql = "UPDATE products SET name=?,price=?,stock=? WHERE id=?;";
  	  con.query(sql,input,function (err, result) {
  	    if (err) throw err;
        //console.log(result);
        res.send(result);
  	   });
    }
  else{
    res.send("Id, Name and price are required fields");
  }
});
// DELETE /products/id
// delete a product
app.delete('/products/id',urlencoded_parser,(req,res)=>{
  if(req.body.id.length>=1){
  	  var sql = "DELETE FROM products WHERE id=?;";
  	  con.query(sql,[parseInt(req.body.id)],function (err, result) {
  	    if (err) throw err;
        //console.log(result);
        res.send(result);
  	   });
    }
  else{
    res.send("Is a required field");
  }
});
app.listen(port);
