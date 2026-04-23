/**
 * Test utility functions for setting up collaborative editing rooms.
 * Features:
 * - Room creation helper
 * - Room joining helper
 * - Join verification
 */

import { expect, Page } from '@playwright/test';

const ROOM_URL_PATTERN = /\/room\/[^/?#]+/;

async function waitForRoomReady(page: Page) {
  await page.waitForURL(ROOM_URL_PATTERN, { timeout: 50000 });

  await expect(page.getByRole('main', { name: 'Code Editor Workspace' })).toBeVisible({
    timeout: 50000
  });

  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 50000 });
}

export async function createRoom(page: Page, name: string) {
  await page.goto('/');

  // Fill name and create room
  await page.getByLabel('Create a Room').getByPlaceholder('Enter your name').fill(name);
  await page.getByRole('button', { name: 'Create Room' }).click();

  await waitForRoomReady(page);

  return page.url();
}

export async function joinRoom(page: Page, roomUrl: string, name: string) {
  await page.goto(roomUrl);

  // Fill name and join room
  await page.getByPlaceholder('Enter your name').fill(name);
  await page.getByRole('button', { name: 'Join Room', exact: true }).click();

  await waitForRoomReady(page);
}

export async function hasJoinedRoom(page: Page) {
  await waitForRoomReady(page);

  return true;
}
