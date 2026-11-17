export function formatBonus(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' Б';
}