const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.getAll = (id) => {
    const sql = `
    SELECT
        id,
        email,
        name,
        lastname,
        phone,
        image,
        session_token,
        notification_token
    FROM
        users
    WHERE
        id != $1
    `;

    return db.manyOrNone(sql, id);
}

User.findById = (id, callback) => {

    const sql = `
    SELECT
        id,
        email,
        name,
        lastname,
        image,
        phone,
        password,
        session_token
    FROM
        users
    WHERE
        id = $1`;
    
    return db.oneOrNone(sql, id).then(user => { callback(null, user); })

}

User.findByEmail = (email) => {
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token
    FROM 
        users AS U
    WHERE
        U.email = $1
    GROUP BY
        U.id
    `;

    return db.oneOrNone(sql, email);
}


User.create = async (user) => {

    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        hash,
        new Date(),
        new Date()
    ]);
}

User.checkIfIsOnline = (id_user) => {
    const sql = `
        SELECT
            online,
            id_socket
        FROM 
            users
        WHERE 
            id = $1
    `;

    return db.oneOrNone(sql, id_user);
}

User.update = (user) => {
    const sql = `
        UPDATE
            users
        SET
            name = $2,
            lastname = $3,
            phone = $4,
            image = $5,
            updated_at = $6
        WHERE
            id = $1
    `;

    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateNotificationToken = (id_user, token) => {
    const sql = `
        UPDATE
            users
        SET
            notification_token = $2
        WHERE
            id = $1
    `;

    return db.none(sql, [
        id_user,
        token
    ]);
}

User.updateOnlineByUser = (id_user, online) => {
    const sql = `
        UPDATE
            users
        SET
            online = $2
        WHERE
            id = $1
    `;

    return db.none(sql, [
        id_user,
        online
    ]);
}

User.updateOnlineBySocket = (id_socket, online) => {
    const sql = `
        UPDATE
            users
        SET
            online = $2
        WHERE
            id_socket = $1
    `;

    return db.none(sql, [
        id_socket,
        online
    ]);
}


User.updateIdSocket = (id_user, id_socket) => {
    const sql = `
        UPDATE
            users
        SET
            id_socket = $2
        WHERE
            id = $1
    `;

    return db.none(sql, [
        id_user,
        id_socket
    ]);
}

module.exports = User;