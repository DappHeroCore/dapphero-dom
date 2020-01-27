// Constants
import { DATA_FEATURE } from '~/lib/constants';

// Feature
import { customContract } from './index';

describe('Test customContract dataAttribute', () => {
  const dataAttribute = `${DATA_FEATURE}-customContract`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(customContract.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test customContract dataProperties', () => {
  const properties = ['contractName', 'methodName', 'inputName', 'outputs', 'outputName'];

  test(`if all properties are defined`, () => {
    const customContractProperties = customContract.dataProperties.map(({ id }) => id);
    const hasAllProperties = properties.every((property) => customContractProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all defined validators are a function or a RegExp`, () => {
    const requiredProperties = customContract.dataProperties
      .map((property) => (property.validator ? property : null))
      .filter(Boolean);

    const checkValidator = (validator) => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidValidators = requiredProperties.every(({ validator }) => checkValidator(validator));

    expect(hasAllValidValidators).toBe(true);
  });

  test(`if all defined positions are a valid integer`, () => {
    const requiredProperties = customContract.dataProperties
      .map((property) => (property.position ? property : null))
      .filter(Boolean);

    const checkPosition = (position) => !isNaN(position) && Number.isInteger(position) && position >= 0;
    const hasAllValidPositionIntegers = requiredProperties.every(({ position }) => checkPosition(position));

    expect(hasAllValidPositionIntegers).toBe(true);
  });
});

describe(`Test customContract dataModifiers`, () => {
  const modifiers = ['units', 'decimals', 'display'];

  test(`if all modifiers are defined`, () => {
    const userModifiers = customContract.dataModifiers.map(({ id }) => id);
    const hasAllModifiers = modifiers.every((property) => userModifiers.includes(property));

    expect(hasAllModifiers).toBe(true);
  });
});
