exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /**
   * Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id.
   * Guna menghindari duplikasi data antara nilai keduanya.
   */
  // prettier-ignore
  pgm.addConstraint(
    'playlistsongs',
    'unique_playlist_id_and_song_id',
    'UNIQUE(playlist_id, song_id)',
  );

  // Memberikan constraint foreign key pd kolom playlist_id & song_id thd playlists.id & songs.id
  // prettier-ignore
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.playlist_id_playlist.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  // prettier-ignore
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
