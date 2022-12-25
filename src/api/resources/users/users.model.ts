import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 2 }
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
