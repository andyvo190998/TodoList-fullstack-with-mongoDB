const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3001;


//congifig
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
require('dotenv').config();
const apiKey = process.env.API_KEY

console.log(process.env);

//connect to mongooseDB
mongoose.connect(apiKey);
//data schema
const itemsSchema = {
    todo: String,
    completed: Boolean
}

//data model
const Item = mongoose.model('Item', itemsSchema);

// read route
app.get('/todos/', (req,res) => {
    Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Error: "+ err))
});
//create route
app.post('/newtodo', (req, res) => {
    const newItem = new Item(
        {
            todo: req.body.todo,
            completed: req.body.completed
        }
    );
    newItem.save()
    .then(item => console.log(item))
    .catch(err => res.status(400).json("Error "+err))
})

//delete route
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Item.findByIdAndRemove(id, (req, res) => {
        console.log('item deleted')
    })
})

//update route
app.put('/update/:id', (req,res) => {
    const updatedItem = {todo: req.body.todo}
    console.log(updatedItem)
    Item.findByIdAndUpdate({_id: req.params.id}, {$set: updatedItem}, (req, res) => {
        console.log('item updated')
    })
    app.send(alert('hello'))
})

app.listen(port, function () {
    console.log('hello world')
})