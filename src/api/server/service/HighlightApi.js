export class HighlightApi {
  constructor(connection) {
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }
}
