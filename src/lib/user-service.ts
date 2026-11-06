import { prisma } from "@/lib/prisma";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  createdAt?: Date | string;
}

export const userService = {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalizedEmail = email.toLowerCase().trim();
    return prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  },

  async findById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async createUser(data: { email: string; passwordHash: string }): Promise<UserEntity> {
    const normalizedEmail = data.email.toLowerCase().trim();
    return prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: data.passwordHash,
      },
    });
  },
};
