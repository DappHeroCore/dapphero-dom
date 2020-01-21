// Constants
import { FEATURE } from '~/lib/constants';

// Feature
import { network } from './index';

describe('Test Network dataAttribute', () => {
  const dataAttribute = `${FEATURE}-network`;

  test(`if feature data-attribute is ${dataAttribute}`, () => {
    expect(network.dataAttribute).toBe(dataAttribute);
  });
});

describe('Test Network dataProperties', () => {
  const properties = ['id', 'name', 'provider'] as const;

  test(`if all properties are defined`, () => {
    const networkProperties = network.dataProperties.map(({ key }) => key);
    const hasAllProperties = properties.every(property => networkProperties.includes(property));

    expect(hasAllProperties).toBe(true);
  });

  test(`if all enabled validators are present`, () => {
    const requiredProperties = network.dataProperties
      .map(property => (property.validation.enabled ? property : null))
      .filter(Boolean);

    const checkValidator = validator => validator && (typeof validator === 'function' || validator instanceof RegExp);
    const hasAllValidators = requiredProperties.every(({ validation: { validator } }) => checkValidator(validator));

    expect(hasAllValidators).toBe(true);
  });
});
