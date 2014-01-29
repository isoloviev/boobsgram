var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username: String,
    name: String,
    photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
    provider: String,
    email: String,
    accountId: {
        type: String,
        unique: true
    },
    gender: String,
    role: {
        bitMask: Number,
        title: String
    }
});

module.exports = mongoose.model('User', UserSchema);