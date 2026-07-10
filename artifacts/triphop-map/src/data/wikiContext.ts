// Trip-Hop historical context sourced from Wikipedia & music journalism
// https://en.wikipedia.org/wiki/Trip_hop

export interface WikiEvent {
  year: number;
  title: string;
  description: string;
  significance: 'foundational' | 'landmark' | 'expansion' | 'modern';
}

export interface WikiLabel {
  name: string;
  founded: number;
  location: string;
  founders: string[];
  description: string;
  keyArtists: string[];
}

export interface WikiAlbum {
  title: string;
  artist: string;
  year: number;
  label: string;
  description: string;
  significance: string;
}

export const GENRE_OVERVIEW = {
  name: 'Trip-Hop',
  alternateNames: ['Bristol sound', 'downtempo', 'abstract hip-hop'],
  origin: 'Bristol, England',
  period: '1991 – present',
  termOrigin: 'The term "trip-hop" was coined by music journalist Andy Pemberton in 1994 for Mixmag magazine, initially used to describe tracks on the Mo\' Wax label. The artists themselves largely rejected the label.',
  definition: 'Trip-hop is a musical genre that originated in Bristol, England in the early 1990s. It combines elements of hip-hop — breakbeat samples, sampling aesthetics, and urban sensibility — with a slower, more melancholic atmosphere drawn from soul, jazz, electronic music, and dub reggae.',
  characteristics: [
    'Slow to mid-tempo breakbeats (60–100 BPM)',
    'Heavy use of sampling (jazz, soul, film scores)',
    'Downbeat, introspective atmosphere',
    'Prominent bass lines and sub-bass frequencies',
    'Incorporation of live instrumentation alongside electronics',
    'Female or unconventional lead vocals',
    'Cinematic, film-score influences',
    'Dub reggae sonic space and echo techniques',
  ],
  geographicOrigins: {
    bristol: 'The Wild Bunch sound system collective (later fragmenting into Massive Attack, Tricky, and Portishead) pioneered the Bristol sound from the late 1980s.',
    london: 'Mo\' Wax Records (James Lavelle) and Ninja Tune (Coldcut) established London as the second major hub, bringing a more jazz-influenced, intellectual strain.',
    worldwide: 'By the late 1990s the sound had spread to France (DJ Cam, La Funk Mob), Japan (DJ Krush), Austria (Kruder & Dorfmeister), and the United States (DJ Shadow, Massive Attack).',
  },
};

export const WIKI_TIMELINE: WikiEvent[] = [
  {
    year: 1987,
    title: 'Wild Bunch Sound System Active',
    description: 'The Wild Bunch collective in Bristol — featuring 3D (Robert Del Naja), Daddy G (Grant Marshall), Mushroom (Andy Vowles), Tricky, Neneh Cherry, and Shara Nelson — is active as a sound system and DJ collective, laying the groundwork for the Bristol sound.',
    significance: 'foundational',
  },
  {
    year: 1991,
    title: 'Massive Attack — Blue Lines',
    description: 'Massive Attack release their debut album Blue Lines on Wild Bunch / Circa Records. Widely considered the first trip-hop album, it fuses hip-hop production with soul vocals (Shara Nelson, Tricky), dub bass, and sampled breaks.',
    significance: 'foundational',
  },
  {
    year: 1992,
    title: 'Mo\' Wax Label Founded',
    description: 'James Lavelle founds Mo\' Wax Records in London. The label would become a defining home for trip-hop and abstract hip-hop, releasing music by DJ Shadow, UNKLE, Attica Blues, and others.',
    significance: 'foundational',
  },
  {
    year: 1994,
    title: 'Portishead — Dummy & Tricky — Maxinquaye',
    description: 'Portishead release Dummy (Mercury Prize winner, 1.5 million UK copies sold) and Tricky releases Maxinquaye — two of the most acclaimed trip-hop albums. The term "trip-hop" is coined by journalist Andy Pemberton in Mixmag.',
    significance: 'landmark',
  },
  {
    year: 1994,
    title: 'Massive Attack — Protection',
    description: 'Massive Attack release their second album Protection, featuring Tracy Thorn, Nicolette, and Tricky. The No Protection dub remix by Mad Professor demonstrates the genre\'s deep roots in reggae sound-system culture.',
    significance: 'landmark',
  },
  {
    year: 1996,
    title: 'DJ Shadow — Endtroducing…..',
    description: 'DJ Shadow releases Endtroducing….., certified by Guinness World Records as the first album made entirely from samples. A landmark of sample-based music recorded in a Sacramento record shop basement.',
    significance: 'landmark',
  },
  {
    year: 1996,
    title: 'Sneaker Pimps — Becoming X',
    description: 'Sneaker Pimps release Becoming X, achieving mainstream crossover with singles "6 Underground" and "Spin Spin Sugar". Singer Kelli Ali gives the genre a new pop dimension.',
    significance: 'expansion',
  },
  {
    year: 1998,
    title: 'Massive Attack — Mezzanine',
    description: 'Mezzanine — Massive Attack\'s darkest and most guitar-heavy album — features "Teardrop" (vocal by Elizabeth Fraser of Cocteau Twins), which becomes one of the most recognisable trip-hop recordings. Reaches number 1 in the UK charts.',
    significance: 'landmark',
  },
  {
    year: 1998,
    title: 'UNKLE — Psyence Fiction',
    description: 'James Lavelle (UNKLE) releases Psyence Fiction on Mo\' Wax with production by DJ Shadow. Features Thom Yorke, Richard Ashcroft, and Kool G Rap. "Rabbit in Your Headlights" (dir. Jonathan Glazer) becomes one of the defining music videos of the era.',
    significance: 'landmark',
  },
  {
    year: 2000,
    title: 'Genre Expansion & Mainstream Crossover',
    description: 'Trip-hop influences spread into mainstream: Goldfrapp (Felt Mountain), Zero 7 (Simple Things), Röyksopp (Melody A.M.), Morcheeba. The sound is absorbed into post-Britpop, downtempo, and nu-jazz.',
    significance: 'expansion',
  },
  {
    year: 2007,
    title: 'Burial — Untrue',
    description: 'William Bevan (Burial) releases Untrue on Hyperdub, becoming one of the decade\'s most critically acclaimed albums. Its fractured UK garage / dubstep / trip-hop fusion extends the Bristol sound into the 21st century.',
    significance: 'expansion',
  },
  {
    year: 2010,
    title: 'Post-Dubstep & Neo-Soul Revival',
    description: 'Artists like James Blake, The xx, FKA Twigs, Mount Kimbie, and Sevdaliza extend trip-hop\'s emotional language into post-dubstep and contemporary R&B, demonstrating the genre\'s continuing influence.',
    significance: 'modern',
  },
  {
    year: 2016,
    title: 'Massive Attack — Ritual Spirit',
    description: 'Massive Attack return with the Ritual Spirit EP, featuring Young Fathers, Tricky, and Roots Manuva — demonstrating the original Bristol architects\' continued relevance and evolution.',
    significance: 'modern',
  },
];

