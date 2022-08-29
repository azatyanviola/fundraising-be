const { Schema, model } = require('mongoose');
const bcrtypt = require('bcrypt');

const UserSchema = new Schema(
    {
        name: { 
            type: String,
            required: true
        },
        surname: { 
            type: String,
            required: true
        },
        email: { 
            type: String,
            required: true
        },
        password: { 
            type: String,
            required: true
        },
        role: { 
            type: String,
            enum: ['bronze', 'silver', 'gold'], 
            default: 'bronze'
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        isLinkedinUser: {
            type: Boolean
        },
        isGoogleUser: {
            type: Boolean 
        },
        planObj: [{
            type:Schema.Types.ObjectId,
            ref: 'PlanObj'
          }]
    }
    
);

UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrtypt.hashSync(this.password, 12);
    }
    next();
});

module.exports = model('Users', UserSchema);