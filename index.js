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
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');

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
            // const id = req.params.index;
            // const products = await productsCollection.findOne(id);

            const products = await productsCollection.findOne(query);
            console.log('load user with id: ', id);
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



        /*----------------------------------
          USERS API
         --------------------------------------------*/

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // user registration  and google singin save users or bypassing users to mongoDB

        //1. with email password (POST Method useFirebase)
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        //2.google singin save users (PUT Method useFirebase)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // make admin and admin can add another admin api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })



        /*----------------------------------
           Orders  API
           -------------------------------------*/

        // GET API FOR  COnfirm Order

        app.get('/orders', async (req, res) => {
            // res.send('Hello World from Orders')
            let query = {};
            // console.log(req.query);
            const email = req.query.email;
            // const email = req.query.userEmail;
            if (email) {
                query = { email: email };
            }
            // const cursor = ordersCollection.find({});
            const cursor = ordersCollection.find(query);
            console.log(cursor);
            const ordersdata = await cursor.toArray();
            res.send(ordersdata);
        })

        // GET API for Orders API 
        // app.get('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const ordersdata = await ordersCollection.findOne(query);
        //     // console.log('load user with id: ', id);
        //     res.send(ordersdata);
        // })

        // POST API FOR Add Confirm Orders
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            console.log('hit the post api', orders);

            const result = await ordersCollection.insertOne(orders);
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