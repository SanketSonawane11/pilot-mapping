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
    // I have seeded data such that major cities will have more concentration of pilots. Used coordinates from chatgpt for more precise coordinates.
    const bigCities = [
        { name: 'Mumbai', coordinates: [72.8777, 19.0760], count: 200 },
        { name: 'Delhi', coordinates: [77.1025, 28.6139], count: 200 },
        { name: 'Bangalore', coordinates: [77.5946, 12.9716], count: 150 },
        { name: 'Hyderabad', coordinates: [78.4867, 17.3850], count: 150 },
        { name: 'Chennai', coordinates: [80.2707, 13.0827], count: 150 },
        { name: 'Kolkata', coordinates: [88.3639, 22.5726], count: 150 }
    ];

    const mediumCities = [
        { name: 'Pune', coordinates: [73.8567, 18.5204], count: 100 },
        { name: 'Ahmedabad', coordinates: [72.5714, 23.0225], count: 100 },
        { name: 'Jaipur', coordinates: [75.7873, 26.9124], count: 100 },
        { name: 'Lucknow', coordinates: [80.9462, 26.8467], count: 100 },
        { name: 'Indore', coordinates: [75.8577, 22.7196], count: 100 },
        { name: 'Bhopal', coordinates: [77.4126, 23.2599], count: 75 },
        { name: 'Patna', coordinates: [85.1376, 25.5941], count: 75 },
        { name: 'Thiruvananthapuram', coordinates: [76.9366, 8.5241], count: 75 },
        { name: 'Guwahati', coordinates: [91.7362, 26.1445], count: 75 }
    ];

    const smallTowns = [
        { name: 'Vijayawada', coordinates: [80.6480, 16.5062], count: 50 },
        { name: 'Mysore', coordinates: [76.6394, 12.2958], count: 50 },
        { name: 'Rajkot', coordinates: [70.8022, 22.3039], count: 50 },
        { name: 'Jodhpur', coordinates: [73.0243, 26.2389], count: 50 },
        { name: 'Amritsar', coordinates: [74.8723, 31.6340], count: 50 },
        { name: 'Varanasi', coordinates: [82.9739, 25.3176], count: 50 },
        { name: 'Ranchi', coordinates: [85.3096, 23.3441], count: 50 },
        { name: 'Gwalior', coordinates: [78.1796, 26.2183], count: 50 },
        { name: 'Shimla', coordinates: [77.1734, 31.1048], count: 25 },
        { name: 'Darjeeling', coordinates: [88.2636, 27.0360], count: 25 },
        { name: 'Alleppey', coordinates: [76.3371, 9.4981], count: 25 }
    ];

    const generatePilots = (city, count) => {
        for (let i = 0; i < count; i++) {
            pilots.push(generateRandomPilot(
                `${city.name} Pilot ${i + 1}`,
                city.name,
                [
                    city.coordinates[0] + (Math.random() - 0.5) * 0.5,
                    city.coordinates[1] + (Math.random() - 0.5) * 0.5
                ]
            ));
        }
    };
    bigCities.forEach(city => generatePilots(city, city.count));

    mediumCities.forEach(city => generatePilots(city, city.count));

    smallTowns.forEach(city => generatePilots(city, city.count));

    try {
        await Pilot.insertMany(pilots);
        console.log('Database seeded successfully with', pilots.length, 'entries');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
};