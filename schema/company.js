const { Schema, model } = require('mongoose');

const CompanySchema = new Schema(
    {
        Name: { 
            type: String,
            required: false
        },
        Country: { 
            type: Array,
            required: false
        },
        Type: { 
            type: Object,
            name:{
                type:String
            },
            vote:{
                type:Number,
                default: 0
            }
        },
        InvestmentIndustryOrTechnology: { 
            type: Array,
            required: false
        },
        Stage: { 
            type: Array, 
            required: false
        },
        InvestmentCountry: { 
            type: Array, 
            required: false
        },
        TicketSize: { 
            type: Array, 
            required: false
        },
        Range: { 
            type: Array, 
            required: false
        },
        CompanyWebsideURL: { 
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

        About:{
            type: String
        },
        CompanyLogo: { 
            type: String, 
            required: false
        },
        RecordID: { 
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