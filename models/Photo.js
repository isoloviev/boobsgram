var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
    _id: Number,
    name: String,
    dateAdded: Date,
    fileName: String,
    user: String
});

module.exports = mongoose.model('Photo', PhotoSchema);