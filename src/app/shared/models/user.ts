export class User {
  constructor(
    public id?: string,
    public name?: string,
    public email?: string,
    public role?: string,
    public reg_date?: Date,
    // public password?: string,
    public workplace?: string,
    public debit?: number,
    public credit?: number
  ) {}
}
