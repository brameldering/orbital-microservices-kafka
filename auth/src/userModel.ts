import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUserObj, IUserDoc, IUserModel } from '@orbitelco/common';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: IUserObj) => {
  return new User(attrs);
};

// Before saving new user, encrypt password using bcrypt
// Note we are using function instead of arrow function so that we have access to the correct 'this'
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  done();
});

// Match user entered password to hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword: string) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
// Moved to signin controller

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User };
