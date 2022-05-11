const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

const uri =
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.piqu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("warhouse").collection("items");

    // get iteam

    app.get("/iteams", async (req, res) => {
      const q = req.query;
      const cursor = itemCollection.find(q);
      const iteams = await cursor.toArray();
      res.send(iteams);
    });
    app.get("/iteam/:id", async (req, res) => {
      const id = req.params.id;
      const q = { _id: ObjectId(id) };
      const cursor = await itemCollection.findOne(q);

      res.send(cursor);
    });

    // add iteam
    app.post("/iteams", async (req, res) => {
      const data = req.body;
      const result = await itemCollection.insertOne(data);

      res.send(result);
    });
    // update
    app.put("/iteam/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };
      console.log(data);
      const updateDoc = {
        $set: {
          name: data.name,
          price: data.price,
          description: data.description,
          quantitiy: data.quantitiy,
          supplier: data.supplier,
          img: data.img,
        },
      };
      const result = await itemCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // delete api
    //

    app.delete("/iteam/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
