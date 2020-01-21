// Types
import { Features } from '~/lib/types';

// Constants
import { PREFIX, FEATURE } from '~/lib/constants';

// Helpers
import { createSelector } from '~/lib/utils';

// Getters
import { getAvailableFeatures, getFeaturesPropertiesPosition } from '~/lib/getters';

// Features
import { FEATURES } from '~/features/index';

function getActiveElements(features: Features) {
  // Get all DappHero enabled elements
  const selector = createSelector(`${PREFIX}-enabled`, 'true');
  const elements = Array.from(document.querySelectorAll(selector));

  // Get all available features
  const availableFeatures = getAvailableFeatures(features);

  // Get all features properties positions
  const featuresPropertiesPositions = getFeaturesPropertiesPosition(features);

  // All attributes that will be excluded from the dataset
  const dataAttributesToExclude = ['enabled', 'feature'];

  // Get an array of elements and their respective properties
  // Filter unallowed features that DappHero doesn't handle
  const parsedElements = elements
    .map((element: HTMLElement) => {
      const feature = element.getAttribute(FEATURE);
      const isAllowedFeature = availableFeatures.some(availableKeyFeature => availableKeyFeature === feature);

      if (!isAllowedFeature) {
        return console.error(`Feature "${feature}" not allowed`);
      }

      // Parse dataset to get an array of key/values, and sort properties by feature definition
      const dataset = Object.assign({}, element.dataset);
      const properties = Object.entries(dataset)
        .map(([key, value]) => {
          const parsedKey = key.replace('dh', '').toLowerCase();
          return { key: parsedKey, value };
        })
        .filter(({ key }) => !dataAttributesToExclude.includes(key))
        .sort((a, b) => {
          const featurePropertiesPositions = featuresPropertiesPositions[feature];
          const aPosition = featurePropertiesPositions[a.key];
          const bPosition = featurePropertiesPositions[b.key];

          return aPosition - bPosition;
        });

      return { element, feature, properties };
    })
    .filter(Boolean);

  return parsedElements;
}

function checkRequiredProperties(elements, features: Features) {
  // Get all data properties keys that are required
  const requiredKeys = Object.entries(features).flatMap(([, value]) => {
    return value.dataProperties
      .map(dataProperty => (dataProperty.required === true ? dataProperty.key : null))
      .filter(Boolean);
  });

  // Iterate over all DappHero active elements
  elements.forEach(({ feature, properties }) => {
    // Iterate over all element properties and check against feature properties required key
    properties.forEach(property => {
      if (requiredKeys.includes(property.key) && !property.value) {
        console.error(
          `Property "${property.key}" on Feature "${feature}" it's required but it's value is "${property.value}"`
        );
      }
    });
  });
}

function main() {
  const els = getActiveElements(FEATURES);
  console.log('TCL: main -> els', els);
  checkRequiredProperties(els, FEATURES);
}

main();
