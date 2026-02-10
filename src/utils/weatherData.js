// 実際の天気データ
export const REAL_WEATHER_DATA = {
  '北海道': {
    condition: 'Rainy', // 曇り時々雨か雪
    tempHigh: 3,
    tempLow: -2,
    temp: 1, // 平均気温
    description: '北海道でも南西部は雨の可能性',
    humidity: 75,
    wind: 3.5,
    sunshine: 0.2
  },
  '宮城県': {
    condition: 'Rainy',
    tempHigh: 8,
    tempLow: 1,
    temp: 5,
    description: '日中も空気が冷たく感じられます',
    humidity: 85,
    wind: 3.0,
    sunshine: 0.0
  },
  '東京都': {
    condition: 'Rainy',
    tempHigh: 12,
    tempLow: 5,
    temp: 9,
    description: '一日を通して傘が手放せません',
    humidity: 80,
    wind: 2.5,
    sunshine: 0.0
  },
  '愛知県': {
    condition: 'Rainy',
    tempHigh: 11,
    tempLow: 5,
    temp: 8,
    description: '降り方が強まる時間帯も',
    humidity: 82,
    wind: 3.2,
    sunshine: 0.0
  },
  '大阪府': {
    condition: 'Rainy',
    tempHigh: 11,
    tempLow: 6,
    temp: 9,
    description: '降水確率は高めです',
    humidity: 81,
    wind: 2.8,
    sunshine: 0.0
  },
  '広島県': {
    condition: 'Rainy',
    tempHigh: 12,
    tempLow: 6,
    temp: 9,
    description: 'お出かけには雨具が必須',
    humidity: 80,
    wind: 2.6,
    sunshine: 0.0
  },
  '福岡県': {
    condition: 'Rainy', // 雨のち曇り
    tempHigh: 12,
    tempLow: 8,
    temp: 10,
    description: '午後は次第に雨が止む見込み',
    humidity: 78,
    wind: 2.4,
    sunshine: 0.1
  },
  '沖縄県': {
    condition: 'Rainy', // 曇り時々雨
    tempHigh: 20,
    tempLow: 15,
    temp: 18,
    description: '湿った空気が入り、蒸し暑さも',
    humidity: 85,
    wind: 3.0,
    sunshine: 0.3
  }
};

// 都市名から都道府県へのマッピング
export const CITY_TO_PREFECTURE = {
  // 北海道
  '札幌': '北海道',
  '函館': '北海道',
  '旭川': '北海道',
  '小樽': '北海道',
  
  // 東北
  '仙台': '宮城県',
  '青森': '青森県',
  '盛岡': '岩手県',
  '秋田': '秋田県',
  '山形': '山形県',
  '福島': '福島県',
  
  // 関東
  '水戸': '茨城県',
  '宇都宮': '栃木県',
  '前橋': '群馬県',
  '浦和': '埼玉県',
  'さいたま': '埼玉県',
  '千葉': '千葉県',
  '新宿': '東京都',
  '渋谷': '東京都',
  '横浜': '神奈川県',
  '川崎': '神奈川県',
  
  // 中部
  '新潟': '新潟県',
  '富山': '富山県',
  '金沢': '石川県',
  '福井': '福井県',
  '甲府': '山梨県',
  '長野': '長野県',
  '岐阜': '岐阜県',
  '静岡': '静岡県',
  '名古屋': '愛知県',
  '津': '三重県',
  
  // 関西
  '大津': '滋賀県',
  '京都': '京都府',
  '梅田': '大阪府',
  '難波': '大阪府',
  '神戸': '兵庫県',
  '奈良': '奈良県',
  '和歌山': '和歌山県',
  
  // 中国
  '鳥取': '鳥取県',
  '松江': '島根県',
  '岡山': '岡山県',
  '広島': '広島県',
  '山口': '山口県',
  
  // 四国
  '徳島': '徳島県',
  '高松': '香川県',
  '松山': '愛媛県',
  '高知': '高知県',
  
  // 九州・沖縄
  '福岡': '福岡県',
  '博多': '福岡県',
  '佐賀': '佐賀県',
  '長崎': '長崎県',
  '熊本': '熊本県',
  '大分': '大分県',
  '宮崎': '宮崎県',
  '鹿児島': '鹿児島県',
  '那覇': '沖縄県'
};

/**
 * 入力された地名を都道府県名に正規化する
 * @param {string} input - ユーザーが入力した地名
 * @returns {string|null} - 正規化された都道府県名、またはnull
 */
export const normalizeLocation = (input) => {
  if (!input) return null;
  
  const trimmedInput = input.trim();
  
  // ===== ステップ1: 完全一致を最優先 =====
  
  // 1-1. 都市名の完全一致
  if (CITY_TO_PREFECTURE[trimmedInput]) {
    return CITY_TO_PREFECTURE[trimmedInput];
  }
  
  // 1-2. 都道府県名の完全一致
  if (REAL_WEATHER_DATA[trimmedInput]) {
    return trimmedInput;
  }
  
  // ===== ステップ2: 前方一致（開始位置でマッチ） =====
  
  // 2-1. 都市名の前方一致
  const cityStartMatch = Object.keys(CITY_TO_PREFECTURE).find(city => 
    trimmedInput.startsWith(city) || city.startsWith(trimmedInput)
  );
  if (cityStartMatch) {
    return CITY_TO_PREFECTURE[cityStartMatch];
  }
  
  // 2-2. 都道府県名の前方一致
  const prefStartMatch = Object.keys(REAL_WEATHER_DATA).find(pref => 
    trimmedInput.startsWith(pref) || pref.startsWith(trimmedInput)
  );
  if (prefStartMatch) {
    return prefStartMatch;
  }
  
  // ===== ステップ3: 部分一致（最長一致を優先） =====
  
  // 最長一致を見つけるヘルパー関数
  const findLongestMatch = (candidates, matchFn) => {
    let longestMatch = null;
    let longestLength = 0;
    
    for (const candidate of candidates) {
      const matchLength = matchFn(candidate);
      if (matchLength > longestLength) {
        longestLength = matchLength;
        longestMatch = candidate;
      }
    }
    
    return longestMatch;
  };
  
  // 3-1. 都市名の部分一致
  const cityPartialMatch = findLongestMatch(
    Object.keys(CITY_TO_PREFECTURE),
    (city) => trimmedInput.includes(city) || city.includes(trimmedInput) ? city.length : 0
  );
  if (cityPartialMatch) {
    return CITY_TO_PREFECTURE[cityPartialMatch];
  }
  
  // 3-2. 都道府県名の部分一致
  const prefPartialMatch = findLongestMatch(
    Object.keys(REAL_WEATHER_DATA),
    (pref) => trimmedInput.includes(pref) || pref.includes(trimmedInput) ? pref.length : 0
  );
  if (prefPartialMatch) {
    return prefPartialMatch;
  }
  
  return null;
};

/**
 * 指定された地名の天気データを取得する
 * @param {string} location - 地名（都道府県名または都市名）
 * @returns {object|null} - 天気データオブジェクト、またはnull
 */
export const getRealWeatherData = (location) => {
  const prefecture = normalizeLocation(location);
  if (!prefecture) return null;
  
  const data = REAL_WEATHER_DATA[prefecture];
  if (!data) return null;
  
  return {
    ...data,
    location: prefecture
  };
};
