class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    // validasi payload yg dikirim ketika user login
    this._validator.validatePostAuthenticationPayload(request.payload);
    // dapatkan nilai username dan password dari payload
    const { username, password } = request.payload;
    // tampung nilai pada variabel id dari fungsi verifyUserCredential yg mengembalikan id dari user
    const id = await this._usersService.verifyUserCredential(username, password);
    // membuat access token dan refresh token
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });
    // simpan refreshToken ke dalam db
    await this._authenticationsService.addRefreshToken(refreshToken);
    // kembalikan req dgn respons yg membawa accessToken dan refreshToken di data body
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    // dapatkan nilai refreshToken setelah divalidasi
    const { refreshToken } = request.payload;
    // verifikasi refreshToken pada db
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // verifikasi signature refreshToken
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    // membuat accessToken baru dan melampirkannya sbg data di body respons
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);
    // dapatkan nilai refreshToken setelah divalidasi
    const { refreshToken } = request.payload;
    // verifikasi refreshToken pada db
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    // hapus refreshToken dari db setelah diverifikasi
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    // kembalikan respons
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
