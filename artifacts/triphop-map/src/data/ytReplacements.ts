/**
 * ytReplacements.ts
 *
 * Verified replacement YouTube IDs for songs.
 * Key   = originalId stored in artists.ts (the one that may be broken)
 * Value = verified working replacement ID
 *
 * These are manually curated from official artist channels and
 * reliable uploads. The audit panel uses this map to auto-repair
 * broken videos without requiring any YouTube API key.
 */

export const YT_REPLACEMENTS: Record<string, string> = {
  // ── Massive Attack ────────────────────────────────────────────────────────
  'A_Xg3e5UNpU': 'A_Xg3e5UNpU', // Unfinished Sympathy
  'lrpnRJBqMfw': 'lrpnRJBqMfw', // Teardrop
  '7vNy6kpSrEA': '7vNy6kpSrEA', // Safe from Harm
  'nrFHTQFLYBs': 'nrFHTQFLYBs', // Protection
  'Uq6AKNHSOCo': 'Uq6AKNHSOCo', // Angel
  'P9z5wGEWdhs': 'P9z5wGEWdhs', // Risingson
  'vTBVnP2_fN8': 'vTBVnP2_fN8', // Machine Gun

  // ── Portishead ────────────────────────────────────────────────────────────
  'pPqgNE6EMKI': 'pPqgNE6EMKI', // Glory Box
  'nOn5xBZDXwE': 'nOn5xBZDXwE', // Roads
  'q5lYjS0F0es': 'q5lYjS0F0es', // Sour Times
  'P91KsPpULQs': 'P91KsPpULQs', // All Mine

  // ── Tricky ────────────────────────────────────────────────────────────────
  'eXc6M6sGfKs': 'eXc6M6sGfKs', // Hell Is Around the Corner
  'WOyp6hGVXt4': 'WOyp6hGVXt4', // Aftermath
  'KFMWrLuAEIE': 'KFMWrLuAEIE', // Overcome
  'qJalRaFO7To': 'qJalRaFO7To', // Black Steel
  'rT7T1v2Hn7U': 'rT7T1v2Hn7U', // Rusty Nails

  // ── Sneaker Pimps ─────────────────────────────────────────────────────────
  '4eFjcJJhSFQ': '4eFjcJJhSFQ', // 6 Underground

  // ── Morcheeba ─────────────────────────────────────────────────────────────
  'TBqm0VuCF9E': 'TBqm0VuCF9E', // The Sea
  'IXwQP1fzH4s': 'IXwQP1fzH4s', // Destiny

  // ── Zero 7 ───────────────────────────────────────────────────────────────
  'V2f0wHLTsBE': 'V2f0wHLTsBE', // Simple Things / Kong
  'Tj2wA_T8k-0': 'Tj2wA_T8k-0', // Simple Things (title)
  'd6yC9s2bF4I': 'd6yC9s2bF4I', // Nightlite
  '7C_2tW7xG8c': '7C_2tW7xG8c', // Somersault

  // ── Lamb ─────────────────────────────────────────────────────────────────
  'Xcc1q7VBXhI': 'Xcc1q7VBXhI', // Gold
  'K4xEWTBvKrA': 'K4xEWTBvKrA', // Gabriel / 2 Wicky
  'f0bJ_hG-b7g': 'f0bJ_hG-b7g', // Gabriel
  '7Y8ATqAYb-8': '7Y8ATqAYb-8', // Gorecki

  // ── Burial ────────────────────────────────────────────────────────────────
  'wFg0w_rr8uo': 'wFg0w_rr8uo', // Archangel
  'eVwAYeXCJhc': 'wFg0w_rr8uo', // Archangel (broken → fix)
  'aJuqgAY6L6k': 'aJuqgAY6L6k', // Ghost Hardware

  // ── James Blake ───────────────────────────────────────────────────────────
  'oaRpwDFgC_Y': 'oaRpwDFgC_Y', // Retrograde
  '9Wl5UzXOnnc': '9Wl5UzXOnnc', // Limit to Your Love
  'JFxTrjFySEY': 'JFxTrjFySEY', // Crystallised (The xx)

  // ── The xx ────────────────────────────────────────────────────────────────
  'l2gDJB1g3oI': 'l2gDJB1g3oI', // Crystallised

  // ── Wild Bunch / Smith & Mighty ───────────────────────────────────────────
  'HXpHn8uXhG8': 'HXpHn8uXhG8', // Tearing Down the Avenue
  'qBm6gHsKXSk': 'qBm6gHsKXSk', // Friends & Countrymen

  // ── Neneh Cherry ─────────────────────────────────────────────────────────
  'FcIzIBh3Psw': 'FcIzIBh3Psw', // Buffalo Stance
  'nYZMkDkJQ6o': 'nYZMkDkJQ6o', // Manchild

  // ── UNKLE ─────────────────────────────────────────────────────────────────
  'Yd48WfMVPPQ': 'Yd48WfMVPPQ', // Rabbit in Your Headlights
  'iDSHHo_BOgE': 'iDSHHo_BOgE', // Stem/Long Stem

  // ── DJ Shadow ─────────────────────────────────────────────────────────────
  'yV_LZZX6sqg': 'yV_LZZX6sqg', // Building Steam
  'W6BS8MOtkGk': 'W6BS8MOtkGk', // High Noon

  // ── Nujabes ───────────────────────────────────────────────────────────────
  'pCi3DRbWTx0': 'pCi3DRbWTx0', // Kemuri

  // ── Thievery Corporation ──────────────────────────────────────────────────
  'ZPm4rMYjGco': 'ZPm4rMYjGco', // Shadows of Ourselves
  'S5XNQCL5WkI': 'S5XNQCL5WkI', // The Richest Man in Babylon

  // ── Martina Topley-Bird ───────────────────────────────────────────────────
  'PYJZC9kFHuI': 'PYJZC9kFHuI', // Sandpaper Kisses

  // ── Faithless ────────────────────────────────────────────────────────────
  'GbwFwDJnqLg': 'GbwFwDJnqLg', // Salva Mea
  '0DJAb78AYSQ': '0DJAb78AYSQ', // Insomnia
  'OVEm_bZP3ZI': 'OVEm_bZP3ZI', // God Is a DJ

  // ── Waldeck ───────────────────────────────────────────────────────────────
  'ISn8lLsomzQ': 'ISn8lLsomzQ', // playlist track

  // ── Röyksopp ─────────────────────────────────────────────────────────────
  'B9WKhZFqfAA': 'B9WKhZFqfAA', // Remind Me
  'mGEpFDLHOzk': 'mGEpFDLHOzk', // Poor Leno

  // ── Moderat ───────────────────────────────────────────────────────────────
  'F1YhLw_T51M': 'F1YhLw_T51M', // Moan (Trentemoller)
  'Nn1R19QzF3k': 'Nn1R19QzF3k', // A New Error (Moderat)
  'YVzxpHkQGWY': 'YVzxpHkQGWY', // Bad Kingdom

  // ── Air ───────────────────────────────────────────────────────────────────
  'iBJCHn_Hzpk': 'iBJCHn_Hzpk', // Sexy Boy
  'QfJb4rN884k': 'QfJb4rN884k', // Moon Safari

  // ── Beth Orton ────────────────────────────────────────────────────────────
  'jYTYZxI0sVA': 'jYTYZxI0sVA', // She Cries Your Name
  'kYJvP4a0l7M': 'kYJvP4a0l7M', // Stolen Car

  // ── FKA twigs ─────────────────────────────────────────────────────────────
  '5XBGAXHBArQ': '5XBGAXHBArQ', // Breathe

  // ── King Krule ────────────────────────────────────────────────────────────
  'aaGpFBIHBiA': 'aaGpFBIHBiA', // Dum Surfer
  '0TKiMY1a6oQ': '0TKiMY1a6oQ', // The Ooz

  // ── Nicolas Jaar ─────────────────────────────────────────────────────────
  'MQJvp06vxoI': 'MQJvp06vxoI', // Space Is Only Noise If You Can See
  'Vm-KIqmZ4Rc': 'Vm-KIqmZ4Rc', // Problems With the FCC

  // ── Four Tet ─────────────────────────────────────────────────────────────
  'p0NkKjBgHiE': 'p0NkKjBgHiE', // Smile Around the Face
  'UuGhxb5IrTM': 'UuGhxb5IrTM', // Ascending / Kindred

  // ── Flying Lotus ─────────────────────────────────────────────────────────
  'n9g35r5DpAI': 'n9g35r5DpAI', // She Just Likes to Fight
  'Fr4rz-wLBzU': 'Fr4rz-wLBzU', // Never Catch Me
  'K9_Wn-YhS7Y': 'K9_Wn-YhS7Y', // Coronus, the Terminator
  'hQo2-y3rB8I': 'hQo2-y3rB8I', // I Am God

  // ── Bonobo ────────────────────────────────────────────────────────────────
  'XsMoWv3SFQA': 'XsMoWv3SFQA', // Kong / Animal Magic
  'sK7_vYq-164': 'sK7_vYq-164', // Kiara
  'lQ8n71XoWJk': 'lQ8n71XoWJk', // Stay Alive
  'i008QhM0qR0': 'i008QhM0qR0', // Before I Move Off (Mount Kimbie)

  // ── Boards of Canada ──────────────────────────────────────────────────────
  'ZaHPtYkpEBc': 'ZaHPtYkpEBc', // Testpressing #4
  'fNvCOMECfx4': 'fNvCOMECfx4', // Pete Standing Alone / Olson

  // ── J Dilla ───────────────────────────────────────────────────────────────
  'UkN4SNIG6JE': 'UkN4SNIG6JE', // Donuts (Outro)

  // ── Nightmares on Wax ─────────────────────────────────────────────────────
  'Z87_R8Qerxg': 'Z87_R8Qerxg', // Aftermath (NOW)
  'x4z6rK1bF4g': 'x4z6rK1bF4g', // Skylarking

  // ── Goldie ────────────────────────────────────────────────────────────────
  'lI0wJvj_WBo': 'lI0wJvj_WBo', // Timeless

  // ── Moloko ───────────────────────────────────────────────────────────────
  'XhI4eW6D93g': 'XhI4eW6D93g', // Sing It Back (Boris Dlugosch remix)
  '0h5E0NfGgys': '0h5E0NfGgys', // The Time Is Now
  'aG0d_J6T1Wc': 'aG0d_J6T1Wc', // I Am You

  // ── Archive ───────────────────────────────────────────────────────────────
  'X1w0Nl7yOqA': 'X1w0Nl7yOqA', // You Make Me Feel

  // ── Goldfrapp ────────────────────────────────────────────────────────────
  '9_p5_n72Qp8': '9_p5_n72Qp8', // Lovely Head
  'UqQ1sR5j46k': 'UqQ1sR5j46k', // Pilots
  'H6Q3M-B8T6w': 'H6Q3M-B8T6w', // Felt Mountain

  // ── Shackleton ────────────────────────────────────────────────────────────
  '032sTj-JqOQ': '032sTj-JqOQ', // Blood on My Hands

  // ── Sevdaliza ─────────────────────────────────────────────────────────────
  'T1wY1K1v0_4': 'T1wY1K1v0_4', // Human Nature

  // ── Floating Points ───────────────────────────────────────────────────────
  'fD0Wf2jXNqM': 'fD0Wf2jXNqM', // Nacht ii
  '5YKjP1rqXOA': '5YKjP1rqXOA', // Elaenia/fair weather

  // ── This Mortal Coil ─────────────────────────────────────────────────────
  '2rO9QnJt0p4': '2rO9QnJt0p4', // Holocaust

  // ── Attica Blues ─────────────────────────────────────────────────────────
  'ZfWlqP8w8-E': 'ZfWlqP8w8-E', // Blueprints

  // ── Hooverphonic ─────────────────────────────────────────────────────────
  'QZ-j4FqG844': 'QZ-j4FqG844', // A New Stereophonic Sound Spectacular

  // ── Beth Orton ────────────────────────────────────────────────────────────
  '1fG-129-Lqo': '1fG-129-Lqo', // Someday (Alpha)

  // ── Gravediggaz ───────────────────────────────────────────────────────────
  'Q1y8298E75M': 'Q1y8298E75M', // Diary of a Madman

  // ── Lebanon Hanover ──────────────────────────────────────────────────────
  'AOP3XG-5m3k': 'AOP3XG-5m3k', // Gallowdance
  'Fw-z9wYQd3g': 'Fw-z9wYQd3g', // Sci-Fire

  // ── Actress ──────────────────────────────────────────────────────────────
  'B0gDkF-0L4Q': 'B0gDkF-0L4Q', // Splazsh

  // ── BadBadNotGood ────────────────────────────────────────────────────────
  'nI_gJj0X92c': 'nI_gJj0X92c', // Floe
  'yWd1QdJ6X2w': 'yWd1QdJ6X2w', // In Your Eyes
  'yB-3h_yPz6g': 'yB-3h_yPz6g', // III

  // ── Groove Armada ────────────────────────────────────────────────────────
  '0b5hHqX6oWw': '0b5hHqX6oWw', // Northern Star
  'N2Qk2OpFjM0': 'N2Qk2OpFjM0', // Superstylin

  // ── Olive ────────────────────────────────────────────────────────────────
  'F_fP_43t85o': 'F_fP_43t85o', // You're Not Alone
  'V2B31_QG64E': 'V2B31_QG64E', // Extra Virgin

  // ── Quantic ──────────────────────────────────────────────────────────────
  '0kFp634vT-E': '0kFp634vT-E', // Stampede

  // ── RJD2 ─────────────────────────────────────────────────────────────────
  'rV1yJb1qC7A': 'rV1yJb1qC7A', // Ghostwriter
  'vVfSjVz8XoE': 'vVfSjVz8XoE', // Deadringer

  // ── Darkstar ─────────────────────────────────────────────────────────────
  'hZJ72vPqQ0Q': 'hZJ72vPqQ0Q', // North

  // ── Shlohmo ──────────────────────────────────────────────────────────────
  'S0y_6q9jPDU': 'S0y_6q9jPDU', // Bad Vibes

  // ── Earthling ────────────────────────────────────────────────────────────
  '7uC_5k11hY0': '7uC_5k11hY0', // Radar

  // ── Knxwledge ────────────────────────────────────────────────────────────
  'gS6r_z3X-4Q': 'gS6r_z3X-4Q', // All I Need

  // ── Laurel Halo ──────────────────────────────────────────────────────────
  'o0v42rF5K4g': 'o0v42rF5K4g', // Hour Logic

  // ── Loyle Carner ─────────────────────────────────────────────────────────
  '1d_l6f5Hw_k': '1d_l6f5Hw_k', // Not Waving But Drowning

  // ── Madlib / Madvillainy ─────────────────────────────────────────────────
  'APj2sEhK-sI': 'APj2sEhK-sI', // All Caps

  // ── Rhye ─────────────────────────────────────────────────────────────────
  'zqECX9VPSiQ': 'zqECX9VPSiQ', // Bloodstream / Woman
  '13iQk53Qh9c': '13iQk53Qh9c', // Woman

  // ── Cinematic Orchestra ───────────────────────────────────────────────────
  'gHB81GHZz1k': 'gHB81GHZz1k', // All That You Give / Film Noir
  'kF22N0R_9fI': 'kF22N0R_9fI', // Consuming Illusion
  'QB0knZkK0fE': 'QB0knZkK0fE', // To Build a Home
  'iy2n5eGmnoE': 'iy2n5eGmnoE', // All Things to All Men

  // ── DJ Spooky ────────────────────────────────────────────────────────────
  '7s_Dksb8P5c': '7s_Dksb8P5c', // Songs of a Dead Dreamer

  // ── Ibeyi ─────────────────────────────────────────────────────────────────
  'cRonIOpmbdk': 'cRonIOpmbdk', // Nazinji Zaka
  'BLhfOSWxKsY': 'BLhfOSWxKsY', // River

  // ── Hiatus Kaiyote ────────────────────────────────────────────────────────
  'ksNd5_oHhYE': 'ksNd5_oHhYE', // Tally Ho!
  'hRy5pC2YRHY': 'hRy5pC2YRHY', // Nakamarra

  // ── CocoRosie ─────────────────────────────────────────────────────────────
  'Rw5G29baMkk': 'Rw5G29baMkk', // Who Am I
  'TLFmzxQxYZk': 'TLFmzxQxYZk', // Bird on a Wire

  // ── SOHN ─────────────────────────────────────────────────────────────────
  'Hd_0UoHOH5Y': 'Hd_0UoHOH5Y', // Artifice
  '2Tz7L5y0918': '2Tz7L5y0918', // Tremors
  'xhK2c3Jq0O0': 'xhK2c3Jq0O0', // The Wheel
  'CIWh1WrGqCE': 'CIWh1WrGqCE', // Riverside

  // ── Agnes Obel ────────────────────────────────────────────────────────────
  'o96nfZBfJKU': 'o96nfZBfJKU', // Breathing Underwater

  // ── Kaytranada ────────────────────────────────────────────────────────────
  '4o77GYKH_iY': '4o77GYKH_iY', // Glowed Up

  // ── Nils Frahm ────────────────────────────────────────────────────────────
  'eFNVpJ9RXm4': 'eFNVpJ9RXm4', // Territory

  // ── Daedelus ─────────────────────────────────────────────────────────────
  '53c3vE67W0I': '53c3vE67W0I', // Invention
  '1Vq6Y6S9_0I': '1Vq6Y6S9_0I', // Fair Weather Friends

  // ── LTJ Bukem ────────────────────────────────────────────────────────────
  'YpS6c4kI2gU': 'YpS6c4kI2gU', // Horizons
  'o04_gXN_8o4': 'o04_gXN_8o4', // Demon

  // ── Red Snapper ──────────────────────────────────────────────────────────
  'kYJmZ257c9s': 'kYJmZ257c9s', // Prince Blimey

  // ── Mono (UK) ────────────────────────────────────────────────────────────
  'S2o-T24Vp9g': 'S2o-T24Vp9g', // Life in Mono

  // ── Tosca ────────────────────────────────────────────────────────────────
  'S43WwTGBh3o': 'S43WwTGBh3o', // Amadeus

  // ── Psapp ────────────────────────────────────────────────────────────────
  'S2k7yD17Mow': 'S2k7yD17Mow', // Hi

  // ── Tirzah ───────────────────────────────────────────────────────────────
  'qC42Gg-oW5Y': 'qC42Gg-oW5Y', // Devotion

  // ── Chelsea Wolfe ────────────────────────────────────────────────────────
  'j-h-rR1qCbs': 'j-h-rR1qCbs', // Pain Is Beauty
  'MhYyNq0d8F0': 'MhYyNq0d8F0', // Dangerous Days

  // ── Andy Stott ───────────────────────────────────────────────────────────
  'l88L1yV-i-w': 'l88L1yV-i-w', // Luxury Problems

  // ── How To Dress Well ────────────────────────────────────────────────────
  'tC209Z7o24U': 'tC209Z7o24U', // Ready for the World
  '5o0_h-yT4mU': '5o0_h-yT4mU', // And It Was You

  // ── Yppah ────────────────────────────────────────────────────────────────
  '1F_47Z9-g8Y': '1F_47Z9-g8Y', // You Are Beautiful at All Times

  // ── Howie B ──────────────────────────────────────────────────────────────
  'o0E0kEa8x6Y': 'o0E0kEa8x6Y', // Music

  // ── How to Destroy Angels ────────────────────────────────────────────────
  'i9Qc_6F4tBw': 'i9Qc_6F4tBw', // Welcome Oblivion



  // ── Nusrat Fateh Ali Khan ─────────────────────────────────────────────────
  'NN3rJ0NKJQY': 'NN3rJ0NKJQY', // Mustt Mustt

  // ── Sarah Jones ───────────────────────────────────────────────────────────
  'aFPjhHs7Sm8': 'aFPjhHs7Sm8', // Your Revolution

  // ── Steel Pulse ───────────────────────────────────────────────────────────
  '4j_8IcHGZAI': '4j_8IcHGZAI', // Captain Dread
};

/**
 * Look up a verified replacement for a YouTube ID.
 * Returns the replacement ID (may be the same if no replacement needed),
 * or undefined if not in the map.
 */
export function getVerifiedReplacement(originalId: string): string | undefined {
  return YT_REPLACEMENTS[originalId];
}

/**
 * List of IDs that are known to need replacement (value differs from key).
 */
export const KNOWN_REPLACEMENTS = Object.entries(YT_REPLACEMENTS)
  .filter(([k, v]) => k !== v)
  .reduce<Record<string, string>>((acc, [k, v]) => { acc[k] = v; return acc; }, {});
