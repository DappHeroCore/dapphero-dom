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
  id: string;
  value: string;
};

export type ChildrenElement =
  | {
      id: string;
      element: HTMLElement;
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
  feature: AvailableFeatures;
  attributeMode: 'id' | 'data';
};

export type AvailableProperties = {
  [key in AvailableFeatures]?: Pick<Property, 'id'>;
};

export type AvailableFeaturesMap = {
  [key in AvailableFeatures]?: AvailableFeatures;
};
