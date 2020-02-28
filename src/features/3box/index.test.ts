// Constants
import { DATA_FEATURE } from '../../lib/constants';

// Feature
import { threebox } from './index';

describe('Test 3Box dataAttribute', () => {
  const dataAttribute = `${DATA_FEATURE}-threebox`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(threebox.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test 3Box dataProperties', () => {
  const properties = ['name', 'location', 'website', 'emoji', 'job', 'description', 'image', 'hover'];

  test(`if all properties are defined`, () => {
    const networkProperties = threebox.dataProperties.map(({ id }) => id);
    const hasAllProperties = properties.every((property) => networkProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all defined validators are a function or a RegExp`, () => {
    const requiredProperties = threebox.dataProperties
      .map((property) => (property.validator ? property : null))
      .filter(Boolean);

    const checkValidator = (validator) => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidValidators = requiredProperties.every(({ validator }) => checkValidator(validator));

    expect(hasAllValidValidators).toBe(true);
  });

  test(`if all defined positions are a valid integer`, () => {
    const requiredProperties = threebox.dataProperties
      .map((property) => (property.position ? property : null))
      .filter(Boolean);

    const checkPosition = (position) => !isNaN(position) && Number.isInteger(position) && position >= 0;
    const hasAllValidPositionIntegers = requiredProperties.every(({ position }) => checkPosition(position));

    expect(hasAllValidPositionIntegers).toBe(true);
  });
});

describe('Test 3Box dataModifiers', () => {
  test(`if doesn't have any modifier defined`, () => {
    expect(threebox.dataModifiers.length === 0).toBe(true);
  });
});
