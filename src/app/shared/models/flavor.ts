import { Category } from "./category";

export class Flavor {
  constructor(
    public id?: string,
    public name?: string,
    public description?: string,
    public imageURL?: string,
    public category?: Category
  ) {}
}
