import shortid from 'shortid';

// Types
import { Features } from './lib/types';

// Constants
import { DATA_FEATURE, DATA_PROPERTY, ELEMENT_TYPES, TAG_TYPES } from './lib/constants';

// Getters
import {
  getActiveElements,
  getAvailableFeatures,
  getAvailableModifiers,
  getAvailableProperties,
  getFeaturesPropertiesPosition,
} from './lib/getters';

// Features
import { FEATURES } from './features/index';

// Utils
import {
  getModifiers,
  getProperties,
  sortProperties,
  getAttributeMode,
  getElementDataset,
  getDataElementProperties,
} from './lib/utils';

// Parsers
import { nftParser } from './features/nft/parser';
import { customContractParser } from './features/customContract/parser';

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
        // Disable DH engine if there is a data-dh-enabled=false attribute
        const enabled = dataset.dhEnabled;
        const isDisabled = enabled && enabled === 'false';
        if (isDisabled) return null;

        // get the value of the data-dh-feature attribute
        const feature = element.getAttribute(DATA_FEATURE);

        if (!feature) {
          return console.error(`(DH-DOM) | Feature attribute was not added to the element`);
        }

        // Check to see if feature is on the allowed list
        const isAllowedFeature = availableFeatures[feature];

        if (!isAllowedFeature) {
          return console.error(`(DH-DOM) | Feature "${feature}" not allowed`);
        }

        const dataElementProperties = getDataElementProperties(dataset);

        // Get array of objects whose key, value is the key value pair of properties, filtered by the allowed properties list
        const properties = getProperties(
          dataElementProperties,
          dataAttributesToExclude,
          availableFeaturesProperties,
          feature,
        );
        const sortedProperties = sortProperties(properties, featuresPropertiesPositions, feature);

        // Build modifiers object based on if its allowed and using default values
        const modifiers = getModifiers(dataset, availableFeaturesModifiers, dataAttributesToExclude, feature);

        // Custom Contract Feature
        if (feature === availableFeatures.customContract) {
          const customContractData = customContractParser(properties, features, projectData);
          if (!customContractData) return;

          const { contract, isTransaction, hasInputs, hasOutputs, childrenElements } = customContractData;

          return {
            element,
            contract,
            feature,
            modifiers,
            hasInputs,
            hasOutputs,
            attributeMode,
            isTransaction,
            childrenElements,
            properties: sortedProperties,
          };
        }

        if (feature === availableFeatures.nft) {
          const nft = nftParser(properties, features);

          return {
            nft,
            feature,
            element,
            modifiers,
            attributeMode,
            properties: sortedProperties,
          };
        }

        return { element, feature, properties: sortedProperties, modifiers, attributeMode };
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

// Exports from library
export const getDomElements = (projectData) => {
  const parsedActiveElements = parseActiveElements(FEATURES, projectData);
  return parsedActiveElements;
};

export { TAG_TYPES, ELEMENT_TYPES, DATA_PROPERTY };

// Test:
// const data = require('../mock.json');
// const domElements = getDomElements(data);
