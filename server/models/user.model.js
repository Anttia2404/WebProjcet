import db from "../config/db.js"

export const createUser = async (email, hashedPassword) => {
    try {
        const query = `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email, created_at
        `;

        const params = [email, hashedPassword];
        const result = await db.query(query, params);

        return result.rows[0];
    } catch(err) {
        console.log("Loi khi them sinh vien", err);
        throw err;
    }
}

export const findUserByEmail = async (email) => {
    try {
        const query = `
            SELECT * FROM users WHERE email = $1;
        `;
        const result = await db.query(query, [email]);
        
        return result.rows[0]; 
        
    } catch (err) {
        console.error("Loi khi tim user: ", err);
        throw err;
    }
};