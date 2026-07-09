export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year: number;
  youtubeId?: string;
  mood: string[];
  note?: string;
}

export interface CuratedPlaylist {
  id: string;
  name: string;
  description: string;
  label: string;
  tracks: PlaylistTrack[];
}

export const CURATED_PLAYLISTS: CuratedPlaylist[] = [
  {
    id: 'essential-bristol',
    name: 'ESSENTIAL BRISTOL',
    description: 'The foundational records of the Bristol sound. The original documents of a genre born in post-industrial rain.',
    label: 'ORIGIN DOCUMENT',
    tracks: [
      { id: 'eb-1', title: 'Unfinished Sympathy', artist: 'Massive Attack', album: 'Blue Lines', year: 1991, youtubeId: 'KBydBPBv4Ys', mood: ['cinematic', 'dark'], note: 'The first great trip-hop record. Orchestra against breakbeats. Shara Nelson.' },
      { id: 'eb-2', title: 'Glory Box', artist: 'Portishead', album: 'Dummy', year: 1994, youtubeId: 'WBqcZOkFWnQ', mood: ['melancholic', 'dark'], note: 'Beth Gibbons at her most raw. The Isaac Hayes sample transformed beyond recognition.' },
      { id: 'eb-3', title: 'Overcome', artist: 'Tricky', album: 'Maxinquaye', year: 1995, youtubeId: 'FGJvCRMwNt8', mood: ['dark', 'smoky'], note: 'The quintessential Tricky track. Intimacy as claustrophobia.' },
      { id: 'eb-4', title: 'Safe from Harm', artist: 'Massive Attack', album: 'Blue Lines', year: 1991, youtubeId: 'MbCzMVHsR3c', mood: ['dark', 'urban'], note: 'Where trip-hop begins. The bassline is a history.' },
      { id: 'eb-5', title: 'Sour Times', artist: 'Portishead', album: 'Dummy', year: 1994, youtubeId: 'RlJGOl6_kH4', mood: ['melancholic', 'cinematic'], note: '"Nobody loves me, it\'s true." Lalo Schifrin spy theme over downbeat hip-hop.' },
      { id: 'eb-6', title: 'Teardrop', artist: 'Massive Attack', album: 'Mezzanine', year: 1998, youtubeId: 'u7K72X4eo_s', mood: ['cinematic', 'melancholic'], note: 'Elizabeth Fraser vocal. The most beautiful record Massive Attack ever made.' },
      { id: 'eb-7', title: 'Black Steel', artist: 'Tricky', album: 'Maxinquaye', year: 1995, youtubeId: 'OFIpxzJe2GQ', mood: ['dark', 'urban'], note: 'Public Enemy cover transformed into something deeply interior.' },
      { id: 'eb-8', title: '5 Is a Magic Number', artist: 'Massive Attack', album: 'Protection', year: 1994, youtubeId: 'NLRIuJtL8SI', mood: ['urban', 'smoky'], note: 'Nicolette vocal. Late-night club music for people who don\'t go to clubs.' },
    ],
  },
  {
    id: 'late-night-melancholy',
    name: 'LATE NIGHT MELANCHOLY',
    description: 'Slow. Dark. 3am. Rain on the window. For when language has run out.',
    label: 'NIGHT SESSION',
    tracks: [
      { id: 'lnm-1', title: 'Roads', artist: 'Portishead', album: 'Dummy', year: 1994, youtubeId: 'mFgPGaBJKpk', mood: ['melancholic', 'dark'], note: 'The most devastating three minutes in the genre.' },
      { id: 'lnm-2', title: 'Midnight in a Perfect World', artist: 'DJ Shadow', album: 'Endtroducing…..', year: 1996, youtubeId: 'oBBQ-rMCjQ4', mood: ['melancholic', 'cinematic'], note: 'Six minutes of nocturnal beauty. Unidentified vocal.' },
      { id: 'lnm-3', title: 'Wandering Star', artist: 'Portishead', album: 'Dummy', year: 1994, youtubeId: 'aFOFCQiH4AQ', mood: ['dark', 'melancholic'], note: 'The slowest, heaviest Portishead track. "Please could you stay awhile to share my grief?"' },
      { id: 'lnm-4', title: 'Inner City Life', artist: 'Goldie', album: 'Timeless', year: 1995, youtubeId: 'tNGrg5Wm_PE', mood: ['dark', 'urban'], note: 'Diane Charlemagne vocal. Jungle meeting trip-hop. Future bass.' },
      { id: 'lnm-5', title: 'Remind Me', artist: 'Röyksopp', album: 'Melody A.M.', year: 2001, youtubeId: 'gz5qF4PZhFM', mood: ['melancholic', 'cinematic'], note: 'Northern light in a minor key. What Sunday mornings sound like.' },
      { id: 'lnm-6', title: 'Nothing', artist: 'Zero 7 ft. Sia', album: 'Simple Things', year: 2001, youtubeId: 'RXkzSqxV8Pw', mood: ['melancholic', 'smoky'], note: 'Sia before global fame. The arrangement is impossibly beautiful.' },
      { id: 'lnm-7', title: 'Shrine', artist: 'Burial', album: 'Untrue', year: 2007, youtubeId: '5WUhQOjQD-o', mood: ['dark', 'melancholic'], note: 'Eleven minutes. Rain on windows. An unidentified voice. Devastating.' },
      { id: 'lnm-8', title: 'Waterloo Sunset', artist: 'Tricky', album: 'Blowback', year: 2001, youtubeId: 'LdmZ_jmE0Dw', mood: ['melancholic', 'smoky'], note: 'Kinks cover. Bristol melancholy meets London nostalgia.' },
      { id: 'lnm-9', title: 'Lovely Head', artist: 'Goldfrapp', album: 'Felt Mountain', year: 2000, youtubeId: 'WR3aQDEW2NY', mood: ['dark', 'cinematic'], note: 'Alison Goldfrapp at her most unsettling. Cold as winter glass.' },
    ],
  },
  {
    id: 'cinematic-trip-hop',
    name: 'CINEMATIC TRIP-HOP',
    description: 'Music for imaginary films. Orchestral. Tense. Beautiful. The genre at its most ambitious and large-scale.',
    label: 'WIDE SCREEN',
    tracks: [
      { id: 'cth-1', title: 'Rabbit in Your Headlights', artist: 'UNKLE ft. Thom Yorke', album: 'Psyence Fiction', year: 1998, youtubeId: 'FJt5-xexEHM', mood: ['cinematic', 'dark'], note: 'DJ Shadow production. Thom Yorke vocal. Jonathan Glazer video. An event.' },
      { id: 'cth-2', title: 'Weather Storm', artist: 'Massive Attack', album: 'No Protection', year: 1994, youtubeId: 'GcgSfBzq9GE', mood: ['cinematic', 'dark'], note: 'Instrumental. The rain-soaked atmospherics of Bristol made orchestral.' },
      { id: 'cth-3', title: 'Lovely Head', artist: 'Goldfrapp', album: 'Felt Mountain', year: 2000, youtubeId: 'WR3aQDEW2NY', mood: ['cinematic', 'dark'], note: 'Ennio Morricone meets trip-hop. An imaginary spy film.' },
      { id: 'cth-4', title: 'Les Nuits', artist: 'Nightmares on Wax', album: 'Carboot Soul', year: 2002, youtubeId: 'TFzBxJb9Vb0', mood: ['cinematic', 'smoky'], note: 'Jazz-hop at its most accomplished. Like stepping into a film you haven\'t seen.' },
      { id: 'cth-5', title: 'Breathe', artist: 'Télépopmusik', album: 'Genetic World', year: 2001, youtubeId: 'vyut3GyHtn0', mood: ['cinematic', 'melancholic'], note: 'The most commercially successful trip-hop production. Deservedly.' },
      { id: 'cth-6', title: 'All is Full of Love', artist: 'Björk', album: 'Homogenic', year: 1997, youtubeId: 'AjI2J2SQ528', mood: ['cinematic', 'melancholic'], note: 'Directed by Chris Cunningham. Music and video inseparable.' },
      { id: 'cth-7', title: 'Stem/Long Stem', artist: 'DJ Shadow', album: 'Endtroducing…..', year: 1996, youtubeId: 'iqnBxeT2DZk', mood: ['cinematic', 'dark'], note: 'The centrepiece of a masterpiece. Seven minutes of impossible sample architecture.' },
      { id: 'cth-8', title: 'The Other Side', artist: 'Massive Attack ft. Damon Albarn', album: '100th Window', year: 2003, youtubeId: 'bz8W8xJKb6Y', mood: ['cinematic', 'dark'], note: 'Album-length immersion. Albarn vocal entirely against type and perfect.' },
    ],
  },
  {
    id: 'deep-underground',
    name: 'DEEP UNDERGROUND',
    description: 'Records you weren\'t supposed to find. Limited pressings. White labels. The true underground.',
    label: 'RESTRICTED ACCESS',
    tracks: [
      { id: 'du-1', title: 'Aftermath', artist: 'Tricky', album: 'Maxinquaye', year: 1995, youtubeId: '3Lj7DjjBsJg', mood: ['dark', 'melancholic'], note: 'Tricky at the limit of articulation. Paranoid whisper.' },
      { id: 'du-2', title: 'Silent Treatment', artist: 'Portishead', album: 'Portishead', year: 1997, youtubeId: 'S2JbSScbKOE', mood: ['dark', 'melancholic'], note: 'From their most experimental album. Almost unbearably tense.' },
      { id: 'du-3', title: 'Daydreaming', artist: 'Massive Attack', album: 'Mezzanine', year: 1998, youtubeId: 'w7y0UJnXFT0', mood: ['dark', 'cinematic'], note: 'Horace Andy vocal. The album\'s most oppressive atmosphere.' },
      { id: 'du-4', title: 'Passenger', artist: 'Tricky ft. Martina Topley-Bird', album: 'Pre-Millennium Tension', year: 1997, youtubeId: 'FGJvCRMwNt8', mood: ['dark', 'melancholic'], note: 'Slow, heavy, almost unbearable in its intimacy.' },
      { id: 'du-5', title: 'Casimir\'s Dead', artist: 'Sneaker Pimps', album: 'Becoming X', year: 1996, youtubeId: '2dHR7J8lXig', mood: ['dark', 'urban'], note: 'Kelli Ali vocal. The album track nobody talks about but should.' },
      { id: 'du-6', title: 'Witness', artist: 'Lamb', album: 'Fear of Fours', year: 1999, youtubeId: 'E_ZEsC1mFWM', mood: ['dark', 'cinematic'], note: 'Fear of Fours at its most rhythmically complex. Lou Rhodes vocal at its most vulnerable.' },
      { id: 'du-7', title: 'Antique Suede', artist: 'Tricky', album: 'Maxinquaye', year: 1995, youtubeId: 'FGJvCRMwNt8', mood: ['dark', 'smoky'], note: 'The buried gem of Maxinquaye. No sample clearance, limited availability.' },
      { id: 'du-8', title: 'NYC Black Nouveau', artist: 'Howie B', album: 'Music for Babies', year: 1996, youtubeId: 'z0VY1Kzmpbw', mood: ['jazzy', 'smoky'], note: 'The Massive Attack associate\'s overlooked masterwork. Late night New York distilled.' },
    ],
  },
  {
    id: 'modern-descendants',
    name: 'MODERN DESCENDANTS',
    description: 'The artists carrying the tradition into the present. Trip-hop\'s DNA in 21st century vessels.',
    label: 'CURRENT TRANSMISSION',
    tracks: [
      { id: 'md-1', title: 'Two Weeks', artist: 'FKA Twigs', album: 'LP1', year: 2014, youtubeId: 'LFasFq4GJYM', mood: ['dark', 'urban'], note: 'The vocal is astonishing. Production from production trio Tic Tac Tokyo.' },
      { id: 'md-2', title: 'Retrograde', artist: 'James Blake', album: 'Overgrown', year: 2013, youtubeId: 'iMHMBiVBWRA', mood: ['melancholic', 'dark'], note: 'Post-dubstep soul. Mercury Prize winner. The trip-hop lineage is explicit.' },
      { id: 'md-3', title: 'Crystalised', artist: 'The xx', album: 'xx', year: 2009, youtubeId: 'MNKhl7NehVc', mood: ['melancholic', 'dark'], note: 'Debut single. The xx invented a language for intimate sadness. Portishead listened.' },
      { id: 'md-4', title: 'Rough Sleeper', artist: 'King Krule', album: 'The OOZ', year: 2017, youtubeId: 'YUzofGi4kTY', mood: ['dark', 'urban'], note: 'South London anxiety in a Tricky mould. One of the most important British albums in years.' },
      { id: 'md-5', title: 'Maybes', artist: 'Mount Kimbie', album: 'Crooks & Lovers', year: 2010, youtubeId: 'zQA_AuWqQyQ', mood: ['dark', 'urban'], note: 'Post-dubstep at its most emotionally direct. A kind of triumph.' },
      { id: 'md-6', title: 'Space is Only Noise If You Can See', artist: 'Nicolas Jaar', album: 'Space Is Only Noise', year: 2011, youtubeId: 'Lz0c94MlPNQ', mood: ['cinematic', 'melancholic'], note: 'Made at 20. The dub-minimal synthesis that trip-hop pointed toward.' },
      { id: 'md-7', title: 'Nothing\'s Gonna Hurt You Baby', artist: 'Cigarettes After Sex', album: 'Cigarettes After Sex', year: 2017, youtubeId: '7k1e-L_kHnI', mood: ['melancholic', 'smoky'], note: 'Ambient pop so slow it becomes meditative. Portishead for a new generation.' },
      { id: 'md-8', title: 'Shades of Blue', artist: 'Floating Points', album: 'Shadows', year: 2019, youtubeId: '5WUhQOjQD-o', mood: ['jazzy', 'cinematic'], note: 'Sam Shepherd\'s synthesis of jazz, electronic music, and trip-hop is the genre\'s future.' },
    ],
  },
];
