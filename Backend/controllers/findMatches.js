const Pilot = require("../Db/models/pilot");

const findMatches = async (req) => {
    const { longitude, latitude, range, experience } = req.body;

    const rangeInMeters = range * 1000;

    try {
        const matchedPilots = await Pilot.find({
            coordinates: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], rangeInMeters / 6378137],
                },
            },
            workEx: { $lte: experience },
        })
            .sort({ workEx: -1 })
            .limit(10);
        return matchedPilots;
    }
    catch (err) {
        console.log("Error fetching best match for pilots");
        console.log(err);
        return [];
    }
}

module.exports = findMatches;