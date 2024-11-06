import { ASTNode, generateAst } from './ast';
import { isSpecialComparisonValue } from './isAst';
import { tokenize } from './tokens';

export const getAST = (inputValue: string) => {
  const tokens = tokenize(inputValue);
  return generateAst(tokens);
};

export const queryWizardLabel = (ast: ASTNode): string => {
  switch (ast.type) {
    case 'comparison':
      if (!isSpecialComparisonValue(ast.value)) {
        return `${ast.key}=${ast.value}`;
      }

      if (ast.value.type === 'anything') {
        return `${ast.key}=*`;
      }
      break;
    case 'expression':
      if (ast.expressions[0].type === 'comparison') {
        const remaining = ast.expressions.length - 1;
        return `${queryWizardLabel(ast.expressions[0])} ${ast.operator} ${remaining} ${remaining > 1 ? 'others' : 'other'}`;
      }
      return `${ast.expressions.length} with ${ast.operator} combined expressions`;
    case 'group':
      return queryWizardLabel(ast.expression);
  }
};
