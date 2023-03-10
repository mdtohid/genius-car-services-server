const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT||5000;

// middleware
app.use(cors());
app.use(express.json());


// 
// 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uiwbado.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        const serviceCollection =  client.db("geniusCar").collection("service");

        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const service= await cursor.toArray(console.dir);
            res.send(service);
        })

        app.get('/service/:id',async(req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query= { _id: new ObjectId(id) };
            console.log(query)
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })


        app.post('/service',async(req, res)=>{
            const service = req.body;
            const doc = {
                name:service.name,
                description:service.description,
                price:service.price,
                img:service.img
            }
            const result = await serviceCollection.insertOne(doc);
            res.send(result);
        })

        app.delete('/service/:id',async(req, res)=>{
            const id = req.params.id;
            const query= { _id: new ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{
        // client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})