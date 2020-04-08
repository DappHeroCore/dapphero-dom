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

export const getModifiers = (dataset, availableFeaturesModifiers, dataAttributesToExclude, feature) => {
  return Object.entries(dataset)
    .map(([key, value]) => {
      if (/property/gi.test(key)) return null;

      // Remove the dh and Modifier workds from the key and make it camelCase
      const parsedKey = lowerFirst(key.replace('dh', '').replace('Modifier', ''));

      const availableModifiers = availableFeaturesModifiers[feature];
      const defaultValue = availableModifiers.defaultValues[parsedKey];
      const parsedValue = value || defaultValue;

      return { key: parsedKey, value: sanitizeHtml(parsedValue) };
    })
    .filter(Boolean)
    .filter(({ key }) => !dataAttributesToExclude.includes(key))
    .filter(({ key, value }) => {
      const availableModifiers = availableFeaturesModifiers[feature];
      const isModifier = availableModifiers.modifiers.includes(key);

      if (!isModifier) {
        return console.error(`(DH-DOM) | Modifier "${key}" is not allowed on Feature "${feature}"`);
      }

      const validator = availableModifiers.validators[key];
      const isValid = validator(value);

      if (!isValid) {
        return console.error(`(DH-DOM) | Modifier "${key}" with value "${value}" is not valid`);
      }

      return true;
    });
};

export const getProperties = (
  dataElementProperties,
  dataAttributesToExclude,
  availableFeaturesProperties,
  feature,
): any => {
  return dataElementProperties
    .filter(Boolean)
    .filter(({ key }) => !dataAttributesToExclude.includes(key))
    .filter(({ key }) => {
      const availableFeatureProperties = availableFeaturesProperties[feature];
      const isPropertyAllowed = availableFeatureProperties.includes(key);

      if (!isPropertyAllowed) {
        return console.error(`(DH-DOM) | Property "${key}" is not allowed on Feature "${feature}"`);
      }

      return isPropertyAllowed;
    });
};
