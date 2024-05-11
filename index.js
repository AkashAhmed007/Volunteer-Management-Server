const express = require('express')
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jp6bbe4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    
    const volunteerNeedsNow = client.db('VolunteerManagement').collection('VolunteerNeedsNow')
    app.get('/volunteerneed', async(req,res)=>{
      const cursor = volunteerNeedsNow.find()
        const result = await cursor.toArray()
        res.send(result)
      }
    )

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})