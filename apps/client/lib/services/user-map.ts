/**
 * User management class for handling user data and color assignments.
 * Features:
 * - Username mapping
 * - Color generation and caching
 * - Bulk operations support

 */

import type { User } from '@synccode/types/user';

interface UserData {
  username: string;
  backgroundColor: string;
  textColor: string;
}

export class UserMap {
  private users: Map<string, UserData>;

  constructor() {
    this.users = new Map();
  }

  // Calculate and cache colors when adding a user
  private calculateUserData(username: string): UserData {
    return {
      username,
      backgroundColor: "",
      textColor: "",
    };
  }

  // Add a new user or update existing user
  add(id: string, username: string): void {
    this.users.set(id, this.calculateUserData(username));
  }

  // Add multiple users at once
  addBulk(usersDict: Record<string, string>): void {
    Object.entries(usersDict).forEach(([id, username]) => {
      this.add(id, username);
    });
  }

  // Get username by ID
  get(id: string): string | undefined {
    return this.users.get(id)?.username;
  }

  // Delete a user by ID
  delete(id: string): boolean {
    return this.users.delete(id);
  }

  // Clear all users
  clear(): void {
    this.users.clear();
  }

  // Get all users as an array of User objects
  getAll(): User[] {
    return Array.from(this.users.entries()).map(([id, data]) => ({
      id,
      username: data.username
    }));
  }
}

// Create a singleton instance
export const userMap = new UserMap();
