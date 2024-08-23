const mongoose = require('mongoose');
const Pilot = require('./models/pilot');
require('dotenv').config();

const uri = process.env.URI;

const connectDb = async () => {
    try {
        mongoose.connect(uri);
        console.log('Connected to MongoDB');
        // seedDatabase();
    }
    catch (err) {
        console.error("Connection Unsuccessful", err);
    }
}

module.exports = connectDb;

const generateRandomPilot = (name, location, coordinates) => ({
    name,
    workEx: Math.floor(Math.random() * 10) + 1,
    location,
    coordinates,
    profileImage: `https://randomuser.me/api/portraits/med/men/${Math.floor(Math.random() * 100)}.jpg`,
});

const seedDatabase = async () => {
    const pilots = [];

    //Test Mumbai data
    for (let i = 0; i < 25; i++) {
        pilots.push(generateRandomPilot(
            `Mumbai Pilot ${i + 1}`,
            'Mumbai',
            [72.8777 + (Math.random() - 0.5) * 0.1, 19.0760 + (Math.random() - 0.5) * 0.1]
        ));
    }

    //Test Delhi data
    for (let i = 0; i < 25; i++) {
        pilots.push(generateRandomPilot(
            `Delhi Pilot ${i + 1}`,
            'Delhi',
            [77.1025 + (Math.random() - 0.5) * 0.1, 28.6139 + (Math.random() - 0.5) * 0.1]
        ));
    }

    try {
        await Pilot.insertMany(pilots);
        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};