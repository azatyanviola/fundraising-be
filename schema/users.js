const { Schema, model } = require('mongoose');
const bcrtypt = require('bcrypt');

const UserSchema = new Schema(
    {
        name: { type: String },
        surname: { type: String },
        email: { type: String },
        password: { type: String },
        confirmPassword: { type: String },
        role: { type: String, default: 'bronze' }
    }
    
);

UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrtypt.hashSync(this.password, 12);
    }
    next();
});
UserSchema.pre('save', function (next) {
  if (this.isModified('confirmPassword') || this.isNew()) {
      this. confirmPassword = bcrtypt.hashSync(this. confirmPassword, 12);
  }
  next();
});

module.exports = model('Users', UserSchema);