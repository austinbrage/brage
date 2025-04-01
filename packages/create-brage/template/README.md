# **Express + MySQL2 + Brage**

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![MySQL](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

#### Minimal setup to get Express and MySQL2 working with Brage in Vanilla JavaScript.
##### Start creating new routes on the ***app*** folder [see the README file on app]
---

## API Route

#### The API wraps all its dynamically created routes into the `/app` address

| Endpoint  | Description | 
| ------ | ------ |
| **`/app`** | API Version 1 |

## Healthcare Route

#### The API comes with 2 default routes in the `/ping` address within `/app` to verify both the client's connection to the api and to the database

| Endpoint | Queries | Description | 
| ------ | ------ | ------ |
| **GET **`/ping/api`**** | none | Verify API connection |
| **GET **`/ping/database`**** | none | Verify DB connection |

## _Example Route_

#### If a folder called `articles` with the _table.sql_ and _queries.sql_ files on it is created on app then the `/articles` route wil be added to the main `/app` route 

> When the template is created, it has an ARTICLES FOLDER to test the brage tool, run the following command
>
> ```
> npm run dev:brage
> ```