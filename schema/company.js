const { Schema, model } = require('mongoose');
//const People = require('./people');

const CompanySchema = new Schema(
    {
        name: { 
            type: String,
            required: false
        },
        country: { 
            type: Array,
            required: false
        },
        type: { 
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
        },
        industry: { 
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
        },
        stage: { 
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
        },
        location: { 
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
       },
        ticketSize: { 
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
        },
        range: { 
            type: Array, 
            required: false
        },
        headquarter:{
            type: Array,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            } 
        },
        webside: { 
            type: String, 
            required: false
        },
        fasebook: { 
            type: String, 
            required: false
        },
        linkedIn: { 
            type: String, 
            required: false
        },
        twitter: { 
            type: String, 
            required: false
        },
        crunchbase: { 
            type: String, 
            required: false
        },
        instagram: { 
            type: String, 
            required: false
        },
        youtube: { 
            type: String, 
            required: false
        },
        mail: { 
            type: String, 
            required: false
        },
        medium: { 
            type: String, 
            required: false
        },
        about:{
            type: String
        },
        companyLogo: { 
                data: Buffer,
                contentType: String
        },
        logoUrl: { 
            type: String, 
            required: false
        },
        recordID: { 
            type: String, 
            required: false
        },
        peopleRecordId: { 
            type: Array,
        },
        // people: { 
        //     type: Array,
        // },
        created: {
            type: Date,
            default:Date.now,
          },
       
    } 
    
);







module.exports = model('Company', CompanySchema);