const mongoose = require('mongoose');

const factionSchema = new mongoose.Schema({
    factionName: {type: String, required: true, unique: true},
    factionID: {type: String, required: true, unique: true},
    factionOwner: {type: String, required: true},
    factionMembers: {type: Array, required: true},
    factionReviews: {type: Array, required: true},
    factionDescription: {type: String, required: true},
    factionLogo: {type: String, required: true},
    factionBanner: {type: String, required: true},
    factionInvite: {type: String, required: true},
    factionAvgRating: {type: Number, required: true}
});

const model = mongoose.model('FactionModels', factionSchema);
module.exports = model;