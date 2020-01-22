import sanitizeHtml from 'sanitize-html';

// Types
import { Features } from '~/lib/types';

// Constants
import { DATA_FEATURE } from '~/lib/constants';

// Getters
import { getActiveElements, getAvailableFeatures, getFeaturesPropertiesPosition } from '~/lib/getters';

// Features
import { FEATURES } from '~/features/index';

// Utils
import { getElementDataset, getAttributeMode, sortProperties } from '~/lib/utils';

// Core logic
function parseActiveElements(features: Features) {
  const activeElements = getActiveElements();

  // Get all available features
  const availableFeatures = getAvailableFeatures(features);

  // Get all features properties positions
  const featuresPropertiesPositions = getFeaturesPropertiesPosition(features);

  // All attributes that will be excluded from the dataset
  const dataAttributesToExclude = ['enabled', 'feature'];

  // Get an array of elements and their respective properties
  // Filter unallowed features that DappHero doesn't handle
  const parsedElements = activeElements
    .map((element: HTMLElement) => {
      const dataset = getElementDataset(element);
      const attributeMode = getAttributeMode(dataset);

      if (attributeMode === 'data') {
        const feature = element.getAttribute(DATA_FEATURE);

        if (!feature) {
          return console.error(`Feature attribute was not added to the element`);
        }

        const isAllowedFeature = availableFeatures.some(availableKeyFeature => availableKeyFeature === feature);

        if (!isAllowedFeature) {
          return console.error(`Feature "${feature}" not allowed`);
        }

        const properties = Object.entries(dataset)
          .map(([key, value]) => {
            const parsedKey = key.replace('dh', '').toLowerCase();
            return { key: parsedKey, value: sanitizeHtml(value) };
          })
          .filter(({ key }) => !dataAttributesToExclude.includes(key));

        const sortedProperties = sortProperties(properties, featuresPropertiesPositions, feature);

        return { element, feature, properties: sortedProperties, attributeMode };
      }

      if (attributeMode === 'id') {
        const idValue = element.getAttribute('id');
        const values = idValue.split(',');

        const feature = values.find(value => value.includes('feature'));
        if (!feature) {
          return console.error(`Feature property was not added to the element`);
        }

        const [, featureValue = ''] = feature.split(':');
        const isAllowedFeature = availableFeatures.some(availableKeyFeature => availableKeyFeature === featureValue);

        if (!isAllowedFeature) {
          return console.error(`Feature "${feature}" not allowed`);
        }

        const properties = values
          .flatMap(str => {
            if (!str.includes('property')) return null;

            const [key, value] = str.replace('property:', '').split('=');
            return { key, value: sanitizeHtml(value) };
          })
          .filter(Boolean);

        const sortedProperties = sortProperties(properties, featuresPropertiesPositions, featureValue);

        return { element, feature: featureValue, properties: sortedProperties, attributeMode };
      }
    })
    .filter(Boolean);

  return parsedElements;
}

function checkRequiredProperties(elements, features: Features) {
  // Get all data properties keys that are required
  const requiredKeys = Object.entries(features).flatMap(([, value]) => {
    return value.dataProperties
      .map(dataProperty => (dataProperty.required === true ? dataProperty.id : null))
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

// Run core logic
function main() {
  const parsedActiveElements = parseActiveElements(FEATURES);
  checkRequiredProperties(parsedActiveElements, FEATURES);

  console.log('parsedActiveElements', parsedActiveElements);
}

main();
