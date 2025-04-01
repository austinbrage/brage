# **App folder**

#### In this directory each folder will create a new RESOURCE on the API
##### Each created folder must have a ***table.sql*** and a ***queries.sql*** file to work

---
### **How do I write the ***table.sql***?**
> **The query MUST be written for MySQL to create a new table to be queried in the API route**
> 
> **The name of the table and each field on it MUST be written within `backticks`**
>
> **The order of each field definition in a SQL table MUST be as follows: | TYPE | NULLABLE | DEFAULT VALUE |**
```sql
CREATE TABLE `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL DEFAULT 'Unnamed article',
  `title` VARCHAR(200) NOT NULL DEFAULT 'Untittled article',
  `image` TEXT DEFAULT NULL,
  UNIQUE KEY `user_id_name_unique` (`user_id`,`name`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

### **How do I write the ***queries.sql***?**
> **All table fields called on the query MUST be written within `backticks`**
> 
> **The query MUST be written for MySQL with the '?' symbol in the data insertions**
> 
> **The title of each query MUST be commented above the query and MUST begin with get, add, change, or delete**
> 
> **Between each query MUST be blank space, even after the last query**
> 
> **Optional: The endpoint and message route can be added after the -- ! pattern between the title and the query**
```sql
    -- addNew
        INSERT INTO `sections` (`article_id`, `content`, `image_url`)
        VALUES (?, ?, ?, ?);
    
    -- remove
    -- ! endpoint: remove/section
    -- ! message: section from article removed 
        DELETE FROM `sections`
        WHERE `id` = ?;
    
```

- **INFORMATION**: When the template is created, it has an ARTICLES FOLDER to test the brage command and it also has a reference to the SQL files in the app directory

 - **WARNING**: The tool's type inference only works with primitive types so far, so be sure to only use numbers, texts, or boolean values ​​in the table.sql definition

#### __How it works behind the scenes?__

    The table.sql file defined the validation schemas
    The queries.sql file defined the model, controller and router
    
    So make sure the queries.sql is the last file modified on the app route