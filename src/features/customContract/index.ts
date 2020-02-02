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
      id: 'methodId',
      attribute: `${DATA_PROPERTY}-method-id`,
      required: true,
      validator: null,
      position: null,
    },
    {
      id: 'ethValue',
      attribute: `${DATA_PROPERTY}-eth-value`,
      required: false,
      validator: null,
      position: null,
    },
    {
      id: 'autoInvoke',
      attribute: `${DATA_PROPERTY}-auto-invoke`,
      required: false,
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
    // ! Deprecated Please use displayUnits or inputUnits instead
    {
      id: 'units',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-units`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'displayUnits',
      defaultValue: 'ether',
      attribute: `${DATA_MODIFIER}-displayUnits`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },
    {
      id: 'inputUnits',
      defaultValue: 'wei',
      attribute: `${DATA_MODIFIER}-inputUnits`,
      validator: (value) => ['wei', 'ether'].includes(value),
    },

    // ! Deprecated Please use displayDecimals instead
    {
      id: 'decimals',
      defaultValue: '10',
      attribute: `${DATA_MODIFIER}-decimals`,
      validator: (value) => !isNaN(value) && Number.isInteger(Number(value)),
    },
    {
      id: 'displayDecimals',
      defaultValue: '3',
      attribute: `${DATA_MODIFIER}-displayDecimals`,
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
