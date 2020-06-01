
// Constants
import { DATA_PROPERTY } from '../../lib/constants';

// Utils
import { createAttributeSelector } from '../../lib/utils';

// Types
import { Features, Properties, ProjectData, CustomContract } from '../../lib/types';

export const customContractParser = (
  properties: Properties,
  features: Features,
  projectData: ProjectData,
): CustomContract | void => {
  try {
    const methodIdKey = properties.find((property) => property.key === 'methodId');
    const methodNameKey = properties.find((property) => property.key === 'methodName');
    const contractNameKey = properties.find((property) => property.key === 'contractName');

    // Check if contract name exists in DOM
    if (!contractNameKey || !contractNameKey.value) {
      return console.error(`(DH-DOM) | Contract name should be specified`);
    }

    // Check if contract name exists in ABI
    const contractName = contractNameKey.value;
    const contract = projectData.contracts.find((contract) => contract.contractName === contractName);

    if (!contract) {
      return console.error(`(DH-DOM) | Contract "${contractName}" does not exists on your project`);
    }

    // Check if method name exists in DOM
    if (!methodNameKey || !methodNameKey.value) {
      return console.error(`(DH-DOM) | Method name should be specified`);
    }

    // Check if method id exists in DOM
    if (!methodIdKey || !methodIdKey.value) {
      return console.error(`(DH-DOM) | Method id should be specified`);
    }

    // Get contract
    const contractABI = contract.contractAbi;

    // Check if method name exists in ABI
    const methodId = methodIdKey.value;
    const methodName = methodNameKey.value;
    const contractMethods = contractABI.filter((method) => methodName === method.name);

    // If no contract methods are found, return error
    if (contractMethods.length === 0) {
      return console.error(`(DH-DOM) | Method name "${methodName}" does not exists on the contract ABI`);
    }

    // placeholder for the contract method we will be working with.
    let contractMethod = contractABI.find((method) => methodName === method.name);

    //If we are over loaded, check how many inputs this method has.
    if (contractMethods.length > 1) {
      //Get all the inputs for the Method.
      const contractInputs = Array.from(
        document.querySelectorAll(createAttributeSelector(`data-dh-property-method-id`, methodId)),
      ).filter((element) => !(element.getAttribute('id') || '').includes('dh')).filter((element) => element.nodeName === 'INPUT')

      //Get the method that has the number of imputs which matches
      contractMethod = contractMethods.filter((method) => method.inputs.length === contractInputs.length)[0]

      //If the number of inputs does not match either function, then it's an error. 
    }
    
    if (!contractMethod) {
      return console.error(`(DH-DOM) | Method name "${methodName}" does not exists on the contract ABI`);
    }


    // Transactions are transactions if they are not view, pure or constant
    const isTransaction = !Boolean(['view', 'pure', 'constant'].filter(el => contractMethod.stateMutability === el).length)
    // console.log("isTransaction", isTransaction)

    // const isTransaction = contractMethod.stateMutability !== 'view';
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
          const inputs = contractElements.filter((contractElement) => contractElement.hasAttribute(property.attribute));

          const parsedInputs = inputs
            .map((input) => {
              const value = input.getAttribute(property.attribute);

              // we need to check if the start of value is [ and the end is ] and the middle item is a number. 
              const getIsArray = (value) => {
                if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']' && !isNaN(value.substring(1, value.length - 1))) {
                  return parseInt(value.substring(1, value.length - 1), 10)
                } else {
                  return false
                }
              }

              const inputArrayValue = getIsArray(value)

              const shouldAutoClear = input.getAttribute(`${DATA_PROPERTY}-auto-clear`) === 'true'

              // Check each input name in ABI equals to the value defined in the DOM
              const isInputFound = contractMethod.inputs.some((input) => {
                if (input.name === value) return true
                //check if the actually array value is less than or equal to the input array length
                //note that a zero position value would evaluate falsey, hense we deep equal to false. 
                if (inputArrayValue !== false && inputArrayValue <= contractMethod.inputs.length - 1) {
                  return true
                }
                // There is no match for input name, or for array possition, so return false.
                return false
              });

              // Now that we know it's an array, check if the array value is valid. 
              // Note we will have to also check if ALL the array inputs are found.
              // Note you could also mix&match the array idnex with a named input (Or too complicated?)

              const emptyString = '$true';
              const isEmptyString = value === emptyString;

              if (!['EthValue', emptyString].includes(value) && !isInputFound) {

                return console.error(
                  `(DH-DOM) * Input name "${value}" for method ${methodName} does not exists on the contract ABI`,
                );
              }

              // TODO: [DEV-312] This is part of the error for anonymous inputs
              if (isEmptyString && contractMethod.inputs.length > 1) {
                return console.error(
                  `(DH-DOM) Input with empty string (anonymous input) 
                  cannot be set since exists more than one input on the contract ABI, 
                  use Array input array Index. (See documentation: docs.dapphero.io) `,
                );
              }


              return {
                element: input,
                id: property.id,
                shouldAutoClear,
                argumentName: value,
              };
            })
            .filter(Boolean);

          if (!parsedInputs.length) return null;

          return { element: parsedInputs, id: property.id };
        } else if (property.attribute.includes('output')) {
          const childrenElements = contractElements.filter((contractElement) =>
            contractElement.hasAttribute(property.attribute),
          );

          // TODO: [DEV-121] Figure out why validation fails when output-name is not included
          if (!childrenElements.length) {
            return;
            return console.error(
              `Element with attribute "${property.attribute}" has not been found for property: ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
          }

          const parsedChilrenElements = childrenElements.map((childrenElement) => {
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
          });

          return { element: parsedChilrenElements, id: property.id };
        } else {
          const childrenElement = contractElements.find((contractElement) =>
            contractElement.hasAttribute(property.attribute),
          );


          // TODO: [DEV-121] Figure out why validation fails when output-name is not included
          if (!childrenElement) {
            return;
            return console.error(
              `Element with attribute "${property.attribute}" has not been found for property: ${JSON.stringify(
                property,
                null,
                4,
              )}`,
            );
          }

          // if (property.attribute.endsWith('output-name')) {
          //   const value = childrenElement.getAttribute(property.attribute);

          //   // Check each output name in ABI equals to the value defined in the DOM
          //   const isOutputFound = contractMethod.outputs.some((output) => output.name === value);

          //   if (!isOutputFound) {
          //     return console.error(
          //       `Output name "${value}" for method ${methodName} does not exists on the contract ABI`,
          //     );
          //   }
          // }

          return { element: childrenElement, id: property.id };
        }
      })
      .filter(Boolean);

    const hasInputs = childrenElements.some(
      (childrenElement) => childrenElement && childrenElement.id.includes('input'),
    );

    return {
      contract,
      hasInputs,
      hasOutputs,
      isTransaction,
      childrenElements,
    };
  } catch (error) {
    console.error('Error on customContract parser', error);
  }
};
