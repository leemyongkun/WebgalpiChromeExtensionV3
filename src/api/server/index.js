import { connection } from "./connection";
import { SiteApi } from "./service/SiteApi";
import { HighlightApi } from "./service/HighlightApi";

export const siteApi = new SiteApi(connection);
export const highlightApi = new HighlightApi(connection);

export default {
  siteApi,
  highlightApi
};
