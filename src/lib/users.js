import User from "@/models/User";
import { hashPassword } from "./password";

// Shared by the /api/auth/register route and admin-style user creation.
export async function createUser({ name, email, password }) {
  const passwordHash = await hashPassword(password);
  const created = await User.create({ name, email, passwordHash });

  // select: false only applies to queries, not documents just created in
  // this process, so strip the hash by hand before it goes over the wire.
  const user = created.toObject();
  delete user.passwordHash;
  return user;
}
