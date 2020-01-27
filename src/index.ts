import sanitizeHtml from 'sanitize-html';
import lowerFirst from 'lodash.lowerfirst';

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
import { getElementDataset, getAttributeMode, sortProperties, createAttributeSelector } from '~/lib/utils';

// Core logic
function parseActiveElements(features: Features, projectData) {
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

        const isAllowedFeature = availableFeatures[feature];

        if (!isAllowedFeature) {
          return console.error(`Feature "${feature}" not allowed`);
        }

        const properties = Object.entries(dataset)
          .map(([key, value]) => {
            if (/modifier/gi.test(key)) return null;

            const parsedKey = lowerFirst(key.replace('dh', '').replace('Property', ''));
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

        if (feature === availableFeatures.customContract) {
          const contractNameKey = properties.find((property) => property.key === 'contractName');
          const methodNameKey = properties.find((property) => property.key === 'methodName');

          // Check if contract name exists in DOM
          if (!contractNameKey || !contractNameKey.value) {
            return console.error(`Contract name should be specified`);
          }

          // Check if contract name exists in ABI
          const contractName = contractNameKey.value;
          const contractInABI = projectData.contracts[contractName];

          if (!contractInABI) {
            return console.error(`Contract "${contractName}" does not exists on your project`);
          }

          // Check if method name exists in DOM
          if (!methodNameKey || !methodNameKey.value) {
            return console.error(`Contract name should be specified`);
          }

          // Get contract
          const contractABI = projectData.contracts[contractName];

          // Check if method name exists in ABI
          const methodName = methodNameKey.value;
          const contractMethod = contractABI.find((method) => method.name === methodName);

          if (!contractMethod) {
            return console.error(`Method name "${methodName}" does not exists on the contract ABI`);
          }

          // TODO: Add Type: 'method' | 'transaction' based on "stateMutability" key

          // Get customContract children properties
          const childrenProperties = features.customContract.dataProperties.filter(
            (property) => property.type === 'children',
          );

          // Get all children elements
          const childrenElements = childrenProperties
            .map((property) => {
              if (property.attribute.includes('input')) {
                const inputs = element.querySelectorAll(createAttributeSelector(property.attribute));

                const parsedInputs = Array.from(inputs).map((input) => {
                  const value = input.getAttribute(property.attribute);

                  // Check each input name in ABI equals to the value defined in the DOM
                  const isInputFound = contractMethod.inputs.some((input) => input.name === value);

                  if (!isInputFound) {
                    return console.error(
                      `Input name "${value}" for method ${methodName} does not exists on the contract ABI`,
                    );
                  }

                  return { element: input, id: property.id };
                });

                return { element: parsedInputs, id: property.id };
              } else {
                const childrenElement = element.querySelector(createAttributeSelector(property.attribute));

                if (property.attribute.endsWith('output-name')) {
                  const value = childrenElement.getAttribute(property.attribute);

                  // Check each input name in ABI equals to the value defined in the DOM
                  const isOutputFound = contractMethod.outputs.some((output) => output.name === value);

                  if (!isOutputFound) {
                    return console.error(
                      `Output name "${value}" for method ${methodName} does not exists on the contract ABI`,
                    );
                  }
                }

                return { element: childrenElement, id: property.id };
              }
            })
            .filter(Boolean);

          return { element, childrenElements, feature, properties: sortedProperties, modifiers, attributeMode };
        }

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
        const isAllowedFeature = availableFeatures[featureValue];

        if (!isAllowedFeature) {
          return console.error(`Feature "${featureValue}" not allowed`);
        }

        const properties = values
          .flatMap((str) => {
            if (!str.includes('property')) return null;

            const [key, value = ''] = str.replace('property:', '').split('=');
            const parsedKey = lowerFirst(key);

            return { key: parsedKey, value: sanitizeHtml(value) };
          })
          .filter(Boolean)
          .filter(({ key }) => {
            const availableFeatureProperties = availableFeaturesProperties[featureValue];
            const isPropertyAllowed = availableFeatureProperties.includes(key);

            if (!isPropertyAllowed) {
              console.error(`Property "${key}" is not allowed on Feature "${featureValue}"`);
            }

            return isPropertyAllowed;
          });

        const modifiers = values
          .flatMap((str) => {
            if (!str.includes('modifier')) return null;

            const [key, value = ''] = str.replace('modifier:', '').split('=');

            const availableModifiers = availableFeaturesModifiers[featureValue];
            const defaultValue = availableModifiers.defaultValues[key];
            const parsedValue = value || defaultValue;

            return { key, value: sanitizeHtml(parsedValue) };
          })
          .filter(Boolean)
          .filter(({ key }) => !dataAttributesToExclude.includes(key))
          .filter(({ key, value }) => {
            const availableModifiers = availableFeaturesModifiers[featureValue];
            const isModifier = availableModifiers.modifiers.includes(key);

            if (!isModifier) {
              return console.error(`Modifier "${key}" is not allowed on Feature "${featureValue}"`);
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

// Run core logic
async function main() {
  // TODO: This will came from API, and sending the Token to the API
  const res = await fetch('http://www.mocky.io/v2/5e2e261a3000006200e77e16');
  const projectData = await res.json();

  const parsedActiveElements = parseActiveElements(FEATURES, projectData);
  console.log('parsedActiveElements', parsedActiveElements);
}

main();
