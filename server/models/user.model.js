import db from "../config/db.js";

export const createUser = async (email, hashedPassword, fullName) => {
  try {
    const query = `
            INSERT INTO users (email, password_hash, full_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, created_at, full_name
        `;

    const params = [email, hashedPassword, fullName];
    const result = await db.query(query, params);

    return result.rows[0];
  } catch (err) {
    console.log("Loi khi them sinh vien", err);
    throw err;
  }
};

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

export const findOrCreateUser = async ({
  googleId,
  facebookId,
  email,
  fullName,
}) => {
  try {
    const findByIdQuery = `SELECT * FROM users WHERE ${
      googleId ? "google_id = $1" : "facebook_id = $1"
    };`;
    const findByIdParams = [googleId || facebookId];

    let result = await db.query(findByIdQuery, findByIdParams);

    if (result.rows[0]) {
      return result.rows[0];
    }
    if (email) {
      const findByEmailQuery = `SELECT * FROM users WHERE email = $1;`;
      const findByEmailParams = [email];
      result = await db.query(findByEmailQuery, findByEmailParams);

      if (result.rows[0]) {
        const existingUser = result.rows[0];
        const updateQuery = `
                    UPDATE users
                    SET ${googleId ? "google_id = $1" : "facebook_id = $1"}
                    WHERE id = $2
                    RETURNING *;
                `;
        const updateParams = [googleId || facebookId, existingUser.id];
        result = await db.query(updateQuery, updateParams);

        return result.rows[0];
      }
    }
    const createQuery = `
            INSERT INTO users (google_id, facebook_id, email, full_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
    const createParams = [
      googleId || null,
      facebookId || null,
      email,
      fullName || null,
    ];
    result = await db.query(createQuery, createParams);

    return result.rows[0];
  } catch (err) {
    console.error("Error in findOrCreateUser model:", err);
    throw err;
  }
};

export const findUserById = async (id) => {
  try {
    const query = `SELECT * FROM users WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error when finding user by id:", err);
    throw err;
  }
};
