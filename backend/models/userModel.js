const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    savedArtSearches: [
        {
            text: String,
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    savedStoryGenerations: [
        {
            text: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
