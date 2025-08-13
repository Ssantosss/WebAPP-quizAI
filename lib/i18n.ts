import dict from '../assets/lang/it.json';

export function t(path: string, vars?: Record<string, string | number>) {
  const keys = path.split('.');
  let result: any = dict;
  for (const k of keys) {
    result = result?.[k];
  }
  if (typeof result === 'string' && vars) {
    return result.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
  }
  return result || '';
}
