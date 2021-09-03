const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // TODO 1: Verifikasi username, pastikan belum terdaftar
    await this.verifyNewUsername(username);
    // TODO 2: Bila verifikasi lolos, masukkan ke dalam db
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    // cek nilai result
    // bila tidak ada nilai yg dikembalikan, bangkitkan error
    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    // ambil data username dari tabel users
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    // jika result.rows.length > 0, bangkitkan error
    // karena itu berarti username sudah digunakan
    if (result.rowCount) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    // komparasi nilai hashedPassword dengan password yg ada di parameter
    // gunakan bcrypt untuk komparasi nilai hashedPassword
    const matchPassword = await bcrypt.compare(password, hashedPassword);
    if (!matchPassword) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id; // nilai user id akan digunakan untuk membuat token
  }
}

module.exports = UsersService;
