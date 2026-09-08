export function meruPrastara(n: number): number[][] {
  const rows: number[][] = [];
  for (let i = 0; i <= n; i++) {
    const row = [1];
    for (let j = 1; j <= i; j++) row.push((row[j - 1] * (i - j + 1)) / j);
    rows.push(row.map(Math.round));
  }
  return rows;
}

export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let acc = 1;
  for (let i = 1; i <= k; i++) acc = (acc * (n - k + i)) / i;
  return Math.round(acc);
}

export function sanyoga(n: number, r: number): number {
  return binomial(n, r);
}

export function virahanka(n: number): number[] {
  const s = [1, 1];
  for (let i = 2; i <= n; i++) s.push(s[i - 1] + s[i - 2]);
  return s;
}

export function prastaraStrings(n: number): string[] {
  const out: string[] = [];
  const total = 1 << n;
  for (let i = 0; i < total; i++) {
    let s = '';
    for (let b = 0; b < n; b++) s += (i >> b) & 1 ? 'G' : 'L';
    out.push(s);
  }
  return out;
}

export function matraSum(pattern: string): number {
  return [...pattern].reduce((a, ch) => a + (ch === 'G' ? 2 : 1), 0);
}
