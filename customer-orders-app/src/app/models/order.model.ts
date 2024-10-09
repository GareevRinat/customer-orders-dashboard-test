import {OrderLine} from "./order-line.model";

export interface Order {
  customerId: number;
  orderLines: OrderLine[];
  creationDate: Date;
  lastEditDate: Date;
  status: 'Created' | 'InProgress' | 'Completed' | 'Cancelled';
}
