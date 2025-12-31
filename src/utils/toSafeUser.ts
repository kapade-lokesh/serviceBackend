import { Iuser } from "../modules/user/user.schema";
import { NotFoundError } from "./ApiError";

const tosafeUser = (user: any) => {
  if (!user) {
    throw new NotFoundError("User");
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export { tosafeUser };
