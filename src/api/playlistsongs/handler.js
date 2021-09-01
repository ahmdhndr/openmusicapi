class PlaylistsongsHandler {
  constructor(playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, songId } = request.payload;

    // TODO
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsongsService.addSongToPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    console.log(songId);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.payload;

    // await this._songsService.getSongs();
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlists = await this._playlistsongsService.getAllSongFromPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, songId } = request.payload;

    // TODO
    // await this._songsService.verifySongId(songId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsongsService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsongsHandler;
