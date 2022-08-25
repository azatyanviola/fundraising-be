const { Schema, model } = require('mongoose');

const PlanSchema= new Schema(
    {
        name: { 
            type: String,
        },
        customer: { 
            type: String,
        },
        productId: { 
            type: Number,
        },  
        subscription: { 
            type: Boolean,
        },
        billingDate: {
            type: Date,
            default:Date.now,
          },
        
    }
    
);



module.exports = model('PlanObj', PlanSchema);



