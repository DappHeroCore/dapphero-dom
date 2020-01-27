import isEmpty from 'lodash.isempty';

export const createAttributeSelector = (key: string, property?: string) => {
  if (property) return `[${key}="${property}"]`;
  return `[${key}]`;
};

export const getElementDataset = (element: HTMLElement) => Object.assign({}, element.dataset);

export const getAttributeMode = (dataset) => (isEmpty(dataset) ? 'id' : 'data');

export const sortProperties = (properties, featuresPropertiesPositions, feature) => {
  return properties.sort((a, b) => {
    const featurePropertiesPositions = featuresPropertiesPositions[feature];
    const aPosition = featurePropertiesPositions[a.key];
    const bPosition = featurePropertiesPositions[b.key];

    return aPosition - bPosition;
  });
};
