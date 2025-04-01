CREATE TABLE `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL DEFAULT 'Unnamed article',
  `title` VARCHAR(200) NOT NULL DEFAULT 'Untittled article',
  `keywords` TEXT NOT NULL DEFAULT 'General, Tech',
  `description` TEXT NOT NULL DEFAULT 'Empty description',
  `image` TEXT DEFAULT NULL,
  `is_publish` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `user_id_name_unique` (`user_id`,`name`)
);