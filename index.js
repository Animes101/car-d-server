const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = Number(process.env.PORT) || 3000;

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.26qzwj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
app.use(cors({
origin:['http://localhost:5173'],
credentials:true}))

app.use(express.json());
app.use(cookieParser());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// middlewares




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const carDB = client.db("carDB");
    const servicesClr = carDB.collection("servicesClr");
    const orderClr = carDB.collection("order");

    // auth related api
    app.post('/login', async(req,res)=>{
      const email=req.body.email;

      
      console.log(email);
      
    })
    

    // services related api

    app.get("/services",  async (req, res) => {

      console.log(req.user)
      const result = await servicesClr.find().toArray();

      res.status(200).json({
        message: "All Services",
        data: result,
      });
    });

    //single services data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) }; // MongoDB _id object বানানো
        const result = await servicesClr.findOne(query);

        if (!result) {
          return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({
          message: "Single Service",
          data: result,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Invalid ID format", error: error.message });
      }
    });

    app.post("/order", async (req, res) => {
      const order = req.body;

      const result = await orderClr.insertOne(order);

      if (result) {
        res.status(200).json({
          message: "order confirm",
          success: true,
        });
      }
    });

    app.get("/vieworder", async (req, res) => {

      console.log(req.cookies.token)

      const result = await orderClr.find().toArray();

      if (result) {
        res.status(200).json({
          message: "all order",
          data: result,
        });
      }
    });

     app.delete("/order/:id", async (req, res) => {

      const {id}=req.params;
      const query={_id: new ObjectId(id)}
      const result = await orderClr.deleteOne(query);

      if (result) {
        res.status(200).json({
          message: "order confirm",
          success: true,
          data:result
        });
      }
    });


    app.put("/order/:id", async (req, res) => {

      const {status }=req.body;
      const {id}=req.params;

      const query={_id: new ObjectId(id)}
      const updateDoc = { $set: { status } }; // update করার ডেটা

      const result = await orderClr.updateOne(query, updateDoc);
      if (result) {
        res.status(200).json({
          message: "success update",
          success: true,
          data:result
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running ");
});
