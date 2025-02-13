import { z } from "zod";

export default (config, { strapi }) => {
  return (context, next) => {
    const validationSchema = z
      .object({
        query: z.string().min(5),
      })
      .strict();

    try {
      validationSchema.parse(context.query);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return context.badRequest("Validation Error", error.issues);
      }
    }
  };
};
