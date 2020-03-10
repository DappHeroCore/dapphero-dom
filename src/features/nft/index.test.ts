// Constants
import { DATA_FEATURE } from '../../lib/constants';

// Feature
import { nft } from './index';

describe('Test nft dataAttribute', () => {
  const dataAttribute = `${DATA_FEATURE}-nft`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(nft.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test nft dataProperties', () => {
  const properties = [
    'tagId',
    'assetTokenId',
    'assetOwnerAddress',
    'assetContractAddress',
    'assetItem',
    'assetJsonPath',
  ];

  test(`if all properties are defined`, () => {
    const nftProperties = nft.dataProperties.map(({ id }) => id);
    const hasAllProperties = properties.every((property) => nftProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all defined validators are a function or a RegExp`, () => {
    const requiredProperties = nft.dataProperties
      .map((property) => (property.validator ? property : null))
      .filter(Boolean);

    const checkValidator = (validator) => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidValidators = requiredProperties.every(({ validator }) => checkValidator(validator));

    expect(hasAllValidValidators).toBe(true);
  });

  test(`if all defined positions are a valid integer`, () => {
    const requiredProperties = nft.dataProperties
      .map((property) => (property.position ? property : null))
      .filter(Boolean);

    const checkPosition = (position) => !isNaN(position) && Number.isInteger(position) && position >= 0;
    const hasAllValidPositionIntegers = requiredProperties.every(({ position }) => checkPosition(position));

    expect(hasAllValidPositionIntegers).toBe(true);
  });
});

describe(`Test nft dataModifiers`, () => {
  const modifiers = [];

  test(`if all modifiers are defined`, () => {
    const userModifiers = nft.dataModifiers.map(({ id }) => id);
    const hasAllModifiers = modifiers.every((property) => userModifiers.includes(property));

    expect(hasAllModifiers).toBe(true);
  });
});
