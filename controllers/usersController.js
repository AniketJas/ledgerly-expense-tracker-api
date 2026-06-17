import { sql } from '../configs/db.js';
import { v4 as uuidv4 } from 'uuid';

export const addUser = async (req, res) => {
  try {
    const { clerk_id, first_name, last_name, email } = req.body;

    const id = uuidv4();

    const user = await sql`
  SELECT * FROM users
  WHERE email = ${email};
`;

    if (user.length > 0) {
      await sql`
    UPDATE users
    SET
      clerk_id = ${clerk_id},
      first_name = ${first_name},
      last_name = ${last_name}
    WHERE email = ${email};
  `;
    } else {
      await sql`
    INSERT INTO users (
      id,
      clerk_id,
      first_name,
      last_name,
      email
    )
    VALUES (
      ${id},
      ${clerk_id},
      ${first_name},
      ${last_name},
      ${email}
    );
  `;
    }
    res.status(201).json({ message: 'User added successfully' });
  }
  catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}