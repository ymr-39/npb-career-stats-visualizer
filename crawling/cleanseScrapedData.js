const cleanseScrapedData = (rawData) => {
  const profile = cleanseProfile(rawData.profile);
  
  return {
    profile,
    battingStats: cleanseBattingStats(rawData.battingStats, profile),
    pitchingStats: rawData.pitchingStats ? cleansePitchingStats(rawData.pitchingStats, profile) : null,
  };
};

const teamNameToId = {
  '広島東洋カープ': 'C',
  '阪神タイガース': 'T',
  '横浜DeNAベイスターズ': 'DB',
  '読売ジャイアンツ': 'G',
  '中日ドラゴンズ': 'D',
  '東京ヤクルトスワローズ': 'S',
  '福岡ソフトバンクホークス': 'H',
  '埼玉西武ライオンズ': 'L',
  '東北楽天ゴールデンイーグルス': 'E',
  'オリックスバファローズ': 'BS',
  '北海道日本ハムファイターズ': 'F',
  '千葉ロッテマリーンズ': 'M',
};

const parseDate = (dateStr) => {
  const dateArr = dateStr.match(/(\d+)/g).map(s => parseInt(s));
  return new Date(dateArr[0], dateArr[1] - 1, dateArr[2] - 1);
};

const extract = (str, regExp) => {
  return str.match(regExp)[1];
};

const cleanseProfile = (rawProfile, rawBattingStats) => {
  const name = rawProfile.name.replace(/ /g, '');
  const kana = rawProfile.kana.replace(/・/g, '');
  const team = teamNameToId[rawProfile.team];
  const position = (rawProfile.position === '投手') ? 'P' : 'B';
  const pitchHand = (rawProfile.handedness[0] === '右') ? 'R' : 'L';
  const batHand = (rawProfile.handedness[2] === '右') ? 'R' : 'L';
  const height = parseInt(extract(rawProfile.heightAndWeight, /(\d+)cm/));
  const weight = parseInt(extract(rawProfile.heightAndWeight, /(\d+)kg/));
  const birthDay = parseDate(rawProfile.birthDay);
  const firstYear = rawProfile.draftInfo ? parseInt(extract(rawProfile.draftInfo, /(\d+)年/)) : rawBattingStats.years[0].year;

  return {
    name,
    kana,
    team,
    position,
    pitchHand,
    batHand,
    height,
    weight,
    birthDay,
    firstYear,
  };
};

const convertAllToNumber = years => {
  return years.map(year => {
    const convertedYear = {};
    Object.entries(year).forEach(([key, value]) => {
      convertedYear[key] = Number(value);
    });

    return convertedYear;
  });
};

const calculateAdditionalBattingStats = (years, profile) => {
  return years.map(year => {
    year.age = year.year - profile.birthDay.getFullYear();
    year.yearth = year.year - profile.firstYear + 1;
    year.onBasePlusSluggingPercentage = year.onBasePercentage + year.sluggingPercentage;
    return year;
  });
};

const cleanseBattingStats = (rawBattingStats, profile) => {
  let years = convertAllToNumber(rawBattingStats.years);
  years = calculateAdditionalBattingStats(years, profile);

  return years;
};

const convertPitchingInning = (integer, fractional) => {
  if (!fractional) return integer;

  return integer + fractional * 3.3333;
};

const calculateAdditionalPitchingStats = (years, profile) => {
  return years.map(year => ({
    ...year,
    age: year.year - profile.birthDay.getFullYear(),
    yearth: year.year - profile.firstYear + 1,
    inningsPitched: convertPitchingInning(year.inningsPitchedInteger, year.inningsPitchedFractional),
    walksPlusHitsPerInning: (year.hits + year.basesOnBalls) ? 0 : (year.hits + year.basesOnBalls) / year.inningPitched,
  }));
};

const cleansePitchingStats = (rawBattingStats, profile) => {
  let years = convertAllToNumber(rawBattingStats.years);
  years = calculateAdditionalPitchingStats(years, profile);

  return years;
};

module.exports = cleanseScrapedData;