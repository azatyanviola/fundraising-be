const { Schema, model } = require('mongoose');

const CompanySchema = new Schema(
    {
        name: { 
            type: String,
            required: false
        },
        country: { 
            type: Object,
            required: false
        },
        type: { 
            type: Object,
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
            required: false
        },
        stage: { 
            type: Array, 
            required: false
        },
        investmentCountry: { 
            type: Array, 
            required: false
        },
        ticketSize: { 
            type: Array, 
            required: false
        },
        range: { 
            type: Array, 
            required: false
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