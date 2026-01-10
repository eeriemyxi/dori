export function isLeap(n: number) {
  return n % 400 == 0 || (n % 4 == 0 && n % 100 != 0);
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
