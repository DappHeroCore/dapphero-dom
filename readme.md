# DappHero - DOM

### Commands

| Action     | Command            | Info                                 |
| ---------- | ------------------ | ------------------------------------ |
| Developing | `yarn dev`         | http://localhost:1234                |
| Testing    | `yarn test`        | Jest                                 |
| Testing    | `yarn test:watch`  | Jest in watch mode                   |
| Building   | `yarn build`       | Build for production                 |
| Building   | `yarn build:watch` | Build for production with watch mode |
| Publishing | `yarn publish:npm` | Publish to NPM                       |
| Publishing | `yarn publish:now` | Publish to NOW                       |

### Developing

Just run `yarn dev`, open [http://localhost:1234](http://localhost:1234) on your browser, and open `/src/index.html` in your code editor and you will have several feature examples, you can play removing and editing features, properties and modifiers.

### Installing

To install simple run:

```bash
> yarn add @dapphero/dapphero-dom
```

Then import your dependencies:

```javascript
import { getDomElements } from '@dapphero/dapphero-dom';
```

### API

| Method         | Params               | Returns        | Description                                 |
| -------------- | -------------------- | -------------- | ------------------------------------------- |
| getDomElements | projectData (Bubble) | activeElements | Get all DappHero active elements on the DOM |

### How to Use for Developers

Pick only one of the following modes, `id` or `data`.
Data Mode it's more recommended since it's cleaner and readable.

#### ID Mode (WIP)

Keep in mind that working with the ID mode you need to add the keys separated by a comma `,`.

1. Add the attribute `id` with the value `dh`:

```html
<div id="dh">...</div>
```

2. **Optionally:** Add the key `enabled:false` (default: true) in order to deactivate DappHero engine on that particular element.

```html
<div id="dh,enabled:false"></div>
```

3. Add the key `feature`, a semicolon `:`, and one of the following features: `network`, `user`, `3box`, `customContract`, `nft`

Example:

```html
<div id="dh,feature:network">...</div>
```

4. Add the properties you want to set or get in the chosen feature To follow this step please refer to the feature particular documentation:
   - [Network](##Network)
   - [User](##User)
   - [3Box](##3Box)
   - [Custom Contract](##Contract)
   - [NFT](##NFT)

Example:

```html
<div id="dh,feature:network,property:id">...</div>
```

#### Data Mode

1. Add the attribute `id` with the value `dh`:

```html
<div id="dh">...</div>
```

2. **Optionally:** Add the attribute `data-dh-enabled` (default: true) with value `false` in order to
   deactivate DappHero engine on that particular element.

```html
<div id="dh" data-dh-enabled="false">...</div>
```

3. Add the tag `data-dh-feature` and the feature you want on the same element.
   The possible feature values are: `network`, `user`, `3box`, `customContract`, `nft`

```html
<div id="dh" data-dh-feature="network">...</div>
```

4. Add the properties you want to set or get in the chosen feature
   To follow this step please refer to the feature particular documentation:
   - [Custom Contract](###Contract)
   - [Network](###Network)
   - [User](###User)
   - [3Box](###3Box)
   - [NFT](###NFT)

Example:

```html
<div data-dh-enabled="true" data-dh-feature="network" data-dh-id>...</div>
```

### Contract

#### Public Method

- Data Mode

  1. Add the `data-dh-property-contract-name` attribute with the contract name as a value

  ```html
  <div id="dh" data-dh-feature="customContract" data-dh-property-contract-name="erc20">
    ...
  </div>
  ```

  2. Add the `data-dh-property-method-name` attribute with the method name you want to trigger

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    ...
  </div>
  ```

  3. Add the `inputs` tags to you want to populate the method parameters. They can be direct children or be in any HTML element that's why you must declare on each one the `data-dh-property-contract-name`.

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_to" />
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_value" />
  </div>
  ```

  4. **(Optionally)** Add the `inputs` tags to you want to populate the method parameters.

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_to" />
  </div>
  ```

  > They can be direct children or be in any HTML element that's why you must declare on each one the _data-dh-property-contract-name_ attribute with it's value

  5. **(Optionally)** if you want to get all method outputs inside a element add the `data-dh-property-outputs` attribute without values.

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_to" />
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_value" />

    <div data-dh-property-contract-name="erc20" data-dh-property-outputs>
      ...
    </div>
  </div>
  ```

  > They can be direct children or be in any HTML element that's why you must declare on each one the _data-dh-property-contract-name_ attribute with it's value

  6. **(Optionally)** if you want to get a specific output and you know the output name before hand you can define it in a tag

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_to" />
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_value" />

    <div data-dh-property-contract-name="erc20" data-dh-property-output-name="isTransferSuccess">
      ...
    </div>
  </div>
  ```

  7. Finally if you want to trigger the method with your own elements add the `data-dh-property-invoke` to that element.

  ```html
  <div
    id="dh"
    data-dh-feature="customContract"
    data-dh-property-contract-name="erc20"
    data-dh-property-method-name="transfer"
  >
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_to" />
    <input data-dh-property-contract-name="erc20" data-dh-property-input-name="_value" />

    <div data-dh-property-contract-name="erc20" data-dh-property-output-name="isTransferSuccess">
      ...
    </div>

    <button data-dh-property-contract-name="erc20" data-dh-property-invoke>
      ...
    </button>
  </div>
  ```

  > They can be direct children or be in any HTML element that's why you must declare on each one the _data-dh-property-contract-name_ attribute with it's value

- ID Mode
  Follow the same steps as before but with the following syntax:

```html
<div id="dh,feature:customContract,property:contractName=erc20,property:methodName=transfer">
  <input id="property:contractName=erc20,property:inputName=_to" />
  <input id="property:contractName=erc20,property:inputName=_value" />

  <!--For public methods - Get all outputs -->
  <div id="property:contractName=erc20,property:outputs">
    ...
  </div>

  <!-- For public methods - Get only one output by it's name -->
  <div id="property:contractName=erc20,property:outputName=isTransferSuccess">
    ...
  </div>

  <button id="property:contractName=erc20,property:invoke">
    ...
  </button>
</div>
```

### Network

#### Properties

- **Get ID**

  - ID Mode

  ```html
  <div id="dh,feature:network,property:id">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="network" data-dh-property-id>
    ...
  </div>
  ```

- **Get Info Type**

  - ID Mode

  ```html
  <div id="dh,feature:network,property:infotype">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="network" data-dh-property-info-type>
    ...
  </div>
  ```

- **Get Name**

  - ID Mode

  ```html
  <div id="dh,feature:network,property:name">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="network" data-dh-property-name>
    ...
  </div>
  ```

- **Get Provider:**

  - ID Mode

  ```html
  <div id="dh,feature:network,property:provider">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="network" data-dh-property-provider>
    ...
  </div>
  ```

#### Modifiers

Network feature has no modifiers available.

### User

#### Properties

- **Get Address**

  - ID Mode

  ```html
  <div id="dh,feature:user,property:address">
    ...
  </div>
  ```

- Data Mode

  ```html
  <div id="dh" data-dh-feature="user" data-dh-property-address>
    ...
  </div>
  ```

- **Get Balance**

  - ID Mode

  ```html
  <div id="dh,feature:user,property:balance">
    ...
  </div>
  ```

- Data Mode

  ```html
  <div id="dh" data-dh-feature="user" data-dh-property-balance>
    ...
  </div>
  ```

#### Modifiers

- **Unit modifier**
  Possible values are : `wei`, `ether`

  - ID Mode

    ```html
    <div id="dh,feature:user,property:balance,modifier:unit=wei">
      ...
    </div>
    ```

  - Data Mode

    ```html
    <div id="dh" data-dh-feature="user" data-dh-property-balance data-dh-modifier-units="wei">
      ...
    </div>
    ```

- **Decimals modifier**
  Possible values is any `positive integer`

  - ID Mode

    ```html
    <div id="dh,feature:user,property:balance,modifier:decimals=4">
      ...
    </div>
    ```

  - Data Mode

    ```html
    <div id="dh" data-dh-feature="user" data-dh-property-balance data-dh-modifier-units="wei">
      ...
    </div>
    ```

- **Display modifier**
  Possible values are : `short`, `full`

  - ID Mode

    ```html
    <div id="dh,feature:user,property:address,modifier:display=short">
      ...
    </div>
    ```

  - Data Mode

    ```html
    <div id="dh" data-dh-feature="user" data-dh-property-address data-dh-modifier-display="short">
      ...
    </div>
    ```

### 3Box

#### Properties

- **Get Name**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:name">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-name>
    ...
  </div>
  ```

- **Get Location**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:location">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-location>
    ...
  </div>
  ```

- **Get Website**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:website">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-website>
    ...
  </div>
  ```

- **Get Emoji**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:emoji">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-emoji>
    ...
  </div>
  ```

- **Get Job**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:job">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-job>
    ...
  </div>
  ```

- **Get Description**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:description">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-description>
    ...
  </div>
  ```

- **Get Image**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:image">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-image>
    ...
  </div>
  ```

- **Get Hover**

  - ID Mode

  ```html
  <div id="dh,feature:threebox,property:hover">
    ...
  </div>
  ```

  - Data Mode

  ```html
  <div id="dh" data-dh-feature="threebox" data-dh-property-hover>
    ...
  </div>
  ```

#### Modifiers

Network feature has no modifiers available.

### NFT

1. Define one HTML element with the following attributes:


    a. Define an unique id in "data-dh-property-tag-id"

    <br/>

    b. Choose from who we want to the NFTs:
    - Get NFTs from an owner
    `Define one account address in "data-dh-property-asset-account-address" attribute`

    - Get NFTs from an contract address
    `Define one account address in "data-dh-property-asset-contract-address" attribute`

    <br/>

    c. Choose what NFT collection you want to receive:
      - Get a Single NFT
      `Define one token id in "data-dh-property-asset-token-id" attribute`

      - Get a list of specific NFTs
      `Define a list of token ids separated by comma in "data-dh-property-asset-token-id" attribute`

      - Get all NFTs
      `Don't need to define any special attribute`

<br/>

2. Define another element anywhere you want:
   a. Define one div with the **same** tag id
   b. In that element define the attribute **data-dh-property-asset-item** without a value
   c. Inside that element define all the children elements you desire
   d. Define per children element each json path `data-dh-property-asset-json-path="image_url"`

Example:

```html
<div
  data-dh-feature="nft"
  data-dh-property-tag-id="033"
  data-dh-property-asset-token-id="101817,101778,101695"
  data-dh-property-asset-contract-address="0x06012c8cf97bead5deae237070f9587f8e7a266d"
>
  <div data-dh-property-tag-id="033" data-dh-property-asset-item class="component-div">
    <img data-dh-property-asset-json-path="image_url" />
    <h3 data-dh-property-asset-json-path="name"></h3>
  </div>
</div>
```

### Attributes

We need to find a way that's easy to use for the designer/developer and at the same time faster and maintanable to parse through the DOM:

#### ❌ What we can't do:

- Using [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) or [class](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attributes since accidentally we can remove or modify an existing value and therefore break CSS styling or a JavaScript interaction.

* Using custom attributes like `dh-feature` or `dh-contract-name` since they don't have a formal API to query them easily. Even though they work but the browser doesn't have any default way to handle them.

- Using [split](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split), [match](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match), or any other method that uses Strings or RegExp to parse an string into an array. Those are great but are prone to errors due to a bad defined RegExp or accessing an unexisting element in an array and then doing some parsing to it.

#### ✅ What we can do:

- Use [data](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) attributes to handle DappHero features (i.e Network, User Info, Contracts, ThreeBox, etc) and properties to handle special values (i.e units, contractName, methodName, etc).

* Use `dh-[property]` prefix to accidentally avoid writing some `data` attribute on the DOM and break CSS / JavaScript functionality.

- Get data attributes using [dataset](https://caniuse.com/#feat=dataset) and parse through a **custom configuration object** to do some custom actions like: parsing, requiring, validiting, sanitizing and sorting.

### Active Elements

The active elements are those DOM elements that has the `data-dh-enabled="true"` attribute assigned.
So the designer or developer using the NoCode tool can easily disable or enable the DappHero engine.

### Features Configuration

This object will serve to run all validations needed against active elements.

Example with only one feature "network" and only one property "id":

```typescript
export const features = {
  network: {
    dataAttribute: `${FEATURE}-network`,
    dataProperties: [
      {
        key: 'id',
        attribute: `${PREFIX}-network-id`,
        required: false,
        validator: null,
        position: null,
      },
    ],
  },
};
```

## Features Support

- [x] Network
- [x] User
- [x] 3Box
- [x] Custom Contract
- [x] NFT

## Roadmap

- [ ] Analytics for data-attributes use
- [ ] Get configuration object from API
- [ ] Webflow tests with Cypress
- [ ] Think on how to handle Placeholders and Loaders
- [ ] Investigate bundler to use to generate the final bundle
- [ ] Add deploy script for NPM, and add badges
- [ ] Add link and badge for UNPKG, NPM CDN
- [ ] Add Husky, to run Prettier and Jest on pre-commit
- [ ] Check for repeated data-attributes
- [ ] Add error logging using Sentry
- [ ] Add in documnetation support table for different UI/NoCode tools like WebFlow and Bubble

## Separation of Concerns

A improve over DappHero functionality will be to separate the Core into DOM and Core, since we will be able to handle al DOM related stuff in a more maintanable and cleaner way, and the Core will use those helpers and only handle the React and the features logic itself.

![Separation](/docs/Separation.png)

## Scaffolding

![Scaffolding](/docs/Scaffolding.png)
