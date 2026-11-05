import { prisma } from "@/lib/prisma";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  createdAt?: Date | string;
}

// In-memory fallback if Supabase DB password has not been replaced yet
const inMemoryUsers: Map<string, UserEntity> = new Map();

const isPlaceholderConfigured = (): boolean => {
  const url = process.env.DATABASE_URL || "";
  return url.includes("[YOUR-PASSWORD]") || url.trim() === "";
};

export const userService = {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!isPlaceholderConfigured()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (user) return user;
      } catch (err) {
        console.warn("Prisma query failed, falling back to in-memory store:", err);
      }
    }

    return inMemoryUsers.get(normalizedEmail) || null;
  },

  async findById(id: string): Promise<UserEntity | null> {
    if (!isPlaceholderConfigured()) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (user) return user;
      } catch (err) {
        console.warn("Prisma query failed, falling back to in-memory store:", err);
      }
    }

    for (const user of inMemoryUsers.values()) {
      if (user.id === id) return user;
    }
    return null;
  },

  async createUser(data: { email: string; passwordHash: string }): Promise<UserEntity> {
    const normalizedEmail = data.email.toLowerCase().trim();

    if (!isPlaceholderConfigured()) {
      try {
        const user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash: data.passwordHash,
          },
        });
        return user;
      } catch (err) {
        console.warn("Prisma create failed, falling back to in-memory store:", err);
      }
    }

    const newUser: UserEntity = {
      id: "usr_" + Math.random().toString(36).substring(2, 10),
      email: normalizedEmail,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };
    inMemoryUsers.set(normalizedEmail, newUser);
    return newUser;
  },
};
