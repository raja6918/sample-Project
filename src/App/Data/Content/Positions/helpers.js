const findPositionsByPositionTypeCode = (
  positionType,
  positionsCategorized
) => {
  if (!positionType) return [];
  const positionsByCategory = positionsCategorized.find(
    positionCategory => positionCategory.positionTypeCode === positionType
  ).positions;

  return [...positionsByCategory];
};

export const generateItemsList = data => {
  const {
    positions,
    selectedPosition,
    positionCode,
    positionName,
    positionType,
  } = data;

  let positionsDragAndDropList = findPositionsByPositionTypeCode(
    positionType,
    positions
  );

  const currentPosition = {
    code: positionCode,
    name: positionName,
    targetItem: true,
  };

  if (
    selectedPosition &&
    selectedPosition.id &&
    selectedPosition.typeCode === positionType
  ) {
    const positionIdx = positionsDragAndDropList.findIndex(
      item => item.id === selectedPosition.id
    );

    positionsDragAndDropList[positionIdx] = {
      ...positionsDragAndDropList[positionIdx],
      ...currentPosition,
    };
  } else {
    positionsDragAndDropList = [
      ...positionsDragAndDropList,
      { ...currentPosition },
    ];
  }

  return positionsDragAndDropList;
};

export function flattenPositionsCategorized(positionsCategorized) {
  if (!positionsCategorized) return [];

  const positions = [];
  for (let i = 0; i < positionsCategorized.length; i++) {
    const positionCategory = positionsCategorized[i];
    positions.push(...positionCategory.positions);
  }

  return positions;
}
