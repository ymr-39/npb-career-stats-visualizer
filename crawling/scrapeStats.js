const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');

const frameForBattingStats = {
  years: {
    _s: '#tablefix_b tr.registerStats',
    _d: [{
      year: 'td:nth-child(1)',
      games: 'td:nth-child(3)',
      plateAppearances: 'td:nth-child(4)',
      atBat: 'td:nth-child(5)',
      runs: 'td:nth-child(6)',
      hits: 'td:nth-child(7)',
      twoBaseHits: 'td:nth-child(8)',
      threeBaseHits: 'td:nth-child(9)',
      homeRuns: 'td:nth-child(10)',
      totalBases: 'td:nth-child(11)',
      runsBattedIn: 'td:nth-child(12)',
      stolenBases: 'td:nth-child(13)',
      caughtStealing: 'td:nth-child(14)',
      sacrificeHits: 'td:nth-child(15)',
      sacrificeFlies: 'td:nth-child(16)',
      basesOnBalls: 'td:nth-child(17)',
      hitByPitch: 'td:nth-child(18)',
      strikeOuts: 'td:nth-child(19)',
      doublePlays: 'td:nth-child(20)',
      battingAverage: 'td:nth-child(21)',
      sluggingPercentage: 'td:nth-child(22)',
      onBasePercentage: 'td:nth-child(23)',
    }],
  },
};

const frameForPitchingStats = {
  years: {
    _s: '#tablefix_p tr.registerStats',
    _d: [{
      year: 'td:nth-child(1)',
      games: 'td:nth-child(3)',
      wins: 'td:nth-child(4)',
      losses: 'td:nth-child(5)',
      save: 'td:nth-child(6)',
      hold: 'td:nth-child(7)',
      holdPoints: 'td:nth-child(8)',
      completeGames: 'td:nth-child(9)',
      shutOuts: 'td:nth-child(10)',
      noWalk: 'td:nth-child(11)',
      winningPercentage: 'td:nth-child(12)',
      battersFaced: 'td:nth-child(13)',
      inningsPitched: 'td:nth-child(14)',
      hits: 'td:nth-child(15)',
      homeRuns: 'td:nth-child(16)',
      basesOnBalls: 'td:nth-child(17)',
      hitByPitch: 'td:nth-child(18)',
      strikeOuts: 'td:nth-child(19)',
      wildPitches: 'td:nth-child(20)',
      balks: 'td:nth-child(21)',
      runs: 'td:nth-child(22)',
      earnedRuns: 'td:nth-child(23)',
      earnedRunAverage: 'td:nth-child(24)',
    }],
  },
};

const scrapeStats = (html) => {
  const $ = cheerio.load(html);
  jsonframe($);

  const pitchingStats = $('body').scrape(frameForPitchingStats);
  const battingStats = $('body').scrape(frameForBattingStats);

  console.log(pitchingStats);
  console.log(battingStats);
};

module.exports = scrapeStats;