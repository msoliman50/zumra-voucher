export enum VOUCHER_TYPE {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

interface VoucherRequest {
  type?: VOUCHER_TYPE.FIXED | VOUCHER_TYPE.PERCENTAGE;
}

export interface CreateVoucherRequest extends VoucherRequest {
  value: number;
}

export interface UpdateVoucherRequest extends VoucherRequest {
  value?: number;
}
