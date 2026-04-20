import { NextResponse, type NextRequest } from 'next/server';

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';

import { MONACO_THEME_LIST } from '@/lib/monaco-themes';

const require = createRequire(import.meta.url);

const getThemesDirectory = (): string => {
  const packageEntry = require.resolve('monaco-themes');
  const normalizedPackageEntry = packageEntry
    .replace(`${path.sep}[project]${path.sep}`, path.sep)
    .replace('/[project]/', '/');

  const fromResolvedEntry = path.resolve(path.dirname(normalizedPackageEntry), '..', 'themes');
  const fromAppNodeModules = path.resolve(process.cwd(), 'node_modules', 'monaco-themes', 'themes');
  const fromWorkspaceNodeModules = path.resolve(
    process.cwd(),
    '..',
    '..',
    'node_modules',
    'monaco-themes',
    'themes'
  );

  const candidates = [fromResolvedEntry, fromAppNodeModules, fromWorkspaceNodeModules];
  const existing = candidates.find(candidate => existsSync(candidate));

  if (!existing) {
    throw new Error('Unable to locate monaco-themes directory');
  }

  return existing;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ theme: string }> }
): Promise<Response> {
  const { theme } = await params;
  const themeName = MONACO_THEME_LIST[theme as keyof typeof MONACO_THEME_LIST];

  if (!themeName) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }

  try {
    const themePath = path.join(getThemesDirectory(), `${themeName}.json`);
    const themeData = JSON.parse(await readFile(themePath, 'utf8'));

    return NextResponse.json(themeData);
  } catch (error) {
    console.error('Failed to read Monaco theme:', error);
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
  }
}
