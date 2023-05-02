const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const express = require('express');
const multer = require('multer')
const mongodb = require('mongodb');
const upload = multer();
const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.send('bright future server is running')
})



const url = `mongodb+srv://server11:server11@cluster0.czo9kw9.mongodb.net/?retryWrites=true&w=majority`;
console.log(url);
const client = new MongoClient(url);
async function run() {
    try {
        // const usersCollection = client.db('pHeroServer').collection('users');
        const imageCollection = client.db('brightFuture').collection('imagaes');
        const usersCollection = client.db('brightFuture').collection('users');
        //post user 

        app.post('/api/upload', upload.single('image'), async (req, res) => {
            await client.connect();
            try {
                const result = await imageCollection.insertOne({
                    image: req.file.buffer
                });
                res.status(200).json(result);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            } finally {
                client.close();
            }
        });



        app.get('/api/images/:id', async (req, res) => {
            try {
                await client.connect();
                const result = await imageCollection.findOne({ _id: new ObjectId(req.params.id) });
                res.set('Content-Type', 'image/jpeg');
                res.send(result.image.buffer);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            } finally {
                client.close();
            }
        });

        app.post('/users', async (req, res) => {
            try {
                const users = req.body;
                const result = await usersCollection.insertOne(users);
                res.status(201).json({ success: true, message: 'User created successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        app.get('/allUsers', async (req, res) => {
            try {
                const query = {};
                const cursor = usersCollection.find(query);
                const users = await cursor.toArray()
                res.send(users);
            } catch (error) {
                console.log(error);
            }
        });


        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
    catch (err) {

    }
}

run();





// app.listen(port, () => console.log('server create successfully'))