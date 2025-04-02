import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.execute('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {name, username, password, email} = user;
  const sql = `INSERT INTO wsk_users (name, username, password, email)
               VALUES (?, ?, ?, ?)`;
  const params = [name, username, password, email];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {user_id: rows[0].insertId};
};

const modifyUser = async (user, id, ownerId, role) => {
  let sql;
  if (user.role && user.role === 'admin' && role !== 'admin') {
    return {message: 'Unauthorized to change role to admin'};
  }
  if (role === 'admin') {
    sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [
      user,
      id,
    ]);
  } else {
    sql = promisePool.format(
      `UPDATE wsk_users SET ? WHERE user_id = ? AND user_id = ?`,
      [user, id, ownerId]
    );
  }
  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const deleteUser = async (id, role) => {
  if (role !== 'admin') {
    return {message: 'Unauthorized'};
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return {message: 'User not found'};
    }

    await connection.commit();
    return {message: 'success'};
  } catch (error) {
    await connection.rollback();
    console.error('Transaction rolled back due to error:', error);
    return {message: 'Transaction failed'};
  } finally {
    connection.release();
  }
};

const login = async (user) => {
  const sql = `SELECT * FROM wsk_users WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [user]);
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const updateUserRole = async (id, newRole, role) => {
  if (role !== 'admin') {
    return {message: 'Unauthorized'};
  }

  const sql = `UPDATE wsk_users SET role = ? WHERE user_id = ?`;
  const [rows] = await promisePool.execute(sql, [newRole, id]);
  console.log('rows', rows);

  if (rows.affectedRows === 0) {
    return {message: 'User not found or role not updated'};
  }

  return {message: 'Role updated successfully'};
};

export {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  deleteUser,
  login,
  updateUserRole,
};
