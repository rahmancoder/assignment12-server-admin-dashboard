const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());






//  With ENV file
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqmhk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected');

        const database = client.db('mustafiz_drone');
        const productsCollection = database.collection('products');

        /*----------------------------------
          Drone Product API
         --------------------------------------------*/


        // GET API

        app.get('/products', async (req, res) => {
            // res.send('Hello World from products')
            const cursor = productsCollection.find({});
            const productsdata = await cursor.toArray();
            res.send(productsdata);
        })

        // GET API FROM Single ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(products);
        })

        // POST API FOR  Add  NEW ProductsList

        app.post('/products', async (req, res) => {
            const products = req.body;
            console.log('hit the post api', products);

            const result = await productsCollection.insertOne(products);
            console.log(result);
            res.json(result)
        });









    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Mustafiz Assignment Tweleve Niche Single Drone Website!')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// Deploument Server link in Heroku
// https://shrouded-eyrie-89480.herokuapp.com/mustafizeducation
//  1. Steps install Heroku CLI 
//  2. heroku login
//  3. heroku create
//-------------------------------
// For continuos integrate and deployment in Heroky CLI
//  4. git push heroku main