const express = require('express')
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
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
    const addVolunteerData = client.db('VolunteerManagement').collection('addVolunteerData')

    app.get('/addvolunteerdata', async(req,res)=>{
      const cursor = addVolunteerData.find().sort({"startDate": 1})
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.post('/addvolunteerdata',async(req,res)=>{
      const volunteerData = req.body
      const result = await addVolunteerData.insertOne(volunteerData)
      res.send(result)
    })

    app.get('/addvolunteerdata/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addVolunteerData.findOne(query)
      res.send(result)
    })

    app.get('/allprogram', async(req,res)=>{
      const cursor = addVolunteerData.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    // app.get('/allprogram/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await addVolunteerData.findOne(query)
    //   res.send(result)
    // })

    app.get('/requestvolunteer', async(req,res)=>{
      const cursor = volunteerNeedsNow.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/requestvolunteer',async(req,res)=>{
      const volunteerData = req.body
      const result = await volunteerNeedsNow.insertOne(volunteerData)
      res.send(result)
    })

    app.get('/addvolunteerdataByEmail/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {'email' : email};
      const result = await addVolunteerData.find(query).toArray()
      res.send(result)
    })

   app.get('/updatepost', async(req,res)=>{
       const cursor = addVolunteerData.find()
      const result = await cursor.toArray()
      res.send(result)
   })
  app.get('/updatepost/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addVolunteerData.findOne(query)
      res.send(result)
})

app.put('/updatepost/:id',async(req,res)=>{
  const id = req.params.id
  const post = req.body
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true}
  const updatePost = {
    $set:{
      Thumbnail:post.Thumbnail,
      Title:post.Title,
      Description:post.Description,
      Category:post.Category,
      Location:post.Location,
      volunteers:post.volunteers,
      Deadline:post.date,
      email:post.email,
      name:post.name
    }
  }

  const result = await addVolunteerData.updateOne(filter,updatePost,options)
  res.send(result)
})


app.delete('/updatepost/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addVolunteerData.deleteOne(query)
      res.send(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})