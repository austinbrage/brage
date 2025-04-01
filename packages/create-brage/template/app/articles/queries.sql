-- getAll
-- ! endpoint: all
-- ! message: All articles from all users requested
    SELECT * FROM `articles`
    ORDER BY `id` DESC;

-- getAllById
-- ! endpoint: all/user
-- ! message: All articles from user requested
    SELECT * FROM `articles`
    WHERE `user_id` = ?
    ORDER BY `id` DESC;

-- getAllByName
    SELECT * FROM `articles`
    WHERE `name` = ?;

-- getId
    SELECT `id` FROM `articles`
    WHERE `user_id` = ? AND `name` = ?;

-- addNew
    INSERT INTO `articles` (`user_id`, `name`, `title`, `image`, `keywords`, `description`)
    VALUES (?, ? ,?, ?, ?, ?);

-- changeData
    UPDATE `articles`
    SET `name` = ?,
        `title` = ?,
        `image` = ?,
        `keywords` = ?,
        `description` = ?
    WHERE `id` = ?;

-- changePublishment
    UPDATE `articles`
    SET `is_publish` = ?
    WHERE `id` = ?;

-- remove
    DELETE FROM `articles`
    WHERE `id` = ?;
    