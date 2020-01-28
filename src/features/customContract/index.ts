// Constants
import { DATA_FEATURE, DATA_PROPERTY, DATA_MODIFIER } from '~/lib/constants';

export const customContract = {
  id: 'customContract',
  dataAttribute: `${DATA_FEATURE}-customContract`,
  dataProperties: [
    {
      id: 'contractName',
      attribute: `${DATA_PROPERTY}-contract-name`,
      required: true,
      validator: null,
      position: null,
    },
    {
      id: 'methodName',
      attribute: `${DATA_PROPERTY}-method-name`,
      required: true,
      validator: null,
      position: null,
    },
    {
      id: 'inputName',
      attribute: `${DATA_PROPERTY}-input-name`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'outputs',
      attribute: `${DATA_PROPERTY}-outputs`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'outputName',
      attribute: `${DATA_PROPERTY}-output-name`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
    {
      id: 'invoke',
      attribute: `${DATA_PROPERTY}-invoke`,
      required: false,
      validator: null,
      position: null,
      type: 'children',
    },
  ],
  dataModifiers: [
    {
      id: 'units',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'decimals',
      defaultValue: '10',
      attribute: `${DATA_MODIFIER}-decimals`,
      validator: (value) => !isNaN(value) && Number.isInteger(Number(value)),
    },
    {
      id: 'display',
      defaultValue: 'full',
      attribute: `${DATA_MODIFIER}-display`,
      validator: (value) => ['full', 'short'].includes(value),
    },
  ],
};
