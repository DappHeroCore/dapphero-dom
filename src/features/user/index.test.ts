// Constants
import { DATA_FEATURE } from '~/lib/constants';

// Feature
import { user } from './index';

describe('Test User dataAttribute', () => {
  const dataAttribute = `${DATA_FEATURE}-user`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(user.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test User dataProperties', () => {
  const properties = ['address', 'balance'];

  test(`if all properties are defined`, () => {
    const userProperties = user.dataProperties.map(({ id }) => id);
    const hasAllProperties = properties.every((property) => userProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all defined validators are a function or a RegExp`, () => {
    const requiredProperties = user.dataProperties
      .map((property) => (property.validator ? property : null))
      .filter(Boolean);

    const checkValidator = (validator) => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidValidators = requiredProperties.every(({ validator }) => checkValidator(validator));

    expect(hasAllValidValidators).toBe(true);
  });

  test(`if all defined positions are a valid integer`, () => {
    const requiredProperties = user.dataProperties
      .map((property) => (property.position ? property : null))
      .filter(Boolean);

    const checkPosition = (position) => !isNaN(position) && Number.isInteger(position) && position >= 0;
    const hasAllValidPositionIntegers = requiredProperties.every(({ position }) => checkPosition(position));

    expect(hasAllValidPositionIntegers).toBe(true);
  });
});

describe('Test User dataModifiers', () => {
  const modifiers = ['units', 'decimals', 'display'];

  test(`if all modifiers are defined`, () => {
    const userModifiers = user.dataModifiers.map(({ id }) => id);
    const hasAllModifiers = modifiers.every((property) => userModifiers.includes(property));

    expect(hasAllModifiers).toBe(true);
  });
});
