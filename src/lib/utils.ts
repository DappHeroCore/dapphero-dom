import isEmpty from 'lodash.isempty';
import sanitizeHtml from 'sanitize-html';
import lowerFirst from 'lodash.lowerfirst';

export const createAttributeSelector = (key: string, property?: string, separator: string = '=') => {
  if (property) return `[${key}${separator}"${property}"]`;
  return `[${key}]`;
};

export const getElementDataset = (element: HTMLElement) => Object.assign({}, element.dataset);

export const getAttributeMode = (dataset: DOMStringMap) => (isEmpty(dataset) ? 'id' : 'data');

export const sortProperties = (properties, featuresPropertiesPositions, feature) => {
  return properties.sort((a, b) => {
    const featurePropertiesPositions = featuresPropertiesPositions[feature];
    const aPosition = featurePropertiesPositions[a.key];
    const bPosition = featurePropertiesPositions[b.key];

    return aPosition - bPosition;
  });
};

export const getIdElementProperties = (element: HTMLElement | Element) => {
  const values = element.getAttribute('id').split(',');

  const parsedProperties = values
    .map((str) => {
      if (!str.includes('property')) return null;

      const [key, value = ''] = str.replace('property:', '').split('=');
      const parsedKey = lowerFirst(key);

      return { key: parsedKey, value: sanitizeHtml(value) };
    })
    .filter(Boolean);

  return parsedProperties;
};

export const getDataElementProperties = (dataset: DOMStringMap) => {
  const parsedProperties = Object.entries(dataset).map(([key, value]) => {
    if (/modifier/gi.test(key)) return null;

    const parsedKey = lowerFirst(key.replace('dh', '').replace('Property', ''));
    return { key: parsedKey, value: sanitizeHtml(value) };
  });

  return parsedProperties;
};
