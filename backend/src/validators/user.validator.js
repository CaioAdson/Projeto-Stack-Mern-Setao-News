import { z } from "zod";
import { atLeastOneField, httpUrl, nonBlank } from "./common.js";
import { email, password, username } from "./auth.validator.js";

export const updateUserSchema = atLeastOneField(
  z.object({
    name: nonBlank("Nome", 3, 60).optional(),
    username: username.optional(),
    email: email.optional(),
    password: password.optional(),
    avatar: httpUrl.optional(),
    background: httpUrl.optional(),
  })
);
