// server.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors'); // Import the cors package
// ObjectId is needed for updating and deleting specific documents
const { MongoClient, ObjectId } = require('mongodb');

// 2. Initialize the Express app
const app = express();
const port = 3000; // You can use any port you like

// --- MIDDLEWARE ---
// Use cors to allow cross-origin requests
app.use(cors()); 
// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// 3. Configure MongoDB connection
// IMPORTANT: Replace this with your actual MongoDB connection string.
// You can get this from MongoDB Atlas or your local MongoDB Compass.
const uri = "mongodb+srv://day8:23ITR061@cluster0.nbi2bxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Example for local MongoDB
const client = new MongoClient(uri);

// Name of the database you want to connect to
const dbName = 'fullstackDB';

// 4. Create the main function to connect to the database and start the server
async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Successfully connected to MongoDB!");

        // Make the database accessible to our Express app
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // --- API ROUTES (CRUD Operations) ---
        
        // CREATE: Add a new user
        app.post('/users', async (req, res) => {
            try {
                const newUser = req.body;
                const result = await usersCollection.insertOne(newUser);
                res.status(201).json(result); // 201 Created
            } catch (err) {
                console.error("Failed to create user:", err);
                res.status(500).send('Error creating user');
            }
        });
        
        // READ: Get all users
        app.get('/users', async (req, res) => {
            try {
                const users = await usersCollection.find({}).toArray();
                res.json(users);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                res.status(500).send('Error fetching data from database');
            }
        });

        // UPDATE: Update a user by ID
        app.put('/users/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const updatedData = req.body;
                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );
                res.json(result);
            } catch (err) {
                console.error("Failed to update user:", err);
                res.status(500).send('Error updating user');
            }
        });

        // DELETE: Delete a user by ID
        app.delete('/users/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
                res.json(result);
            } catch (err) {
                console.error("Failed to delete user:", err);
                res.status(500).send('Error deleting user');
            }
        });


        // 5. Start the Express server
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });

    } catch (e) {
        console.error("Could not connect to MongoDB", e);
    }
}

// 6. Run the main function
main().catch(console.error);
