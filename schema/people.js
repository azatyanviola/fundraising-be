const { Schema, model } = require('mongoose');

const PeopleSchema = new Schema(
    {
        personName: { 
            type: String,
            required: false
        },
        position: { 
            type: String,
            required: false
        },
        personLinkedIn: { 
            type: String,
            required: false,
            unique: true,
            index:true, 
            unique:true,
            sparse:true
        },
        personEmail: { 
            type: String,
            required: false,
            index:true, 
            unique:true,
            sparse:true
        },
        personTwitter: { 
            type: String, 
            required: false,
            index:true, 
            unique:true,
            sparse:true
        },
        RecordId: { 
            type: String, 
            required: false
        },
        // created: {
        //     type: Date,
        //     default:Date.now,
        //   },
    } 
    
);



module.exports = model('People', PeopleSchema);