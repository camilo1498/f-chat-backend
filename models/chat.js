const db = require('../config/config');

const Chat = {};

Chat.findByIdUser = (id_user) => {
    const sql = `
    SELECT 
        C.id AS id,
        C.id_user1,
        C.id_user2,
        C.timestamp,
        U1.name AS name_user1,
        U1.lastname AS lastname_user1,
        U1.email AS email_user1,
        U1.image AS image_user1,
        U1.phone AS phone_user1,
        U1.notification_token AS notification_token_user1,
        U2.name AS name_user2,
        U2.lastname AS lastname_user2,
        U2.email AS email_user2,
        U2.image AS image_user2,
        U2.phone AS phone_user2,
        U2.notification_token AS notification_token_user2,
        (
			SELECT
				message
			FROM
				messages AS M
			WHERE
				M.id_chat = C.id
			ORDER BY
				M.timestamp DESC
			LIMIT 1
		) AS last_message,
        (
            SELECT
                COUNT(*)
            FROM
                messages AS M
            WHERE
                M.id_chat = C.id AND ((M.status = 'ENVIADO' OR M.status = 'RECIBIDO') AND M.id_receiver = $1)
        ) AS unread_message,
        (
			SELECT
				timestamp
			FROM
				messages AS M
			WHERE
				M.id_chat = C.id
			ORDER BY
				M.timestamp DESC
			LIMIT 1
		) AS last_message_timestamp
    FROM
        chats AS C
    INNER JOIN
        users AS U1
    ON
        U1.id = C.id_user1	
    INNER JOIN
        users AS U2
    ON
        U2.id = C.id_user2
    WHERE
        (id_user1 = $1 OR id_user2 = $1)
    AND
        (
            SELECT
                COUNT(*)
            FROM 
                messages AS M
            WHERE
                M.id_chat = C.id
        ) > 0
    ORDER BY
        last_message_timestamp DESC
    `;

    return db.manyOrNone(sql, id_user);
}

Chat.findByUser1AndUser2 = (id_user1, id_user2) => {
    const sql = `
        SELECT
            id,
            id_user1,
            id_user2,
            timestamp
        FROM
            chats
        WHERE
            (id_user1 = $1 AND id_user2 = $2)
        OR
            (id_user1 = $2 AND id_user2 = $1)
    `;

    return db.oneOrNone(sql, [
        id_user1,
        id_user2
    ]);
}

Chat.create = (chat) => {
    const sql = `
        INSERT INTO
            chats(
                id_user1,
                id_user2,
                timestamp,
                created_at,
                updated_at
            )
        VALUES($1, $2, $3, $4, $5) RETURNING id
    `;

    return db.oneOrNone(sql, [
        chat.id_user1,
        chat.id_user2,
        new Date().getTime(),
        new Date(),
        new Date()
    ]);
}

Chat.update = (chat) => {
    const sql = `
        UPDATE
            chats
        SET
            id = $1,
            id_user1 = $2,
            id_user2 = $3,
            timestamp = $4,
            updated_at = $5
        WHERE
            id = $1
    `;

    return db.oneOrNone(sql, [
        chat.id,
        chat.id_user1,
        chat.id_user2,
        new Date().getTime(),
        new Date(),
    ]);
}

module.exports = Chat;