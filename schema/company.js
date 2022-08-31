const { Schema, model } = require('mongoose');

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
        investmentIndustryOrTechnology: { 
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
        investmentCountry: { 
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
        companyWebsideURL: { 
            type: String, 
            required: false
        },
        companyLinkedInURL: { 
            type: String, 
            required: false
        },
        companyTwitterURL: { 
            type: String, 
            required: false
        },
        // companyCrunchbaseUrl: { 
        //     type: String, 
        //     required: false
        // },
        // companyInstagram: { 
        //     type: String, 
        //     required: false
        // },
        // companyYoutubeUrl: { 
        //     type: String, 
        //     required: false
        // },
        // companyMailUrl: { 
        //     type: String, 
        //     required: false
        // },
        // companyMediumUrl: { 
        //     type: String, 
        //     required: false
        // },

        about:{
            type: String
        },
        // companyLogo: { 
        //     type: String, 
        //     required: false
        // },
        recordID: { 
            type: String, 
            required: false
        },
        created: {
            type: Date,
            default:Date.now,
          },
        people: [{
            type:Schema.Types.ObjectId,
            ref: 'People'
        }]
    } 
    
);



module.exports = model('Company', CompanySchema);