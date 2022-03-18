const db = require('../config/config');

const Message = {};

Message.findByChat = (id_chat) => {

    const sql = `
        SELECT
            id,
            message,
            id_sender,
            id_receiver,
            id_chat,
            timestamp,
            status,
            is_image,
            is_video,
            url
        FROM
            messages
        WHERE
            id_chat = $1
        ORDER BY
            timestamp DESC

    `;

    return db.manyOrNone(sql, id_chat);
}

Message.create = (message) => {
    const sql = `
        INSERT INTO
            messages(
                message,
                id_sender,
                id_receiver,
                id_chat,
                status,
                url,
                is_image,
                is_video,
                timestamp,
                created_at,
                updated_at
            )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `;

    return db.oneOrNone(sql, [
        message.message,
        message.id_sender,
        message.id_receiver,
        message.id_chat,
        'ENVIADO',
        message.url,
        message.is_image,
        message.is_video,
        new Date().getTime(),
        new Date(),
        new Date()
    ]);
}

Message.updateToSeen = (id) => {
    const sql = `
    UPDATE
        messages
    SET
        status = 'VISTO',
        updated_at = $2
    WHERE
        id = $1
    `;
    return db.none(sql, [
        id,
        new Date()
    ]);
}

module.exports = Message;