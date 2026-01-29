import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Sun, CloudRain, Sparkles, MapPin, ChevronRight, Moon, Cloud, Search, Droplets } from 'lucide-react';
import { getPageContent, getWeatherTheme } from './utils/weatherLogic';

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const NORMALIZE_LOCATION = (input) => {
  // Find the first prefecture name mentioned in the input
  const found = PREFECTURES.find(pref => input.includes(pref));
  // Also handle cases without '都','道','府','県' (e.g., "東京", "北海道")
  if (!found) {
    const shortFound = PREFECTURES.find(pref => {
      const short = pref.replace(/[都道府県]$/, '');
      return input.includes(short) && short.length > 0;
    });
    return shortFound || null;
  }
  return found;
};

// Mock WNI-like API Simulation
const FETCH_WEATHER_FOR_LOCATION = (location) => {
  const normalized = NORMALIZE_LOCATION(location) || '東京都';
  const index = PREFECTURES.indexOf(normalized);
  
  // Deterministic "variation" based on index
  // Distribution: 0-15: Sunny group, 16-30: Cloudy/Rainy group, 31-46: Mixed
  let condition = 'Sunny';
  let temp = 20;
  let humidity = 40;
  let wind = 2.0;
  let sunshine = 1.0;

  if (index % 3 === 0) {
    condition = 'Sunny';
    temp = 22 + (index % 10); // 22 to 31
    humidity = 35 + (index % 15);
  } else if (index % 3 === 1) {
    condition = 'Cloudy';
    temp = 15 + (index % 12); // 15 to 26
    humidity = 55 + (index % 20);
    sunshine = 0.2;
  } else {
    condition = 'Rainy';
    temp = 8 + (index % 10); // 8 to 17
    humidity = 75 + (index % 15);
    wind = 4.0 + (index % 5);
    sunshine = 0.0;
  }

  // Geographic adjustments
  if (index < 7) { // Hokkaido/Tohoku (Cooler)
    temp -= 8;
  } else if (index > 40) { // Kyushu/Okinawa (Warmer)
    temp += 6;
  }

  return { 
    temp: Math.round(temp), 
    wind: parseFloat(wind.toFixed(1)), 
    humidity, 
    condition, 
    sunshine, 
    location: normalized, 
    hour: 10 + (index % 8) 
  };
};

const App = () => {
  const [locationInput, setLocationInput] = useState('東京都');
  const [weather, setWeather] = useState(FETCH_WEATHER_FOR_LOCATION('東京都'));
  const [currentPage, setCurrentPage] = useState(0); // 0: Style, 1: Care, 2: Emo
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync weather on location change
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const data = FETCH_WEATHER_FOR_LOCATION(locationInput);
      setWeather(data);
      setLocationInput(data.location); // Normalize the input text to the found prefecture
      setCurrentPage(0); // Reset to first page when searching
    }
  };

  const theme = getWeatherTheme(weather.condition);
  const pageContent = getPageContent(weather, currentPage);

  const nextPage = () => {
    if (isAnimating) return;
    setCurrentPage((prev) => (prev + 1) % 3);
  };

  const WeatherIcon = ({ condition, size = 20 }) => {
    switch (condition) {
      case 'Sunny': return <Sun size={size} />;
      case 'Rainy': return <CloudRain size={size} />;
      case 'Cloudy': return <Cloud size={size} />;
      default: return <Moon size={size} />;
    }
  };

  return (
    <div className="container" style={{ 
      background: theme.bg,
      transition: 'background 1s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Bar */}
      <div style={{ padding: '24px 24px 8px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <div className="glass" style={{ 
          flex: 1, display: 'flex', alignItems: 'center', padding: '10px 16px', gap: '8px',
          background: theme.glass, border: `1px solid ${theme.subtext}`
        }}>
          <MapPin size={16} color={theme.subtext} />
          <input 
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="地名を検索..."
            style={{ 
              background: 'none', border: 'none', color: theme.text, fontSize: '0.9rem', outline: 'none', width: '100%',
              fontWeight: 600
            }}
          />
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleSearch}
          className="glass" 
          style={{ 
            padding: '10px', border: `1px solid ${theme.subtext}`, cursor: 'pointer', 
            color: theme.text, background: theme.glass, display: 'flex', alignItems: 'center' 
          }}
        >
          <Search size={18} />
        </motion.button>
      </div>

      {/* Progress Indicators */}
      <div style={{ display: 'flex', gap: '6px', padding: '12px 24px', zIndex: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ 
                width: i === currentPage ? '100%' : (i < currentPage ? '100%' : '0%'),
                background: i <= currentPage ? '#fff' : 'rgba(255,255,255,0.2)'
              }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%' }} 
            />
          </div>
        ))}
      </div>

      <main style={{ flex: 1, padding: '8px 24px 30px', display: 'flex', flexDirection: 'column' }}>
        {/* Story Card */}
        <div 
          onClick={nextPage}
          style={{ cursor: 'pointer', flex: 1, position: 'relative' }}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${weather.location}-${currentPage}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              className="glass"
              style={{ 
                height: '100%', 
                position: 'relative', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                background: `url("${pageContent.image}") center/cover no-repeat`,
                zIndex: -1,
                transition: 'transform 0.8s ease'
              }} />
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)',
                zIndex: -1 
              }} />
              
              <div style={{ padding: '40px 24px', color: '#fff' }}>
                <span style={{ 
                  fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: 'rgba(255,255,255,0.7)',
                  marginBottom: '12px', display: 'block'
                }}>
                  {pageContent.category}
                </span>
                <h2 style={{ fontSize: '2rem', marginTop: '4px', lineHeight: 1.3, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                  {pageContent.title}
                </h2>
                <p style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: '16px', lineHeight: 1.7, maxWidth: '90%' }}>
                  {pageContent.description}
                </p>
                
                <div style={{ display: 'flex', gap: '24px', marginTop: '30px' }}>
                  {pageContent.metrics.map((m, i) => (
                    <div key={i} style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{m.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Real-time Data Bar */}
        <section className="glass" style={{ 
          marginTop: '20px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: theme.glass, border: `1px solid ${theme.subtext}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: '#fff', background: theme.accent, padding: '8px', borderRadius: '12px', display: 'flex' }}>
              <WeatherIcon condition={weather.condition} size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: theme.text }}>{weather.condition}</div>
              <div style={{ fontSize: '0.75rem', color: theme.subtext, fontWeight: 600 }}>{weather.location}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.text, lineHeight: 1 }}>{weather.temp}°</div>
            <div style={{ fontSize: '0.65rem', color: theme.subtext, marginTop: '4px', fontWeight: 600 }}>Humid: {weather.humidity}%</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
