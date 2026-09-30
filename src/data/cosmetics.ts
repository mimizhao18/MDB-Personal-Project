export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  /** Credits. 0 means owned from the start. */
  price: number;
}

/** Colors usable for both the car body and its accent. Prices are placeholders, see BACKLOG.md. */
export const PAINT_COLORS: readonly PaintColor[] = [
  { id: 'red', name: 'Racing Red', hex: '#E10600', price: 0 },
  { id: 'white', name: 'White', hex: '#FFFFFF', price: 0 },
  { id: 'blue', name: 'Blue', hex: '#1E41FF', price: 50 },
  { id: 'papaya', name: 'Papaya', hex: '#FF8000', price: 50 },
  { id: 'teal', name: 'Teal', hex: '#00D2BE', price: 100 },
  { id: 'yellow', name: 'Yellow', hex: '#FFD800', price: 100 },
  { id: 'green', name: 'British Green', hex: '#0B8A3E', price: 100 },
  { id: 'purple', name: 'Purple', hex: '#8B2FD6', price: 150 },
  { id: 'pink', name: 'Pink', hex: '#FF69B4', price: 150 },
  { id: 'black', name: 'Black', hex: '#1A1A1A', price: 200 },
  { id: 'gold', name: 'Gold', hex: '#D4AF37', price: 300 },
];

export const FREE_COLOR_IDS: string[] = PAINT_COLORS.filter((c) => c.price === 0).map((c) => c.id);

export const MIN_CAR_NUMBER = 1;
export const MAX_CAR_NUMBER = 99;
