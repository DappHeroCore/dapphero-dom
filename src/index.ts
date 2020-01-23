import sanitizeHtml from 'sanitize-html';

// Types
import { Features } from '~/lib/types';

// Constants
import { DATA_FEATURE } from '~/lib/constants';

// Getters
import {
  getActiveElements,
  getAvailableFeatures,
  getAvailableProperties,
  getFeaturesPropertiesPosition,
  getAvailableModifiers,
} from '~/lib/getters';

// Features
import { FEATURES } from '~/features/index';

// Utils
import { getElementDataset, getAttributeMode, sortProperties } from '~/lib/utils';

// Core logic
function parseActiveElements(features: Features) {
  const activeElements = getActiveElements();

  // Get all available features
  const availableFeatures = getAvailableFeatures(features);

  // Get all available features properties
  const availableFeaturesProperties = getAvailableProperties(features);

  // Get all available features properties modifiers
  const availableFeaturesModifiers = getAvailableModifiers(features);

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
        // Disable DH engine
        const enabled = dataset.dhEnabled;
        const isDisabled = enabled && enabled === 'false';
        if (isDisabled) return null;

        const feature = element.getAttribute(DATA_FEATURE);

        if (!feature) {
          return console.error(`Feature attribute was not added to the element`);
        }

        const isAllowedFeature = availableFeatures.some((availableKeyFeature) => availableKeyFeature === feature);

        if (!isAllowedFeature) {
          return console.error(`Feature "${feature}" not allowed`);
        }

        const properties = Object.entries(dataset)
          .map(([key, value]) => {
            if (/modifier/gi.test(key)) return null;

            const parsedKey = key
              .replace('dh', '')
              .replace('Property', '')
              .toLowerCase();

            return { key: parsedKey, value: sanitizeHtml(value) };
          })
          .filter(Boolean)
          .filter(({ key }) => !dataAttributesToExclude.includes(key))
          .filter(({ key }) => {
            const availableFeatureProperties = availableFeaturesProperties[feature];
            const isPropertyAllowed = availableFeatureProperties.includes(key);

            if (!isPropertyAllowed) {
              return console.error(`Property "${key}" is not allowed on Feature "${feature}"`);
            }

            return isPropertyAllowed;
          });

        const modifiers = Object.entries(dataset)
          .map(([key, value]) => {
            if (/property/gi.test(key)) return null;

            const parsedKey = key
              .replace('dh', '')
              .replace('Modifier', '')
              .toLowerCase();

            return { key: parsedKey, value: sanitizeHtml(value) };
          })
          .filter(Boolean)
          .filter(({ key }) => !dataAttributesToExclude.includes(key))
          .filter(({ key, value }) => {
            const availableModifiers = availableFeaturesModifiers[feature];
            const isModifier = availableModifiers.modifiers.includes(key);

            if (!isModifier) {
              return console.error(`Modifier "${key}" is not allowed on Feature "${feature}"`);
            }

            const validator = availableModifiers.validators[key];
            const isValid = validator(value);

            if (!isValid) {
              return console.error(`Modifier "${key}" with value "${value}" is not valid`);
            }

            return true;
          });

        const sortedProperties = sortProperties(properties, featuresPropertiesPositions, feature);

        return { element, feature, properties: sortedProperties, modifiers, attributeMode };
      }

      if (attributeMode === 'id') {
        const idValue = element.getAttribute('id');
        const values = idValue.split(',');

        // Disable DH engine
        const enabled = values.find((value) => value.includes('enabled'));
        const isDisabled = enabled && enabled.includes('false');
        if (isDisabled) return null;

        const feature = values.find((value) => value.includes('feature'));
        if (!feature) {
          return console.error(`Feature property was not added to the element`);
        }

        const [, featureValue = ''] = feature.split(':');
        const isAllowedFeature = availableFeatures.some((availableKeyFeature) => availableKeyFeature === featureValue);

        if (!isAllowedFeature) {
          return console.error(`Feature "${feature}" not allowed`);
        }

        const properties = values
          .flatMap((str) => {
            if (!str.includes('property')) return null;

            const [key, value = ''] = str.replace('property:', '').split('=');
            return { key, value: sanitizeHtml(value) };
          })
          .filter(Boolean)
          .filter(({ key }) => {
            const availableFeatureProperties = availableFeaturesProperties[featureValue];
            const isPropertyAllowed = availableFeatureProperties.includes(key);

            if (!isPropertyAllowed) {
              console.error(`Property "${key}" is not allowed on Feature "${feature}"`);
            }

            return isPropertyAllowed;
          });

        const modifiers = values
          .flatMap((str) => {
            if (!str.includes('modifier')) return null;

            const [key, value = ''] = str.replace('modifier:', '').split('=');
            return { key, value: sanitizeHtml(value) };
          })
          .filter(Boolean)
          .filter(({ key }) => !dataAttributesToExclude.includes(key))
          .filter(({ key, value }) => {
            const availableModifiers = availableFeaturesModifiers[featureValue];
            const isModifier = availableModifiers.modifiers.includes(key);

            if (!isModifier) {
              return console.error(`Modifier "${key}" is not allowed on Feature "${feature}"`);
            }

            const validator = availableModifiers.validators[key];
            const isValid = validator(value);

            if (!isValid) {
              return console.error(`Modifier "${key}" with value "${value}" is not valid`);
            }

            return true;
          });

        const sortedProperties = sortProperties(properties, featuresPropertiesPositions, featureValue);

        return { element, feature: featureValue, properties: sortedProperties, modifiers, attributeMode };
      }
    })
    .filter(Boolean);

  return parsedElements;
}

function checkRequiredProperties(elements, features: Features) {
  // Get all data properties keys that are required
  const requiredKeys = Object.entries(features).flatMap(([, value]) => {
    return value.dataProperties
      .map((dataProperty) => (dataProperty.required === true ? dataProperty.id : null))
      .filter(Boolean);
  });

  // Iterate over all DappHero active elements
  elements.forEach(({ feature, properties }) => {
    // Iterate over all element properties and check against feature properties required key
    properties.forEach((property) => {
      if (requiredKeys.includes(property.key) && !property.value) {
        console.error(
          `Property "${property.key}" on Feature "${feature}" it's required but it's value is "${property.value}"`,
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
