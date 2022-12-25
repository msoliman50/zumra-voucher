import { Schema, model, Types } from 'mongoose';

interface IOrder {
  user: Types.ObjectId;
  voucher: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    voucher: { type: Schema.Types.ObjectId, ref: 'Voucher' }
  },
  { timestamps: true }
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
