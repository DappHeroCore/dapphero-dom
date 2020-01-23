// Types
import { Features, AvailableFeatures, FeaturesEntries, PropertiesPositions, AvailabeProperties } from '~/lib/types';

// Constants
import { DH } from '~/lib/constants';

export const getActiveElements = () => {
  const activeElements = Array.from(document.querySelectorAll(`[id*="${DH}"]`));
  return activeElements;
};

export const getAvailableFeatures = (features: Features): AvailableFeatures[] => {
  return Object.entries(features).map((entry: FeaturesEntries) => entry[0]);
};

export const getAvailableProperties = (features: Features): AvailabeProperties => {
  return Object.entries(features).reduce((acc, entry: FeaturesEntries) => ({ ...acc, [entry[0]]: entry[1].dataProperties.map(({ id }) => id) }), {});
};

export const getFeaturesPropertiesPosition = (features: Features): PropertiesPositions => {
  return Object.entries(features).reduce((acc, feature) => {
    const keyPositions = feature[1].dataProperties.reduce(
      (acc, property) => ({ ...acc, [property.id]: property.position }),
      {}
    );
    return { ...acc, [feature[0]]: keyPositions };
  }, {});
};
