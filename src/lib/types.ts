import { TAG_TYPES } from './constants';

export type AvailableFeatures = 'network' | 'user' | 'customContract' | 'threebox' | 'nft';

export type DataProperty = {
  id: string;
  attribute: string;
  required: boolean;
  validator?: RegExp;
  position?: number;
  type?: string;
};

export type DataModifier = {
  id: string;
  attribute: string;
  defaultValue: string;
  validator?: (val: string) => boolean;
};

export type Feature = {
  id: String;
  dataAttribute: String;
  dataModifiers: DataModifier[];
  dataProperties: DataProperty[];
};

// FIXME: Keys are optional since all Features are not supported yet
export type Features = {
  [key in AvailableFeatures]?: Feature;
};

export type FeaturesEntries = [AvailableFeatures, Feature];

export type PropertyPosition = {
  [key in string]: number;
};

export type PropertiesPositions = {
  [key in AvailableFeatures]?: PropertyPosition;
};

export type Property = {
  key: string;
  value: string;
};

export type Properties = Property[];

export type ChildrenElement =
  | {
      id: string;
      element: Element;
    }
  | ChildrenElement[];

export type InputOutput = {
  name: string;
  type: string;
};

export type ABI = {
  constant?: boolean;
  anonymous?: boolean;
  name: string;
  outputs: InputOutput[];
  inputs: InputOutput[];
  payable: boolean;
  stateMutability: string;
  type: string;
};

export type Contract = {
  address: string;
  abi: ABI;
};

export type ActiveElement = {
  element?: HTMLElement;
  contract?: Contract;
  childrenElements?: ChildrenElement[];
  properties: Property[];
  properties_: { [key: string]: string };
  modifiers_: { [key: string]: string };
  feature: AvailableFeatures;
  attributeMode: 'id' | 'data';
};

export type AvailableProperties = {
  [key in AvailableFeatures]?: Pick<Property, 'key'>;
};

export type AvailableFeaturesMap = {
  [key in AvailableFeatures]?: AvailableFeatures;
};

export type tagTypes = typeof TAG_TYPES;

/* Custom Contract */
export type CustomContract = {
  contract: ProjectContract;
  hasInputs: boolean;
  hasOutputs: boolean;
  isTransaction: boolean;
  childrenElements?: any;
};

/* NFT */
export type nftItemChildren = {
  element: HTMLElement;
  type: keyof tagTypes;
};

export type nftItem = {
  root?: HTMLElement;
  childrens?: nftItemChildren[];
};

export type NFT = {
  tokens: string[];
  item: nftItem;
};

export type ProjectData = {
  contracts: ProjectContract[];
};

export type ProjectContract = {
  contractName: string;
  contractAddress: string;
  contractAbi: ContractABI[];
};

export type ContractABI = {
  name: string;
  inputs: Put[];
  outputs: Put[];
  type: string;
  stateMutability: string;
};

export type Put = {
  name: string;
  type: string;
  internalType: string;
};
