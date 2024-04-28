const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,PUT,PATCH,POST,DELETE',
}))



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@journeyjunction.zdhwbyy.mongodb.net/?retryWrites=true&w=majority&appName=JourneyJunction`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("journeyJunctionDB");
    const userInfoCollection = database.collection("userInfoCollection");
    const spotCollection = database.collection("spotCollection");
    const contries = database.collection("contries");


    app.post('/', async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo)
      const result = await userInfoCollection.insertOne(userInfo);
      res.send(result);
    })


    app.post('/addSpot', async (req, res) => {
      const spotInfo = req.body;
      console.log(spotInfo)
      const result = await spotCollection.insertOne(spotInfo);
      res.send(result);
    })

    app.get('/contries', async (req, res) => {
      const cursor = contries.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/contries/:id', async (req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      result = await contries.findOne(query);
      res.send(result)
    })

    app.get('/addSpot', async (req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.get('/addSpot/:email', async (req, res) => {
      const email = req.params.email;
      const query ={email: email}
      result = await spotCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/addSpot/spotDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      result = await spotCollection.findOne(query);
      res.send(result)
    })

    app.get("/updateSpot/:id",async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.findOne(query);
      res.send(result)
    })

    
    app.get('/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userInfoCollection.findOne(query)
      res.send(result)
    })

    app.put("/addSpot/updateSpot/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          name: data.name,
          email: data.email,
          spotName: data.spotName,
          photo: data.photo,
          country: data.country,
          location: data.location,
          description: data.description,
          cost: data.cost,
          seasonality: data.seasonality,
          time: data.time,
          visit: data.visit,
        },
      };
      const result = await spotCollection.updateOne(filter, updateData, options);
      res.send(result);
    });

    app.delete("/addSpot/myList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app is running on port ${port}`)
})