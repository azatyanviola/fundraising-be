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
            default: 'bronze'
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        }
    }
    
);

UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrtypt.hashSync(this.password, 12);
    }
    next();
});

module.exports = model('Users', UserSchema);