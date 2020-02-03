import shortid from 'shortid';
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
  getAvailableModifiers,
  getAvailableProperties,
  getFeaturesPropertiesPosition,
} from '~/lib/getters';

// Features
import { FEATURES } from '~/features/index';

// Utils
import {
  sortProperties,
  getAttributeMode,
  getElementDataset,
  getIdElementProperties,
  getDataElementProperties,
  createAttributeSelector,
} from '~/lib/utils';

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
  const parsedElements: { [key: string]: any } = activeElements
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

        const properties = getDataElementProperties(dataset)
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

        // Custom Contract Feature
        if (feature === availableFeatures.customContract) {
          const methodIdKey = properties.find((property) => property.key === 'methodId');
          const methodNameKey = properties.find((property) => property.key === 'methodName');
          const contractNameKey = properties.find((property) => property.key === 'contractName');

          // Check if contract name exists in DOM
          if (!contractNameKey || !contractNameKey.value) {
            return console.error(`Contract name should be specified`);
          }

          // Check if contract name exists in ABI
          const contractName = contractNameKey.value;
          const contract = projectData.contracts.find((contract) => contract.contractName === contractName);

          if (!contract) {
            return console.error(`Contract "${contractName}" does not exists on your project`);
          }

          // Check if method name exists in DOM
          if (!methodNameKey || !methodNameKey.value) {
            return console.error(`Method name should be specified`);
          }

          // Check if method id exists in DOM
          if (!methodIdKey || !methodIdKey.value) {
            return console.error(`Method id should be specified`);
          }

          // Get contract
          const contractABI = contract.contractAbi;

          // Check if method name exists in ABI
          const methodId = methodIdKey.value;
          const methodName = methodNameKey.value;
          const contractMethod = contractABI.find((method) => method.name === methodName);

          if (!contractMethod) {
            return console.error(`Method name "${methodName}" does not exists on the contract ABI`);
          }

          const isTransaction = contractMethod.stateMutability !== 'view';
          const hasOutputs = contractMethod.outputs.length > 0;

          // Get customContract children properties
          const childrenProperties = features.customContract.dataProperties.filter(
            (property) => property.type === 'children',
          );

          // Get all elements (inputs, outputs, and invoke buttons) with the method name
          const contractElements = Array.from(
            document.querySelectorAll(createAttributeSelector(`data-dh-property-method-id`, methodId)),
          ).filter((element) => !(element.getAttribute('id') || '').includes('dh'));

          // Get all children elements
          const childrenElements = childrenProperties
            .map((property) => {
              if (property.attribute.includes('input')) {
                const inputs = contractElements.filter((contractElement) =>
                  contractElement.hasAttribute(property.attribute),
                );

                const parsedInputs = inputs
                  .map((input) => {
                    const value = input.getAttribute(property.attribute);

                    // Check each input name in ABI equals to the value defined in the DOM
                    const isInputFound = contractMethod.inputs.some((input) => input.name === value);

                    if (value !== 'EthValue' && !isInputFound) {
                      return console.error(
                        `Input name "${value}" for method ${methodName} does not exists on the contract ABI`,
                      );
                    }

                    return {
                      element: input,
                      id: property.id,
                      argumentName: value,
                    };
                  })
                  .filter(Boolean);

                if (!parsedInputs.length) return null;

                return { element: parsedInputs, id: property.id };
              } else {
                const childrenElement = contractElements.find((contractElement) =>
                  contractElement.hasAttribute(property.attribute),
                );

                if (!childrenElement) {
                  return console.error(`Element with attribute "${property.attribute}" has not been found`);
                }

                if (property.attribute.endsWith('output-name')) {
                  const value = childrenElement.getAttribute(property.attribute);

                  // Check each output name in ABI equals to the value defined in the DOM
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

          const hasInputs = childrenElements.some(
            (childrenElement) => childrenElement && childrenElement.id.includes('input'),
          );

          return {
            element,
            contract,
            isTransaction,
            hasInputs,
            hasOutputs,
            childrenElements,
            feature,
            properties: sortedProperties,
            modifiers,
            attributeMode,
          };
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

        const properties = getIdElementProperties(element)
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

        // Custom Contract Feature
        if (featureValue === availableFeatures.customContract) {
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
          const contract = projectData.contracts[contractName];
          const contractABI = contract.abi;

          // Check if method name exists in ABI
          const methodName = methodNameKey.value;
          const contractMethod = contractABI.find((method) => method.name === methodName);

          if (!contractMethod) {
            return console.error(`Method name "${methodName}" does not exists on the contract ABI`);
          }

          const isTransaction = contractMethod.stateMutability !== 'view';
          const hasOutputs = contractMethod.outputs.length > 0;

          // Get customContract children properties
          const childrenProperties = features.customContract.dataProperties.filter(
            (property) => property.type === 'children',
          );

          // Get all elements with the contract name
          const contractElements = Array.from(
            document.querySelectorAll(createAttributeSelector('id', contractName, '*=')),
          ).filter((element) => !(element.getAttribute('id') || '').includes('dh'));

          // Get all children elements
          const childrenElements = childrenProperties
            .map((property) => {
              if (property.attribute.includes('input')) {
                const inputs = contractElements.filter((contractElement) =>
                  contractElement.getAttribute('id').includes(property.id),
                );

                const parsedInputs = inputs
                  .map((input) => {
                    const inputProperties = getIdElementProperties(input);
                    const inputProperty = inputProperties.find((inputProperty) => inputProperty.key === property.id);

                    if (!inputProperty) {
                      return console.error(`Property id "${property.id}" not defined on element`);
                    }

                    // Check each input name in ABI equals to the value defined in the DOM
                    const { value } = inputProperty;
                    const isInputFound = contractMethod.inputs.some((input) => input.name === value);

                    if (!isInputFound) {
                      return console.error(
                        `Input name "${value}" for method ${methodName} does not exists on the contract ABI`,
                      );
                    }

                    return { element: input, id: property.id, argumentName: value };
                  })
                  .filter(Boolean);

                return { element: parsedInputs, id: property.id };
              } else {
                const childrenElement = contractElements.find((contractElement) =>
                  contractElement.getAttribute('id').includes(property.id),
                );

                if (property.attribute.endsWith('outputName')) {
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

          const hasInputs = childrenElements.some(
            (childrenElement) => childrenElement && childrenElement.id.includes('input'),
          );

          return {
            element,
            contract,
            isTransaction,
            hasInputs,
            hasOutputs,
            childrenElements,
            feature,
            properties: sortedProperties,
            modifiers,
            attributeMode,
          };
        }

        return {
          element,
          feature: featureValue,
          properties: sortedProperties,
          modifiers,
          attributeMode,
        };
      }
    })
    .filter(Boolean);

  return parsedElements.map((parsedElement) => ({
    ...parsedElement,
    id: shortid.generate(),
    properties_: parsedElement.properties.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
    modifiers_: parsedElement.modifiers.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
  }));
}

// Run core logic
export const getDomElements = (projectData) => {
  const parsedActiveElements = parseActiveElements(FEATURES, projectData);
  return parsedActiveElements;
};

// Test:
// const data = require('../mock.json');
// getDomElements(data);
