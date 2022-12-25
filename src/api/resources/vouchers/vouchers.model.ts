import { Schema, Types, model } from 'mongoose';

import { VOUCHER_TYPE } from './vouchers.types';

interface IVoucher {
  type: string;
  value: number;
  usedBy: Types.ObjectId;
  usedOn: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema = new Schema<IVoucher>(
  {
    type: {
      type: String,
      required: true,
      default: 'fixed',
      enum: [...Object.values(VOUCHER_TYPE)]
    },
    value: { type: Number, required: true, default: 0 },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usedOn: { type: Schema.Types.ObjectId, ref: 'Order' }
  },
  { timestamps: true }
);

const Voucher = model<IVoucher>('Voucher', voucherSchema);

export default Voucher;
