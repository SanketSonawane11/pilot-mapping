const { Router } = require("express");
const Pilot = require("../Db/models/pilot");
const findMatches = require("../controllers/findMatches");
const router = Router();

router.get('/get-pilots', async (req, res) => {
    try {
        const allPilots = await Pilot.find({}).exec();
        return res.status(200).json(allPilots);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error occured. Check console for more details" });
    }
});

router.post('/get-matches', async (req, res) => {
    const matchedPilots = await findMatches(req);
    if (matchedPilots.length === 0) {
        return res.status(400).json({ message: "No pilots found" });
    }
    return res.status(200).json(matchedPilots);
});

module.exports = router;