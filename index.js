const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { get } = require('express/lib/response');
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dt3ej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        //get products
        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products);
        });

        app.get('/productcount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });
        //use post to get products by Ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query);
            products = await cursor.toArray();
            console.log('keys', keys);
            res.send(products);
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('JOHN is running and waiting for EMA');
})

app.listen(port, () => {
    console.log('JOHN is running on port ', port);
})
