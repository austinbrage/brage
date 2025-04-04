# **Backend Revolutionary Architecture Generation Engine**

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![MySQL](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<p align="left">
  <a href="https://brage.app" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://brage.app/brain-gear.png" alt="Brage logo">
  </a>
</p>
<br/>

### _BRAGE tool working on express with a mysql database_

#### _This tool allows NODE developers to create complete apis dynamically only by providing the sql table schema and sql queries to handle on the api routes_

## 1. Get Started

To make the software available any time you need first install the packages globally

```
  npm install -g create-brage brage-js
```

## 2. Start using it

Once the tool is set up on the machine then the started api __template can be created with the following command__

_[this command will create a complete api template on a given folder name]_

```
  create-brage
```

After the template is created and the route folders are added to the app directory _(see README file on app folder)_ then

__the routes can be added on the server with the following command__

```
  brage
```

| Package                                         | Version (click for readmes)                                                                                                       |
| ----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| [brage](packages/brage)                         | [![brage version](https://img.shields.io/npm/v/brage-js.svg?label=%20)](packages/brage/README.md)                                 |
| [create-brage](packages/create-brage)           | [![create-brage version](https://img.shields.io/npm/v/create-brage.svg?label=%20)](packages/create-brage/README.md)               |

## Documentation

[docs.brage.app](https://docs.brage.app)

## License

[BUSL-1.1](LICENSE)