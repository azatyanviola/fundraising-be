const { Schema, model } = require('mongoose');

const PlanObj = new Schema(
    {
        name: { 
            type: String,
            required: true
        },
        customer: { 
            type: String,
            required: true
        },
        productId: { 
            type: Number,
            required: true
        },  
        subscription: { 
            type: Boolean,
            required: true
        },
        billingDate: {
            type: Date,
            default:Date.now,
          },
        
    }
    
);



module.exports = model('Stripe', StripeSchema);



