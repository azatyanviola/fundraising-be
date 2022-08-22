const { Schema, model } = require('mongoose');

const PlanObj = new Schema(
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



module.exports = model('Stripe', StripeSchema);