export const WIKI_LABELS: WikiLabel[] = [
  {
    name: 'Wild Bunch Records',
    founded: 1987,
    location: 'Bristol, UK',
    founders: ['Massive Attack', 'Smith & Mighty'],
    description: 'The original Bristol collective and label. Preceded Circa Records as the home of the Wild Bunch sound system. The label folded in the early 1990s when members pursued solo careers.',
    keyArtists: ['Massive Attack', 'Tricky', 'Portishead', 'Neneh Cherry'],
  },
  {
    name: 'Mo\' Wax',
    founded: 1992,
    location: 'London, UK',
    founders: ['James Lavelle'],
    description: 'Founded by 17-year-old James Lavelle, Mo\' Wax defined the London strain of trip-hop with a more abstract, jazz-influenced, and hip-hop-literate aesthetic. Distributed by A&M Records from 1996.',
    keyArtists: ['DJ Shadow', 'UNKLE', 'Attica Blues', 'Psyence Fiction', 'La Funk Mob', 'Money Mark'],
  },
  {
    name: 'Ninja Tune',
    founded: 1990,
    location: 'London, UK',
    founders: ['Matt Black', 'Jon More (Coldcut)'],
    description: 'Founded by Coldcut as an independent alternative to major labels. Became the home of intelligent electronic music, broken beat, and jazz-influenced trip-hop. Still active.',
    keyArtists: ['DJ Food', 'Funki Porcini', 'Coldcut', 'Amon Tobin', 'Mr. Scruff', 'Roots Manuva'],
  },
  {
    name: 'Howlin\' Records / Go! Beat',
    founded: 1993,
    location: 'Bristol, UK',
    founders: ['Geoff Travis', 'Jeannette Lee'],
    description: 'Go! Beat (part of PolyGram) was the home of Portishead\'s Dummy and Beth Orton\'s early work, giving the Bristol sound mainstream distribution.',
    keyArtists: ['Portishead', 'Beth Orton', 'Urban Species'],
  },
  {
    name: '4th & Broadway / Island Records',
    founded: 1983,
    location: 'London, UK',
    founders: ['Chris Blackwell'],
    description: 'Island Records was home to Tricky\'s Maxinquaye and provided major-label distribution for the most commercially successful trip-hop releases.',
    keyArtists: ['Tricky', 'Massive Attack', 'U.N.K.L.E'],
  },
  {
    name: 'Stones Throw Records',
    founded: 1996,
    location: 'Los Angeles, USA',
    founders: ['Peanut Butter Wolf'],
    description: 'US independent label bridging underground hip-hop and the aesthetic sensibilities of trip-hop. Home of MF Doom, Madlib, and J Dilla.',
    keyArtists: ['Madlib', 'MF Doom', 'J Dilla', 'Koushik', 'Sa-Ra Creative Partners'],
  },
  {
    name: 'Hyperdub',
    founded: 2004,
    location: 'London, UK',
    founders: ['Steve Goodman (Kode9)'],
    description: 'London label that extended trip-hop\'s atmospheric and bass-heavy tendencies into the dubstep and post-dubstep era. Home of Burial, whose Untrue is considered the genre\'s 21st century masterpiece.',
    keyArtists: ['Burial', 'Kode9', 'Ikonika', 'Jessy Lanza'],
  },
];

