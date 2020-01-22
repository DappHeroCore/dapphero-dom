// Types
import { Features, AvailableFeatures, FeaturesEntries, PropertiesPositions } from '~/lib/types';

// Constants
import { DH } from '~/lib/constants';

export const getActiveElements = () => {
  const activeElements = Array.from(document.querySelectorAll(`[id*="${DH}"]`));
  return activeElements;
};

export const getAvailableFeatures = (features: Features): AvailableFeatures[] => {
  return Object.entries(features).map((entry: FeaturesEntries) => entry[0]);
};

export const getFeaturesPropertiesPosition = (features: Features): PropertiesPositions => {
  return Object.entries(features).reduce((acc, feature) => {
    const keyPositions = feature[1].dataProperties.reduce(
      (acc, property) => ({ ...acc, [property.key]: property.position }),
      {}
    );
    return { ...acc, [feature[0]]: keyPositions };
  }, {});
};
