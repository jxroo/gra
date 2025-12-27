export const SYMBOLS = {
  FAJKA: 'fajka',
  ZAROWKA: 'zarowka',
  PIESC: 'piesc',
  ODZNAKA: 'odznaka',
  KSIAZKA: 'ksiazka',
  NASZYJNIK: 'naszyjnik',
  OKO: 'oko',
  CZASZKA: 'czaszka',
};

// Unused emoji mapping (replaced by SVG icons)
export const SYMBOL_EMOJIS = {
  [SYMBOLS.FAJKA]: '🚬',
  [SYMBOLS.ZAROWKA]: '💡',
  [SYMBOLS.PIESC]: '👊',
  [SYMBOLS.ODZNAKA]: '⭐',
  [SYMBOLS.KSIAZKA]: '📖',
  [SYMBOLS.NASZYJNIK]: '📿',
  [SYMBOLS.OKO]: '👁️',
  [SYMBOLS.CZASZKA]: '💀',
};

// Official Total Counts
export const SYMBOL_COUNTS = {
  [SYMBOLS.FAJKA]: 5,
  [SYMBOLS.ZAROWKA]: 5,
  [SYMBOLS.PIESC]: 5,
  [SYMBOLS.ODZNAKA]: 5,
  [SYMBOLS.KSIAZKA]: 4,
  [SYMBOLS.NASZYJNIK]: 3,
  [SYMBOLS.OKO]: 3,
  [SYMBOLS.CZASZKA]: 3,
};

// Official Characters
export const CARDS = [
  { id: 1, name: "Sebastian Moran", symbols: [SYMBOLS.CZASZKA, SYMBOLS.PIESC] },
  { id: 2, name: "Irene Adler", symbols: [SYMBOLS.CZASZKA, SYMBOLS.ZAROWKA, SYMBOLS.NASZYJNIK] },
  { id: 3, name: "Inspector G. Lestrade", symbols: [SYMBOLS.ODZNAKA, SYMBOLS.OKO, SYMBOLS.KSIAZKA] },
  { id: 4, name: "Inspector Gregson", symbols: [SYMBOLS.ODZNAKA, SYMBOLS.PIESC, SYMBOLS.KSIAZKA] },
  { id: 5, name: "Inspector Baynes", symbols: [SYMBOLS.ZAROWKA, SYMBOLS.ODZNAKA] },
  { id: 6, name: "Inspector Bradstreet", symbols: [SYMBOLS.PIESC, SYMBOLS.ODZNAKA] },
  { id: 7, name: "Inspector Hopkins", symbols: [SYMBOLS.ODZNAKA, SYMBOLS.FAJKA, SYMBOLS.OKO] },
  { id: 8, name: "Sherlock Holmes", symbols: [SYMBOLS.FAJKA, SYMBOLS.ZAROWKA, SYMBOLS.PIESC] },
  { id: 9, name: "John H. Watson", symbols: [SYMBOLS.FAJKA, SYMBOLS.OKO, SYMBOLS.PIESC] },
  { id: 10, name: "Mycroft Holmes", symbols: [SYMBOLS.FAJKA, SYMBOLS.ZAROWKA, SYMBOLS.KSIAZKA] },
  { id: 11, name: "Mrs. Hudson", symbols: [SYMBOLS.FAJKA, SYMBOLS.NASZYJNIK] },
  { id: 12, name: "Mary Morstan", symbols: [SYMBOLS.KSIAZKA, SYMBOLS.NASZYJNIK] },
  { id: 13, name: "James Moriarty", symbols: [SYMBOLS.CZASZKA, SYMBOLS.ZAROWKA] }
];

export const TOTAL_SYMBOL_COUNTS = SYMBOL_COUNTS; 
