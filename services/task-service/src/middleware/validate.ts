import { RequestHandler } from "express";
import z from "zod";

export const validate =
  (schema: z.ZodSchema): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      res.status(400).json({ success: false, errors: fieldErrors });
      return;
    }

    req.body = result.data;
    next();
  };