export const WIKI_ESSENTIAL_ALBUMS: WikiAlbum[] = [
  {
    title: 'Blue Lines',
    artist: 'Massive Attack',
    year: 1991,
    label: 'Wild Bunch / Circa',
    description: 'The album that defined the genre. Fusing hip-hop production with soul vocals, dub bass, and cinematic sampling, Blue Lines established the blueprint that all subsequent trip-hop would follow.',
    significance: 'First trip-hop album; blueprint of the genre',
  },
  {
    title: 'Dummy',
    artist: 'Portishead',
    year: 1994,
    label: 'Go! Beat',
    description: 'Mercury Prize winner. Built around Beth Gibbons\'s desperate vocal performances and Geoff Barrow\'s scratched samples of spy-film soundtracks, Dummy became the best-selling trip-hop album of the decade.',
    significance: 'Mercury Prize 1995; best-selling trip-hop record',
  },
  {
    title: 'Maxinquaye',
    artist: 'Tricky',
    year: 1995,
    label: 'Island',
    description: 'Named after Tricky\'s deceased mother Maxine Quaye. Claustrophobic, intimate, and paranoid, Maxinquaye is the darkest realisation of the Bristol sound, with Martina Topley-Bird providing the album\'s haunting counterpoint.',
    significance: 'Mercury Prize nomination; defining document of post-industrial Bristol',
  },
  {
    title: 'Protection',
    artist: 'Massive Attack',
    year: 1994,
    label: 'Circa / Virgin',
    description: 'Softer and more soulful than Blue Lines, Protection featured collaborations with Tracy Thorn, Nicolette, and Tricky. The Mad Professor remix (No Protection) remains the genre\'s defining dub treatment.',
    significance: 'Demonstrates dub reggae roots of trip-hop',
  },
  {
    title: 'Endtroducing…..',
    artist: 'DJ Shadow',
    year: 1996,
    label: 'Mo\' Wax',
    description: 'Guinness World Records: first album made entirely from samples. Recorded in a Sacramento record store, Endtroducing is a monument of sample culture — cinematic, melancholic, and rhythmically complex.',
    significance: 'First all-sample album (Guinness record); canonical instrumental trip-hop',
  },
  {
    title: 'Mezzanine',
    artist: 'Massive Attack',
    year: 1998,
    label: 'Virgin',
    description: 'Massive Attack\'s darkest and most rock-influenced album. Featuring Elizabeth Fraser\'s vocal on "Teardrop" and deep collaborations with Horace Andy, Mezzanine entered the UK charts at number 1.',
    significance: 'UK #1; "Teardrop" becomes the genre\'s signature track',
  },
  {
    title: 'Psyence Fiction',
    artist: 'UNKLE',
    year: 1998,
    label: 'Mo\' Wax',
    description: 'Mo\' Wax\'s most ambitious release. Co-produced by DJ Shadow, featuring Thom Yorke, Richard Ashcroft, and Kool G Rap. "Rabbit in Your Headlights" with its Jonathan Glazer video is one of the era\'s defining cultural objects.',
    significance: 'Cinematic trip-hop meets rock and hip-hop crossover',
  },
  {
    title: 'Untrue',
    artist: 'Burial',
    year: 2007,
    label: 'Hyperdub',
    description: 'Burial\'s anonymous second album created from processed UK garage, dubstep, and trip-hop fragments. Untrue extended the Bristol sound\'s emotional grammar into a new digital age.',
    significance: 'NME Album of the Year 2007; trip-hop\'s 21st-century masterpiece',
  },
];

export const WIKI_KEY_ARTISTS = {
  bristol: ['Massive Attack', 'Portishead', 'Tricky', 'Martina Topley-Bird', 'Smith & Mighty', 'Roni Size', 'Portishead'],
  london: ['Howie B', 'Sneaker Pimps', 'Lamb', 'Faithless', 'Zero 7', 'Morcheeba'],
  moWax: ['DJ Shadow', 'UNKLE', 'Attica Blues', 'La Funk Mob'],
  ninjaTune: ['DJ Food', 'Funki Porcini', 'Amon Tobin', 'Coldcut', 'Mr. Scruff'],
  international: ['DJ Krush (Tokyo)', 'DJ Cam (Paris)', 'Kruder & Dorfmeister (Vienna)', 'Röyksopp (Bergen)', 'Massive Attack (Bristol → Global)'],
  contemporary: ['Burial', 'James Blake', 'FKA Twigs', 'The xx', 'Sevdaliza', 'Kelela'],
};
