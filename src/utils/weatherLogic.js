export const getWeatherTheme = (condition) => {
  switch (condition) {
    case 'Sunny':
      return { 
        bg: 'var(--grad-sunny)', 
        accent: '#FF7E5F', 
        icon: 'Sun',
        text: '#2D3436', // Darker text for bright sunny backgrounds
        subtext: 'rgba(0,0,0,0.6)',
        glass: 'rgba(255,255,255,0.4)'
      };
    case 'Rainy':
      return { 
        bg: 'var(--grad-rainy)', 
        accent: '#00B4DB', 
        icon: 'CloudRain',
        text: '#FFFFFF',
        subtext: 'rgba(255,255,255,0.7)',
        glass: 'rgba(0,0,0,0.2)'
      };
    case 'Cloudy':
      return { 
        bg: 'var(--grad-cloudy)', 
        accent: '#757F9A', 
        icon: 'Cloud',
        text: '#FFFFFF',
        subtext: 'rgba(255,255,255,0.7)',
        glass: 'rgba(0,0,0,0.2)'
      };
    default:
      return { 
        bg: 'var(--grad-night)', 
        accent: '#2a5298', 
        icon: 'Moon',
        text: '#FFFFFF',
        subtext: 'rgba(255,255,255,0.7)',
        glass: 'rgba(0,0,0,0.3)'
      };
  }
};

const IMAGE_PATTERNS = {
  Sunny: {
    Style: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    Hair: "https://images.unsplash.com/photo-1522337360788-8b13dfbba0f9?auto=format&fit=crop&q=80&w=800",
    Sky: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800"
  },
  Rainy: {
    Style: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    Hair: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800",
    Sky: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&q=80&w=800"
  },
  Cloudy: {
    Style: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800",
    Hair: "https://images.unsplash.com/photo-1512496011212-724f74c2964a?auto=format&fit=crop&q=80&w=800",
    Sky: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&q=80&w=800"
  }
};

export const getPageContent = (weather, pageIdx) => {
  const { temp, wind, humidity, sunshine, condition, hour } = weather;
  const isRainy = condition === 'Rainy';

  // Page 1: Style
  if (pageIdx === 0) {
    const style = getStyleAdvice(temp);
    return {
      type: 'Style',
      title: style.title,
      description: style.description,
      category: "Style Recommendation",
      image: IMAGE_PATTERNS[condition]?.Style || IMAGE_PATTERNS.Sunny.Style,
      metrics: [
        { label: 'Weather', value: condition },
        { label: 'Temp', value: `${temp}℃` }
      ]
    };
  }

  // Page 2: Hair & Skin
  if (pageIdx === 1) {
    const hair = getHairIndex(wind, humidity);
    const skin = getSkinAdvice(humidity);
    return {
      type: 'Care',
      title: `「${hair.label} & ${skin.label}」`,
      description: `${hair.advice} ${skin.advice}`,
      category: "Hair & Skin Care",
      image: IMAGE_PATTERNS[condition]?.Hair || IMAGE_PATTERNS.Sunny.Hair,
      metrics: [
        { label: 'Wind', value: `${wind}m/s` },
        { label: 'Humid', value: `${humidity}%` }
      ]
    };
  }

  // Page 3: Emo & Risk
  if (pageIdx === 2) {
    const sky = getSkyAdvice(sunshine, hour);
    const rainRisk = isRainy ? "高い（傘マスト！）" : (humidity > 70 ? "低め（折りたたみ有れば安心）" : "なし（手ぶらOK）");
    return {
      type: 'Emo',
      title: isRainy ? "「雨の降る、しっとりした街角。」" : `「${sky.label}」`,
      description: isRainy ? "雨の日のフィルターがかかったような景色を楽しんで。お気に入りの傘が主役。" : sky.advice,
      category: "Life & Risk",
      image: IMAGE_PATTERNS[condition]?.Sky || IMAGE_PATTERNS.Sunny.Sky,
      metrics: [
        { label: 'Rain Risk', value: rainRisk },
        { label: 'Photo', value: isRainy ? "室内推奨" : (sky.value || "チャンスあり") }
      ]
    };
  }
};

export const getStyleAdvice = (temp) => {
  if (temp >= 25) {
    return {
      title: "「風を纏う、アーバン・リゾート。」",
      description: "25℃を超える予報。ノースリーブにリネンのパンツを合わせて、風通しよく。足元はサンダルで抜け感を。"
    };
  } else if (temp >= 20) {
    return {
      title: "「透け感シャツで、春の光を。」",
      description: "過ごしやすい22℃。シアー素材のシャツを主役に。冷房対策に薄手のカーディガンを忍ばせて。"
    };
  } else if (temp >= 15) {
    return {
      title: "「トレンチコートで、知的な縦ラインを。」",
      description: "少し肌寒い18℃。トレンチコートをバサっと羽織って。インナーは薄手のタートルネックが最適。"
    };
  } else {
    return {
      title: "「ウールの温もり、優雅な質感。」",
      description: "10℃前後。厚手のウールコートにマフラーをプラス。素材感の重なりを楽しんで。"
    };
  }
};

export const getHairIndex = (wind, humidity) => {
  if (wind > 5) {
    return { label: "前髪死守", advice: "【Hair】強風注意！バームやスプレーでしっかりホールドして崩れを防止。" };
  } else if (humidity > 70) {
    return { label: "まとめ髪推奨", advice: "【Hair】湿気高め。広がりを抑えるためにアップスタイルやオイル多めが吉。" };
  } else {
    return { label: "巻き髪キープ", advice: "【Hair】ニュアンスヘアを楽しめる絶好のコンディション。" };
  }
};

export const getSkinAdvice = (humidity) => {
  if (humidity < 40) {
    return { label: "保湿チャージ", advice: "【Skin】乾燥注意報。ミスト化粧水で日中の水分補給を忘れずに。" };
  } else if (humidity > 80) {
    return { label: "テカリ防止", advice: "【Skin】皮脂が浮きやすいかも。パウダーでサラサラ感をキープして。" };
  } else {
    return { label: "安定コンディション", advice: "【Skin】お肌の調子も整いやすい、心地よい湿度です。" };
  }
};

export const getSkyAdvice = (sunshine, hour) => {
  if (sunshine > 0.8 && hour >= 16 && hour <= 18) {
    return { label: "マジックアワー予報", value: `${hour}:15頃`, advice: "最高の夕焼けが撮れる予感。17時過ぎのスカイラインをチェックして。" };
  } else if (sunshine > 0.8) {
    return { label: "シャッターチャンス", value: "今が撮り時", advice: "透き通るような青空が広がっています。ビル影や青空を背景に映える一枚を。" };
  } else {
    return { label: "エモ空探し", value: "空の隙間待ち", advice: "ドラマチックな雲が見えるかも。モノクロ写真にするとエモさ倍増。" };
  }
};
