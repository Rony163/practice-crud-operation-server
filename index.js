const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// MiddleWire 

app.use(cors());
app.use(express.json());

// user: practiceUser
// pass: LVol9lY429WpSX2a

const uri = "mongodb+srv://practiceUser:LVol9lY429WpSX2a@cluster0.swfb5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("crud");
        const usersCollection = database.collection("users");

        // GET api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        // POST api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log(result);
            res.json(result);
        });

        // UPDATE api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // DELETE api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to my CRUD server');
});

app.listen(port, () => {
    console.log('Running Server on port ', port);
});