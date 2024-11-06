export type Operator = 'and' | 'or';
export type Token =
  | { type: 'string'; value: string }
  | { type: 'logical'; value: Operator }
  | { type: 'operator'; value: '=' }
  | { type: 'bracket'; value: 'opening' | 'closing' }
  | { type: 'anything' };

const tokenRegex = /\s+and\s+|\s+or\s+|\*|=|\(|\)|[\w:]+|"[^"]*"/g;

const validateMatches = (matches: RegExpExecArray[], inputValue: string) => {
  const [lastMatchedIndex, onlyWhitespaceGaps] = matches.reduce<
    [number, boolean]
  >(
    ([prevEndPosition, stillValid], match) => {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;

      if (!stillValid) {
        return [matchEnd, false];
      }

      const prevUnmatchedString = inputValue.slice(prevEndPosition, matchStart);
      const isOnlyWhitespace = /^\s*$/.test(prevUnmatchedString);

      return [matchEnd, isOnlyWhitespace];
    },
    [0, true],
  );

  return {
    onlyWhitespaceGaps,
    lastMatchedIndex,
    valid: lastMatchedIndex === inputValue.length && onlyWhitespaceGaps,
  };
};

export function tokenize(inputValue: string) {
  const trimmedInputValue = inputValue.trim();
  const matches = Array.from(trimmedInputValue.matchAll(tokenRegex));

  const tokens: Token[] = matches.map(([match]) => {
    const value = match.trim();
    switch (value) {
      case 'and':
      case 'or':
        return { type: 'logical', value };
      case '=':
        return { type: 'operator', value };
      case '*':
        return { type: 'anything' };
      case '(':
      case ')':
        const isOpening = value === '(';
        return { type: 'bracket', value: isOpening ? 'opening' : 'closing' };
      default:
        const isQuoted = value.startsWith('"') && value.endsWith('"');
        const string = isQuoted ? value.slice(1, -1) : value;
        return { type: 'string', value: string };
    }
  });

  if (!validateMatches(matches, trimmedInputValue).valid) {
    throw new Error('Invalid token encountered');
  }

  return tokens;
}
