import { User } from "@prisma/client";

export type IFormInput = {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type ModalForm = {
  email?: string;
};

export type safeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
