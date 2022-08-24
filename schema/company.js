const { Schema, model } = require('mongoose');

const CompanySchema = new Schema(
    {
        name: { 
            type: String,
            required: true
        },
        country: { 
            type: String,
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
        investment: { 
            type: String,
            required: false
        },
        stage: { 
            type: String, 
            required: false
        },
        investmentCountry: { 
            type: String, 
            required: false
        },
        ticketSiza: { 
            type: String, 
            required: false
        },
        range: { 
            type: String, 
            required: false
        },
        companyWebsideUrl: { 
            type: String, 
            required: false
        },
        companyFasebook: { 
            type: String, 
            required: false
        },
        companylinkedInUrl: { 
            type: String, 
            required: false
        },
        companyTwitterUrl: { 
            type: String, 
            required: false
        },
        companyCrunchbaseUrl: { 
            type: String, 
            required: false
        },
        companyInstagram: { 
            type: String, 
            required: false
        },
        companyYoutubeUrl: { 
            type: String, 
            required: false
        },
        companyMailUrl: { 
            type: String, 
            required: false
        },
        companyMediumUrl: { 
            type: String, 
            required: false
        },
        about: { 
            type: String, 
            required: false
        },
        companyLogo: { 
            type: Image, 
            required: false
        },
        logoUrl: { 
            type: String, 
            required: false
        },
        recordId: { 
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