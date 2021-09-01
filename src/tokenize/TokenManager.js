/**
 * Fungsi Token Manager
 * 1. Membuat atau men-generate acces token (generateAccessToken)
 * 2. Membuat atau men-generate refresh token (generateRefreshToken)
 * 3. Melakukan verifikasi refresh token (verifyRefreshToken)
 */
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  // Fungsi disini untuk mengecek apakah refreshToken memiliki signature yang sesuai
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
