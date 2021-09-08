const routes = require('./routes');
const PlaylistsongsHandler = require('./handler');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  // prettier-ignore
  register: async (server, { playlistsongsService, playlistsService, validator }) => {
    const playlistsongsHandler = new PlaylistsongsHandler(
      playlistsongsService,
      playlistsService,
      validator,
    );

    server.route(routes(playlistsongsHandler));
  },
};
