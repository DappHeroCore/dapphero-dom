// Types
import { Features, AvailableFeatures, FeaturesEntries, PropertiesPositions } from '~/lib/types';

// Constants
import { PREFIX } from '~/lib/constants';

// Helpers
import { createSelector } from '~/lib/utils';

export const getActiveElements = () => {
  const selector = createSelector(`${PREFIX}-enabled`, 'true');
  const activeElements = Array.from(document.querySelectorAll(selector));

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
