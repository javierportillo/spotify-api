/**
 * A set of functions called "actions" for `spotify`
 */

const { sanitize, validate } = strapi.contentAPI;

export default {
  async search(ctx: any) {
    try {
      const contentType = {
        modelType: "contentType",
        uid: "query",
        attributes: { query: { type: "string", required: true } },
      } as const;

      const validated = await validate.query(ctx.query, contentType, {
        auth: ctx.state.auth,
      });
      console.log(validated);

      const sanitizedQueryParams = await sanitize.query(
        ctx.query,
        contentType,
        { auth: ctx.state.auth },
      );
      console.log(sanitizedQueryParams);

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(sanitizedQueryParams.query as string)}&type=track`,
        {
          headers: { Authorization: `Bearer ${ctx.state.user.accessToken}` },
        },
      );

      const data = await res.json();

      return ctx.send(data);
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Failed to fetch data from Spotify");
    }
  },
};
