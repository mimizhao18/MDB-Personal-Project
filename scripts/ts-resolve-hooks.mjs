// Lets Node resolve extensionless imports like './streak' to './streak.ts' (or a folder to its index.ts), the way the
// app's bundler does.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL) {
    const candidate = new URL(`${specifier}.ts`, context.parentURL);
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
    const index = new URL(`${specifier}/index.ts`, context.parentURL);
    if (existsSync(fileURLToPath(index))) return nextResolve(index.href, context);
  }
  return nextResolve(specifier, context);
}
