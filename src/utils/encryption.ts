import bcrypt from "bcrypt";

const hashedPassword = async (password: string) => {
  const salt = 10;
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const isCorrectPassword = async (
  planePasword: string,
  hashPassword: string
) => {
  return bcrypt.compare(planePasword, hashPassword);
};

export { hashedPassword, isCorrectPassword };
