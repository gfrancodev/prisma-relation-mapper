/** Tipo base para objetos de inclusão do Prisma */
type IncludeObject = Record<string, any>;

/**
 * Valida se o array de relações é válido
 * @throws {TypeError} Se o input não for um array de strings válido
 */
function validateRelations(relations: unknown[]): asserts relations is string[] {
  if (!Array.isArray(relations)) {
    throw new TypeError('Relations must be an array of strings.');
  }

  if (relations.length === 0) {
    throw new TypeError('Relations must be an array of strings.');
  }

  if (relations.some(r => typeof r !== 'string')) {
    throw new TypeError('Relations must be an array of strings.');
  }
}

/**
 * Limpa e ordena as strings de relação
 * @param relations Array de strings de relação
 * @param shouldSort Se deve ordenar alfabeticamente
 * @returns Array limpo e ordenado
 */
export function cleanAndSortRelations(
  relations: string[],
  shouldSort = true
): string[] {
  const cleaned = relations
    .map(relation => relation.trim())
    .filter(relation => relation !== '');

  return shouldSort ? cleaned.sort() : cleaned;
}

/**
 * Processa uma única relação aninhada
 * @param currentLevel Nível atual do objeto de inclusão
 * @param key Chave da relação atual
 * @param isLastLevel Se é o último nível da relação
 * @returns Próximo nível do objeto de inclusão
 */
function processRelationLevel(
  currentLevel: IncludeObject,
  key: string,
  isLastLevel: boolean
): IncludeObject {
  if (isLastLevel) {
    currentLevel[key] = true;
    return currentLevel;
  }

  if (!currentLevel[key] || currentLevel[key] === true) {
    currentLevel[key] = { include: {} };
  }

  return currentLevel[key].include;
}

/**
 * Processa relações aninhadas e as adiciona ao acumulador de resultado
 * @param result Objeto acumulador de resultado
 * @param nestedRelations Array de relações aninhadas
 */
export function processNestedRelations(
  result: IncludeObject,
  nestedRelations: string[]
): void {
  let currentLevel = result;
  
  nestedRelations.forEach((key, index) => {
    const isLastLevel = index === nestedRelations.length - 1;
    currentLevel = processRelationLevel(currentLevel, key, isLastLevel);
  });
}

/**
 * Mapeia um array de relações para o formato de inclusão do Prisma
 * @param relations Array de strings de relação
 * @param shouldSort Se deve ordenar as relações
 * @returns Objeto de inclusão no formato do Prisma
 * @throws {TypeError} Se o input não for válido
 */
export default function mapRelations(
  relations: string[],
  shouldSort = true
): IncludeObject {
  validateRelations(relations);

  const result: IncludeObject = {};
  const sortedRelations = cleanAndSortRelations(relations, shouldSort);

  sortedRelations.forEach(relation => {
    const nestedRelations = relation.split('.');
    
    if (nestedRelations.length === 1) {
      result[nestedRelations[0]] = true;
      return;
    }

    processNestedRelations(result, nestedRelations);
  });

  return result;
}
