/**
 * WxTech APIとの通信を担当するモジュール
 * エンドポイントURLは仮定のものを使用しており、実際にお使いのAPIキー等に合わせて変更が必要な場合があります。
 */

// APIエンドポイント設定
// 注意: WxTech APIのエンドポイントは契約ごとに異なる場合があります。
// 正しいエンドポイントURLに変更してください。
// 例: https://wxtech.weathernews.com/api/v1/observation
const API_BASE_URL = 'https://wxtech.weathernews.com/api/v1/observation'; 

// APIキー設定（必要な場合）
// 環境変数から読み込むか、ここに直接記述します（本番環境では環境変数推奨）
const API_KEY = import.meta.env.VITE_WXTECH_API_KEY || '';

/**
 * 指定された緯度経度の天気データをAPIから取得する
 * @param {number} lat - 緯度
 * @param {number} lon - 経度
 * @returns {Promise<object|null>} - 天気データオブジェクト、またはnull
 */
export const fetchWeatherFromAPI = async (lat, lon) => {
  try {
    // クエリパラメータの構築
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      // 必要に応じて他のパラメータを追加
      // lang: 'ja',
      // key: API_KEY
    });

    const url = `${API_BASE_URL}?${params.toString()}`;
    console.log(`Fetching weather data from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // APIキーをヘッダーで送る場合
        // 'X-Api-Key': API_KEY 
      }
    });
    
    if (!response.ok) {
        // 401 Unauthorized, 403 Forbidden などのエラーハンドリング
        if (response.status === 401 || response.status === 403) {
            console.error('API認証エラー: APIキーまたは接続許可を確認してください。');
        } else if (response.status === 404) {
            console.error('APIエンドポイントが見つかりません。URLを確認してください。');
        } else {
            console.error(`API Error: ${response.status} ${response.statusText}`);
        }
        return null;
    }
    
    const data = await response.json();
    console.log('API Response:', data); // デバッグ用

    return convertAPIResponse(data);
  } catch (error) {
    console.error('天気API取得エラー:', error);
    return null; 
  }
};

/**
 * APIレスポンスをアプリのデータ形式に変換
 * WxTechのレスポンス形式に合わせてマッピングを調整する必要があります。
 * ここでは、一般的な形式を想定しています。
 * 
 * 想定レスポンス形式:
 * {
 *   temperature: 20.5,
 *   humidity: 45,
 *   wind_speed: 3.2,
 *   weather_code: 100,
 *   sunshine_duration: 10
 * }
 */
const convertAPIResponse = (apiData) => {
  // レスポンスの構造に合わせて調整してください
  // 例: APIが { temp: 20, hum: 50, ... } の場合
  
  // 安全にデータにアクセスするためのヘルパー
  const getVal = (key, fallback) => apiData[key] !== undefined ? apiData[key] : fallback;

  // WxTechのレスポンスフィールド名（仮定）とマッピング
  const temp = getVal('temperature', getVal('temp', 20)); // 気温
  const humidity = getVal('humidity', getVal('rh', 50)); // 湿度
  const wind = getVal('wind_speed', getVal('wind', 2.0)); // 風速
  const wxCode = getVal('weather_code', getVal('wx_code', 100)); // 天気コード
  const sunshine = getVal('sunshine_duration', getVal('sunshine', 0.5)); // 日照（正規化が必要かも）

  return {
    temp: Math.round(Number(temp)), // 整数に丸める
    humidity: Number(humidity),
    wind: Number(wind),
    condition: mapWeatherCode(Number(wxCode)),
    sunshine: Number(sunshine) // 0.0〜1.0などに正規化が必要な場合はここで計算
  };
};

/**
 * 天気コードをアプリのCondition（Sunny/Cloudy/Rainy）にマッピング
 * WxTechの天気コード仕様に合わせて調整が必要
 */
const mapWeatherCode = (wxCode) => {
  // WxTechの実況天気コード（例）
  // 100番台: 晴れ
  // 200番台: 曇り
  // 300番台: 雨
  // 400番台: 雪
  // などの規則性があると仮定
  
  // WxTech 天気コード定義（ドキュメントより引用が必要）
  // 1: 快晴, 2: 晴れ, 3: 薄曇り, 4: 曇り
  // 10: 雨, ... 
  
  // 仮の実装: 値の範囲で判定
  if (wxCode <= 2 || (wxCode >= 100 && wxCode < 200)) return 'Sunny';
  if (wxCode <= 4 || (wxCode >= 200 && wxCode < 300)) return 'Cloudy';
  return 'Rainy'; 
};
