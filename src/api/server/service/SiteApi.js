export class SiteApi {
  constructor(connection) {
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  insertSite(siteInfo) {
    const url = "/site/info";
    return this.connection.post(url, siteInfo);
  }
}
