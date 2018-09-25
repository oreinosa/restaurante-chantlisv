import { Product } from "./product";
import { User } from "firebase";

export class NewOrder {
  constructor(
    public products?: {
      principal: Product,
      acompanamientos: Product[],
      bebida: Product
    },
    public tortillas?: number,
  ) { }
}
