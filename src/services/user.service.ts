import { api } from "@/lib/api/api";
import { User } from "@/types/user";
import { env } from "process";

const baseURL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getAllUsers(): Promise<User[] | null> {
  try {
    const response = await api.get(`${baseURL}/users`);
    return response.data as User[];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        const response = await api.get(`${baseURL}/users/${userId}`);
        return response.data as User;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
}
