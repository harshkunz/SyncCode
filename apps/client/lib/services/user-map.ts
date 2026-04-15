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
}

// Create a singleton instance
export const userMap = new UserMap();
