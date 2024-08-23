const mongoose = require('mongoose');

const pilotSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    workEx: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
    },
    profileImage: {
        type: String,
        required: true,
    },
});

const Pilot = mongoose.model("Pilot", pilotSchema);

module.exports = Pilot;