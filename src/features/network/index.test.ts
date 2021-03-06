// Constants
import { DATA_FEATURE } from '../../lib/constants';

// Feature
import { network } from './index';

describe('Test Network dataAttribute', () => {
  const dataAttribute = `${DATA_FEATURE}-network`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(network.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test Network dataProperties', () => {
  const properties = ['id', 'name', 'infoType', 'provider', 'enable', 'transfer'];

  test(`if all properties are defined`, () => {
    const networkProperties = network.dataProperties.map(({ id }) => id);
    const hasAllProperties = properties.every((property) => networkProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all defined validators are a function or a RegExp`, () => {
    const requiredProperties = network.dataProperties
      .map((property) => (property.validator ? property : null))
      .filter(Boolean);

    const checkValidator = (validator) => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidValidators = requiredProperties.every(({ validator }) => checkValidator(validator));

    expect(hasAllValidValidators).toBe(true);
  });

  test(`if all defined positions are a valid integer`, () => {
    const requiredProperties = network.dataProperties
      .map((property) => (property.position ? property : null))
      .filter(Boolean);

    const checkPosition = (position) => !isNaN(position) && Number.isInteger(position) && position >= 0;
    const hasAllValidPositionIntegers = requiredProperties.every(({ position }) => checkPosition(position));

    expect(hasAllValidPositionIntegers).toBe(true);
  });
});

describe('Test Network dataModifiers', () => {
  test(`if doesn't have any modifier defined`, () => {
    expect(network.dataModifiers.length === 0).toBe(false);
  });
});
