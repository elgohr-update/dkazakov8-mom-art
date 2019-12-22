import _ from 'lodash';

export function moveElementInArray(params: { source: any[]; from: number; to: number }) {
  const { source, from, to } = params;

  if (from === to) {
    return source;
  }

  const sourceClone = _.cloneDeep(source);

  const [movedElement] = sourceClone.splice(from, 1);

  sourceClone.splice(to, 0, movedElement);

  return sourceClone;
}
