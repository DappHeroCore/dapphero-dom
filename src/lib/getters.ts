// Types
import { Features, AvailableFeaturesMap, FeaturesEntries, PropertiesPositions, AvailableProperties } from './types';

export const getActiveElements = () => {
  //const activeElements = Array.from(document.querySelectorAll(`[id*="${DH}"]`));
  const elements = Array.from(document.querySelectorAll('*'));
  const activeElements = elements.filter((element) => {
    const attributes = Array.from(Object.values(element.attributes));
    const hasAttribute = attributes.find((attribute) => {
      return attribute.name.includes('data-dh-feature');
    });
    if (hasAttribute) return true;
    return false;
  });
  return activeElements;
};

export const getAvailableFeatures = (features: Features): AvailableFeaturesMap => {
  return Object.entries(features)
    .map((entry: FeaturesEntries) => entry[0])
    .reduce((acc, key) => ({ ...acc, [key]: key }), {});
};

export const getAvailableProperties = (features: Features): AvailableProperties => {
  return Object.entries(features).reduce(
    (acc, entry: FeaturesEntries) => ({ ...acc, [entry[0]]: entry[1].dataProperties.map(({ id }) => id) }),
    {},
  );
};

export const getAvailableModifiers = (features: Features) => {
  return Object.entries(features).reduce(
    (acc, entry: FeaturesEntries) => ({
      ...acc,
      [entry[0]]: {
        modifiers: entry[1].dataModifiers.map(({ id }) => id),
        validators: entry[1].dataModifiers.reduce((acc, { id, validator }) => ({ ...acc, [id]: validator }), {}),
        defaultValues: entry[1].dataModifiers.reduce(
          (acc, { id, defaultValue }) => ({ ...acc, [id]: defaultValue }),
          {},
        ),
      },
    }),
    {},
  );
};

export const getFeaturesPropertiesPosition = (features: Features): PropertiesPositions => {
  return Object.entries(features).reduce((acc, feature) => {
    const keyPositions = feature[1].dataProperties.reduce(
      (acc, property) => ({ ...acc, [property.id]: property.position }),
      {},
    );
    return { ...acc, [feature[0]]: keyPositions };
  }, {});
};
