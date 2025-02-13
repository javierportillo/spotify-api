import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi
      .plugin("users-permissions")
      .service("providers-registry")
      .add("spotify", {
        icon: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
        enabled: true,
        grantConfig: {
          key: process.env.SPOTIFY_CLIENT_ID,
          secret: process.env.SPOTIFY_CLIENT_SECRET,
          // callback: `${strapi.config.server.url}/api/auth/spotify/callback`,
          callback: "/spotify-callback.html",
          scope: ["user-read-email", "user-library-read", "user-top-read"],
          authorize_url: "https://accounts.spotify.com/authorize",
          access_url: "https://accounts.spotify.com/api/token",
          oauth: 2,
        },
        async authCallback({ accessToken }) {
          console.log("got the callback!");
          const res = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const profile = (await res.json()) as {
            id: string;
            email: string;
            display_name: string;
          };

          // check if user exists
          const existingUser = await strapi
            .documents("plugin::users-permissions.user")
            .findMany({ filters: { spotifyId: profile.id } });

          if (existingUser.length > 0) {
            // update token
            await strapi.documents("plugin::users-permissions.user").update({
              documentId: existingUser[0].documentId,
              data: { accessToken } as any,
            });

            return existingUser[0];
          }

          // create new user
          return await strapi
            .documents("plugin::users-permissions.user")
            .create({
              data: {
                email: profile.email,
                username: profile.display_name || profile.id,
                spotifyId: profile.id,
                accessToken,
                provider: "spotify",
              },
            });
        },
      });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
