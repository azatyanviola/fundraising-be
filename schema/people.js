const { Schema, model } = require('mongoose');

const PeopleSchema = new Schema(
    {
        name: { 
            type: String,
            required: true
        },
        position: { 
            type: String,
            required: false
        },
        personLinkedIn: { 
            type: String,
            required: false
        },
        personEmail: { 
            type: String,
            required: false
        },
        personTwitter: { 
            type: String, 
            required: false
        },
        created: {
            type: Date,
            default:Date.now,
          },
    } 
    
);



module.exports = model('People', PeopleSchema);