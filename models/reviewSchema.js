const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    faction: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    rating: {type: Number, required: true}
});

const model = mongoose.model('ReviewModels', reviewSchema);
module.exports = model;