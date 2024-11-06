import { ASTNode, ASTNodeComparison, ASTNodeExpression } from './ast';

const processNode = (node: ASTNode): string[][] => {
  switch (node.type) {
    case 'comparison':
      return [[generateComparison(node)]];
    case 'group':
      return processNode(node.expression);
    case 'expression':
      return generateExpression(node);
  }
};

const generateComparison = ({ key, value, operator }: ASTNodeComparison) => {
  // Using switch to simplify adding more operators in the future
  switch (operator) {
    case '=':
      // Only { type=anything } isn't a string
      return typeof value === 'string' ? `["${key}"="${value}"]` : `["${key}"]`;
  }
};

const generateExpression = (node: ASTNodeExpression): string[][] => {
  const subExpressions = node.expressions.map(processNode);

  if (node.operator === 'and') {
    return subExpressions.reduce(
      (acc, exprGroup) =>
        acc.flatMap((accGroup) =>
          exprGroup.map((expr) => [...accGroup, ...expr]),
        ),
      [[]],
    );
  }
  if (node.operator === 'or') {
    return subExpressions.flat();
  }
};

export const generateQuery = (ast: ASTNode): string => {
  return processNode(ast)
    .map((p) => `nwr${p.join('')}`)
    .join(';');
};
