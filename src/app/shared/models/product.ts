// export interface Product {
//   id?: string;
//   name?: string;
//   description?: string;
//   imageURL?: string;
//   price?: number;
//   cost?: number;
//   extra?: number;
//   noSides?: boolean,
//   noTortillas?: boolean,
//   category?: string;
// }
export class Product {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public imageURL?: string,
    public price?: number,
    public cost?: number,
    public extra?: number,
    public noSides?: boolean,
    public noTortillas?: boolean,
    public category?: string,
    public notAvailable?: boolean
  ) { }
}