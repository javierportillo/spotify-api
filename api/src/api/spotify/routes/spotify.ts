import { config } from "process";
import middlewares from "../../../../config/middlewares";

export default {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/spotify',
    //  handler: 'spotify.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: "GET",
      path: "/tracks",
      handler: "spotify.search",
      config: {
        policies: ["has-spotify-token"],
        middlewares: ["api::spotify.has-query-param"],
      },
    },
  ],
};
