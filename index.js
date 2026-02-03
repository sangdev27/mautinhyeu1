// =============================================================================
// HEART MESSAGE APPLICATION - MAIN ENTRY POINT
// Enhanced and deobfuscated version for better readability
// This file serves as the main bootstrap for the heart animation application
// =============================================================================

// =============================================================================
// APPLICATION STYLES
// =============================================================================
const appStyles = `
html, body {
  /* Original background image from Shopify CDN */
  background-image: url('https://cdn.shopify.com/s/files/1/0757/9700/4572/files/traitim2_8f013135-8930-4992-95ef-0ac33342c92c.png?v=1760721493') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  color-scheme: dark;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}

body {
  /* Same background image for body from Shopify CDN */
  background-image: url('https://cdn.shopify.com/s/files/1/0757/9700/4572/files/traitim2_8f013135-8930-4992-95ef-0ac33342c92c.png?v=1760721493') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
}

canvas {
  display: block;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

@media screen and (max-width: 768px) {
  canvas {
    max-width: 100vw;
    max-height: 100vh;
  }
  * {
    touch-action: manipulation;
  }
}

@supports (-webkit-touch-callout: none) {
  body {
    -webkit-overflow-scrolling: touch;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
}

#musicToggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 3px solid rgba(220, 38, 38, 0.6);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4),
              0 0 20px rgba(220, 38, 38, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  overflow: hidden;
}

#musicToggle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

#musicToggle:hover {
  border-color: rgba(239, 68, 68, 0.9);
  box-shadow: 0 6px 25px rgba(239, 68, 68, 0.6),
              0 0 30px rgba(239, 68, 68, 0.4);
  transform: scale(1.1) rotate(5deg);
}

#musicToggle:active {
  transform: scale(0.95);
}

@keyframes pulse-heart {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4),
                0 0 20px rgba(220, 38, 38, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6),
                0 0 30px rgba(239, 68, 68, 0.4);
  }
}

#musicToggle.playing {
  animation: pulse-heart 2s ease-in-out infinite;
}

/* Flying Hearts Background */
.flying-hearts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.flying-heart {
  position: absolute;
  background-color: #ff526f;
  transform: rotate(45deg);
  animation: floatUp 8s ease-out forwards;
  filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 82, 111, 0.8)) drop-shadow(0 0 20px rgba(255, 82, 111, 0.6));
  will-change: transform, opacity, bottom;
}

.flying-heart::before,
.flying-heart::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background-color: inherit;
}

.flying-heart::before {
  top: -50%;
  left: 0;
  width: 100%;
  height: 100%;
}

.flying-heart::after {
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
}

@keyframes floatUp {
  0% {
    transform: rotate(45deg) translateY(0) rotate(0deg) scale(0);
    opacity: 0;
    bottom: -50px;
  }
  5% {
    opacity: 1;
    transform: rotate(45deg) translateY(0) rotate(18deg) scale(1);
  }
  95% {
    opacity: 1;
    transform: rotate(45deg) translateY(0) rotate(342deg) scale(1);
  }
  100% {
    transform: rotate(45deg) translateY(0) rotate(360deg) scale(0);
    opacity: 0;
    bottom: calc(100vh + 50px);
  }
}

/* Shooting Stars Container */
.shooting-stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: none; /* Hide shooting stars */
}

/* Shooting Star Animation */
@keyframes shooting-star-opacity {
  0% { opacity: 0; }
  40% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes shooting-star-pos {
  0% {
    transform: scale(0) rotate(0) translate3d(0, 0, 0);
  }
  100% {
    transform: scale(1) rotate(0) translate3d(-450px, 450px, 0);
  }
}

.shooting-star {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  transform-origin: 100% 0;
  animation: shooting-star-opacity 6s infinite ease-in,
             shooting-star-pos 6s infinite ease-in;
  box-shadow: 0 0 8px 3px rgba(255, 255, 255, 0.4);
  opacity: 0;
}

.shooting-star:after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 3px;
  border: 0 solid #fff;
  border-width: 0 80px 1.5px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.4);
  transform: rotate(-45deg) translate3d(1px, 2px, 0);
  box-shadow: 0 0 2px 0 rgba(255, 255, 255, 0.2);
  transform-origin: 0% 100%;
}

/* Character Names */
.character-names {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.character-name {
  position: absolute;
  font-family: 'Mali', cursive;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-shadow:
    0 0 10px rgba(255, 182, 193, 0.8),
    0 0 20px rgba(255, 105, 180, 0.6),
    2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: float-name 3s ease-in-out infinite;
}

.girl-name {
  left: 35%;
  top: 40%;
  transform: translateX(-50%);
}

.boy-name {
  right: 38%;
  top: 40%;
  transform: translateX(50%);
}

@keyframes float-name {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media screen and (max-width: 768px) {
  .character-name {
    font-size: 18px;
  }

  .girl-name {
    left: 18%;
    top: 45%;
  }

  .boy-name {
    right: 12%;
    top: 45%;
  }
}

/* Click Hint */
.click-hint {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 24px;
  border-radius: 30px;
  font-family: 'Dancing Script', cursive;
  font-size: 18px;
  color: #ff5252;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(255, 82, 82, 0.3);
  z-index: 999;
  animation: hintBounce 2s ease-in-out infinite;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 82, 82, 0.3);
}

.click-hint.hidden {
  animation: fadeOut 0.5s ease-out forwards;
}

@keyframes hintBounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

@media screen and (max-width: 768px) {
  .click-hint {
    font-size: 16px;
    padding: 10px 20px;
    bottom: 20px;
  }
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 182, 193, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: none;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.popup-overlay.show {
  display: flex;
}

.popup-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.popup-heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
  animation: floatHeart 10s infinite ease-in-out;
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
    opacity: 0.6;
  }
}

.popup-container {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 50px 35px 35px 35px;
  max-width: 450px;
  width: calc(100% - 40px);
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  z-index: 1001;
  box-sizing: border-box;
  margin: auto;
}

/* Custom scrollbar for webkit browsers (Chrome, Safari, Edge) */
.popup-container::-webkit-scrollbar {
  width: 8px;
}

.popup-container::-webkit-scrollbar-track {
  background: rgba(255, 182, 193, 0.1);
  border-radius: 10px;
  margin: 10px 0;
}

.popup-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff6b6b, #ff8787);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.popup-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff5252, #ff6b6b);
  width: 10px;
}

/* For Firefox */
.popup-container {
  scrollbar-width: thin;
  scrollbar-color: #ff6b6b rgba(255, 182, 193, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
  z-index: 1002;
  flex-shrink: 0;
}

.popup-close:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.popup-photo {
  background: white;
  padding: 12px;
  padding-bottom: 35px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: rotate(-2deg);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.popup-photo:hover {
  transform: rotate(0deg) scale(1.02);
}

.popup-photo img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  max-height: 350px;
  object-fit: cover;
}

.popup-content {
  text-align: left;
}

.popup-title {
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  font-weight: 700;
  color: #ff5252;
  margin-bottom: 18px;
  text-align: left;
  line-height: 1.3;
}

.popup-message {
  font-family: 'Dancing Script', cursive;
  font-size: 18px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 15px;
  white-space: pre-wrap;
}

.popup-message.typing::after {
  content: '|';
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.popup-date {
  font-family: 'Mali', cursive;
  font-size: 16px;
  color: #999;
  font-style: italic;
}

@media screen and (max-width: 768px) {
  .popup-overlay {
    padding: 15px;
  }

  .popup-container {
    padding: 45px 20px 25px 20px;
    width: calc(100% - 30px);
    max-width: 100%;
  }

  .popup-close {
    width: 35px;
    height: 35px;
    font-size: 20px;
    top: 8px;
    right: 8px;
  }

  .popup-photo {
    padding: 10px;
    padding-bottom: 30px;
    margin-bottom: 20px;
    max-width: 100%;
  }

  .popup-photo img {
    max-height: 280px;
  }

  .popup-title {
    font-size: 22px;
    margin-bottom: 15px;
  }

  .popup-message {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .popup-date {
    font-size: 14px;
  }
}
`;

// Inject styles into the document
const styleElement = document.createElement("style");
styleElement.type = "text/css";
styleElement.innerHTML = appStyles;
document.head.appendChild(styleElement);

// =============================================================================
// SHOOTING STARS EFFECT
// =============================================================================

// =============================================================================
// FLYING HEARTS BACKGROUND
// =============================================================================

// Create flying hearts container
const flyingHeartsContainer = document.createElement('div');
flyingHeartsContainer.className = 'flying-hearts-container';
flyingHeartsContainer.id = 'flying-hearts';
document.body.appendChild(flyingHeartsContainer);

// Function to create a single flying heart
function createFlyingHeart() {
  const heart = document.createElement('div');
  heart.className = 'flying-heart';

  // Random horizontal position
  const startPositionX = Math.random() * window.innerWidth;

  // Random size (10-25px) - smaller hearts
  const size = Math.random() * 15 + 10;

  // Random animation duration (4-7 seconds)
  const duration = Math.random() * 3 + 4;

  // Random colors for variety
  const colors = ['#ff526f', '#ff7a8a', '#ff9a9e', '#fecfef', '#ffb3ba'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Random delay (0-2 seconds)
  const delay = Math.random() * 2;

  // Set heart styles
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${startPositionX}px`;
  heart.style.backgroundColor = color;
  heart.style.animationDuration = `${duration}s`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.bottom = '-50px';

  flyingHeartsContainer.appendChild(heart);

  // Remove heart after animation completes
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove();
    }
  }, (duration + delay + 2) * 1000);
}

// Function to initialize flying hearts
function initializeFlyingHearts() {
  const isMobile = window.innerWidth <= 768;
  const initialHearts = isMobile ? 18 : 25;
  const heartInterval = isMobile ? 600 : 500;

  // Create initial hearts with staggered timing
  for (let i = 0; i < initialHearts; i++) {
    setTimeout(() => {
      createFlyingHeart();
    }, i * 200);
  }

  // Create hearts continuously
  setInterval(createFlyingHeart, heartInterval);
}

// Create shooting stars container
const shootingStarsContainer = document.createElement('div');
shootingStarsContainer.className = 'shooting-stars';
shootingStarsContainer.id = 'shooting-stars';
document.body.appendChild(shootingStarsContainer);

// =============================================================================
// URL PARAMETERS PARSING WITH BASE64 DECODE
// =============================================================================

// Default values
let appConfig = {
  girlName: 'My Love',
  boyName: 'Your Love',
  popupTitle: 'Happy Valentine ♥️',
  popupMessage: `Em yêu ơi, Happy Valentine's Day!
Anh muốn gửi đến em những lời yêu thương ngọt ngào nhất.
Em là món quà tuyệt vời nhất mà cuộc đời đã trao cho anh.
Cảm ơn em đã luôn ở bên, yêu thương và tin tưởng anh.
Anh yêu em rất nhiều! 💕`,
  popupImage: null,  // No default image - only show if provided in params
  hintText: '👆 Nhấn vào trái tim nhé 💖',
  music: 'https://cdn.shopify.com/s/files/1/0757/9700/4572/files/b4f4cdf2-91cf-42a8-a422-46b454f25c95.mp3?v=1748781067'  // Default music
};

// Helper function to decode base64 to UTF-8 string properly
function base64DecodeUnicode(str) {
  // Decode base64 to binary string
  const binaryString = atob(str);
  // Convert binary string to byte array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Decode UTF-8 bytes to string
  return new TextDecoder('utf-8').decode(bytes);
}

// Get URL parameter with support for encoded content
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);

  // Kiểm tra nếu có tham số c (encoded content)
  const encodedContent = urlParams.get("c");
  if (encodedContent) {
    try {
      // Giải mã base64 đã được URL-safe
      const base64 = encodedContent.replace(/-/g, "+").replace(/_/g, "/");
      const decodedString = base64DecodeUnicode(base64);
      const content = JSON.parse(decodedString);

      console.log('🔍 DEBUG: Decoded content from "c" parameter:', content);

      // Kiểm tra và trả về giá trị tương ứng
      if (name === "girlName" && content.girlName) return content.girlName;
      if (name === "boyName" && content.boyName) return content.boyName;
      if (name === "popupTitle" && content.popupTitle) return content.popupTitle;
      if (name === "popupMessage" && content.popupMessage) return content.popupMessage;
      if (name === "popupImage" && content.popupImage) return content.popupImage;
      if (name === "hintText" && content.hintText) return content.hintText;

      // Support for legacy field names
      if (name === "text" && content.text) return content.text;
      if (name === "text1" && content.text1) return content.text1;
      if (name === "text2" && content.text2) return content.text2;
      if (name === "loopText" && content.loopText) return content.loopText;
      if (name === "message" && content.message) return content.message;
      if (name === "instructions" && content.instructions) return content.instructions;
      if (name === "introduce" && content.introduce) return content.introduce;
      if (name === "music" && content.music) return content.music;
      if (name === "image" && content.image) return content.image;
      if (name === "name" && content.name) return content.name;
    } catch (e) {
      console.error("❌ Lỗi khi giải mã Base64:", e);
    }
  }

  // Kiểm tra tham số 'data' (legacy support)
  const legacyData = urlParams.get("data");
  if (legacyData) {
    try {
      const base64 = legacyData.replace(/-/g, "+").replace(/_/g, "/");
      const decodedString = base64DecodeUnicode(base64);
      const content = JSON.parse(decodedString);

      console.log('🔍 DEBUG: Decoded content from "data" parameter:', content);

      if (name === "girlName" && content.girlName) return content.girlName;
      if (name === "boyName" && content.boyName) return content.boyName;
      if (name === "popupTitle" && content.popupTitle) return content.popupTitle;
      if (name === "popupMessage" && content.popupMessage) return content.popupMessage;
      if (name === "popupImage" && content.popupImage) return content.popupImage;
      if (name === "hintText" && content.hintText) return content.hintText;
    } catch (e) {
      console.error("❌ Lỗi khi giải mã legacy data parameter:", e);
    }
  }

  // Kiểm tra tham số thông thường trong URL (không mã hóa)
  const regularParam = urlParams.get(name);
  if (regularParam) {
    return regularParam;
  }

  return null;
}

// Parse data from URL parameter (base64 encoded JSON)
(function() {
  console.log('🔍 DEBUG: URL search params:', window.location.search);

  try {
    // Get parameters using the new getUrlParameter function
    const girlNameParam = getUrlParameter('girlName');
    const boyNameParam = getUrlParameter('boyName');
    const popupTitleParam = getUrlParameter('popupTitle');
    const popupMessageParam = getUrlParameter('popupMessage');
    const popupImageParam = getUrlParameter('popupImage') || getUrlParameter('image');  // Support both popupImage and image
    const hintTextParam = getUrlParameter('hintText');
    const musicParam = getUrlParameter('music');

    // Update config with parsed data
    if (girlNameParam) appConfig.girlName = girlNameParam;
    if (boyNameParam) appConfig.boyName = boyNameParam;
    if (popupTitleParam) appConfig.popupTitle = popupTitleParam;
    if (popupMessageParam) appConfig.popupMessage = popupMessageParam;
    if (popupImageParam) appConfig.popupImage = popupImageParam;  // Only set if provided
    if (hintTextParam) appConfig.hintText = hintTextParam;
    if (musicParam) appConfig.music = musicParam;  // Replace default music if provided

    console.log('✅ App config loaded from URL parameters:', appConfig);
  } catch (error) {
    console.error('❌ Error parsing URL data:', error);
    console.warn('⚠️ Using default configuration');
  }
})();

// Extract config for easy access
const girlName = appConfig.girlName;
const boyName = appConfig.boyName;
const popupTitle = appConfig.popupTitle;
const popupMessage = appConfig.popupMessage;
const popupImage = appConfig.popupImage;
const hintText = appConfig.hintText;
const music = appConfig.music;

console.log('🎯 FINAL VALUES:');
console.log('  - girlName:', girlName);
console.log('  - boyName:', boyName);
console.log('  - popupTitle:', popupTitle);
console.log('  - popupImage:', popupImage);
console.log('  - hintText:', hintText);
console.log('  - music:', music);

// Export config to window.Heartlove for scripts.js to use
// This allows scripts.js to access URL parameter data
if (!window.Heartlove) {
  window.Heartlove = {
    data: {
      messages: ["Em la ca the gioi cua anh", "Mai ben em", "Anh yeu em"],
      images: ["https://cdn.shopify.com/s/files/1/0757/9700/4572/files/IMG_5022.jpg?v=1758716338"],
      heartColor: "#ff8c00",
      music: music  // Use music from appConfig (can be overridden by URL params)
    }
  };
}

// Update window.Heartlove.data with URL params if available
// Keep existing data as fallback
window.Heartlove.data = {
  ...window.Heartlove.data,
  // Add URL params data
  girlName: girlName,
  boyName: boyName,
  popupTitle: popupTitle,
  popupMessage: popupMessage,
  popupImage: popupImage,
  hintText: hintText,
  music: music  // Override music if provided in URL params
};

console.log('✅ Updated window.Heartlove.data:', window.Heartlove.data);

// =============================================================================
// CHARACTER NAMES
// =============================================================================

// Create character names container
const characterNamesContainer = document.createElement('div');
characterNamesContainer.className = 'character-names';
characterNamesContainer.id = 'character-names';

// Create girl name element
const girlNameElement = document.createElement('div');
girlNameElement.className = 'character-name girl-name';
girlNameElement.textContent = girlName;
console.log('👧 Created girl name element with text:', girlNameElement.textContent);

// Create boy name element
const boyNameElement = document.createElement('div');
boyNameElement.className = 'character-name boy-name';
boyNameElement.textContent = boyName;
console.log('👦 Created boy name element with text:', boyNameElement.textContent);

// Append names to container
characterNamesContainer.appendChild(girlNameElement);
characterNamesContainer.appendChild(boyNameElement);

// Add container to body
document.body.appendChild(characterNamesContainer);

// =============================================================================
// CLICK HINT
// =============================================================================

// Create click hint element
const clickHint = document.createElement('div');
clickHint.className = 'click-hint';
clickHint.innerHTML = hintText;
document.body.appendChild(clickHint);

// Hide hint after 5 seconds or when clicked
setTimeout(() => {
  clickHint.classList.add('hidden');
  setTimeout(() => {
    if (clickHint.parentNode) {
      clickHint.remove();
    }
  }, 500);
}, 5000);

// Hide hint immediately when clicked anywhere
document.addEventListener('click', function hideHintOnClick() {
  if (clickHint.parentNode) {
    clickHint.classList.add('hidden');
    setTimeout(() => {
      if (clickHint.parentNode) {
        clickHint.remove();
      }
    }, 500);
  }
  document.removeEventListener('click', hideHintOnClick);
}, { once: true });

// =============================================================================
// POPUP
// =============================================================================

// Create popup overlay
const popupOverlay = document.createElement('div');
popupOverlay.className = 'popup-overlay';
popupOverlay.id = 'popup-overlay';

// Create popup background with floating hearts
const popupBackground = document.createElement('div');
popupBackground.className = 'popup-background';

// Add floating hearts to popup background
for (let i = 0; i < 15; i++) {
  const heart = document.createElement('div');
  heart.className = 'popup-heart';
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.top = Math.random() * 100 + '%';
  heart.style.animationDelay = Math.random() * 10 + 's';
  popupBackground.appendChild(heart);
}

// Create popup container
const popupContainer = document.createElement('div');
popupContainer.className = 'popup-container';

// Create close button
const closeButton = document.createElement('button');
closeButton.className = 'popup-close';
closeButton.innerHTML = '×';
closeButton.onclick = function() {
  popupOverlay.classList.remove('show');
};

// Create photo container (Polaroid style) - only if popupImage is provided
let photoContainer = null;
if (popupImage) {
  photoContainer = document.createElement('div');
  photoContainer.className = 'popup-photo';
  const photoImg = document.createElement('img');
  photoImg.src = popupImage;
  photoImg.alt = 'Popup Image';
  photoContainer.appendChild(photoImg);
  console.log('📷 Popup image added:', popupImage);
} else {
  console.log('ℹ️ No popup image - skipping photo container');
}

// Create content container
const contentContainer = document.createElement('div');
contentContainer.className = 'popup-content';

// Create title
const title = document.createElement('h2');
title.className = 'popup-title';
title.innerHTML = popupTitle;

// Hide title if it matches the specific text (legacy feature)
// if (popupTitle === 'Chúc Anh yêu sinh nhật vui vẻ 💞') {
//   title.style.display = 'none';
//   console.log('🔒 Hiding popup title - matches hidden pattern');
// }

// Create message
const message = document.createElement('p');
message.className = 'popup-message';
const fullMessage = popupMessage;

// Typewriter effect function
function typewriterEffect(element, text, speed = 50) {
  let index = 0;
  element.textContent = '';
  element.classList.add('typing');

  const timer = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(timer);
      element.classList.remove('typing');
    }
  }, speed);

  return timer;
}

// Store timer reference for cleanup
let typewriterTimer = null;

// Append all elements
contentContainer.appendChild(title);
contentContainer.appendChild(message);

popupContainer.appendChild(closeButton);
// Only append photo container if it exists
if (photoContainer) {
  popupContainer.appendChild(photoContainer);
}
popupContainer.appendChild(contentContainer);

popupOverlay.appendChild(popupBackground);
popupOverlay.appendChild(popupContainer);

document.body.appendChild(popupOverlay);

// Close popup when clicking outside
popupOverlay.onclick = function(e) {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove('show');
  }
};

// Function to show popup
window.showPopup = function() {
  popupOverlay.classList.add('show');

  // Clear any existing timer
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
  }

  // Start typewriter effect after a short delay
  setTimeout(() => {
    typewriterTimer = typewriterEffect(message, fullMessage, 50);
  }, 300);
};

// Function to create shooting stars
function createShootingStars() {
  const numShootingStars = 20; // Number of shooting stars

  for (let i = 0; i < numShootingStars; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';

    // Random starting positions (top-right area for diagonal movement)
    const startX = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.2);
    const startY = Math.random() * (window.innerHeight * 0.3);

    shootingStar.style.left = startX + 'px';
    shootingStar.style.top = startY + 'px';

    // Random animation delay (0-10 seconds)
    const delay = Math.random() * 10;
    shootingStar.style.animationDelay = delay + 's';

    // Add some size variation
    const size = 3 + Math.random() * 3; // 3-6px
    shootingStar.style.width = size + 'px';
    shootingStar.style.height = size + 'px';

    shootingStarsContainer.appendChild(shootingStar);
  }

  console.log(`Created ${numShootingStars} shooting stars`);
}

// Initialize flying hearts when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeFlyingHearts();
    createShootingStars();
  });
} else {
  initializeFlyingHearts();
  createShootingStars();
}

// =============================================================================
// MAIN SCRIPT LOADING
// =============================================================================

// Load the main Three.js heart animation script
const mainScript = document.createElement("script");
mainScript.type = "module";
mainScript.src = "./assets/scripts.js?v=" + new Date().getTime();
document.head.appendChild(mainScript);

// =============================================================================
// SECURITY & ANTI-DEBUGGING FEATURES
// =============================================================================

// Prevent common developer tools shortcuts
document.addEventListener("keydown", function (event) {
  // Block F12 (DevTools)
  if (
    "F12" === event.key ||
    // Block Ctrl+Shift+I/J (Inspect Element/Console)
    (event.ctrlKey &&
      event.shiftKey &&
      ("I" === event.key || "J" === event.key)) ||
    // Block Ctrl+U (View Source)
    (event.ctrlKey && "U" === event.key)
  ) {
    event.preventDefault();
  }
});

// // Prevent right-click context menu
// document.addEventListener("contextmenu", function (event) {
//   event.preventDefault();
// });

// =============================================================================
// DEVELOPER TOOLS DETECTION
// =============================================================================

// let isDevToolsOpen = false;

// setInterval(() => {
//   const startTime = new Date().getTime();
//   eval("debugger;"); // This will pause if DevTools is open
//   const endTime = new Date().getTime();
//   const isDebuggerActive = endTime - startTime > 100;

//   // Show warning when DevTools is detected
//   if (isDebuggerActive && !isDevToolsOpen) {
//     isDevToolsOpen = true;
//     document.body.innerHTML = `
//       <h1 style="color:red; font-size: 28px; text-align: center; margin-top: 100px;"> 🚨 Đang mở DevTools!</h1>
//       <h1 style="color:red; font-size: 24px; text-align: center;">Nhấn F12 để đóng.</h1>
//     `;
//   }

//   // Reload page when DevTools is closed
//   if (!isDebuggerActive && isDevToolsOpen) {
//     location.reload();
//   }
// }, 1000);

// =============================================================================
// DOMAIN VALIDATION
// =============================================================================

// const authorizedDomain = "panbap.github.io";
// const currentDomain = window.location.hostname;

// // Check if running on authorized domain
// if (currentDomain !== authorizedDomain) {
//   // Clear page content if on unauthorized domain
//   document.body.innerHTML = "";

//   // Note: The original code references undefined variables 'texts', 'divs', etc.
//   // This appears to be additional obfuscation/error handling that would cause errors
//   // Keeping the domain check but removing the problematic undefined variable references
// }

// =============================================================================
// APPLICATION DATA PLACEHOLDER
// =============================================================================

// Note: The original code had some mathematical calculations with undefined variables
// These appear to be dummy calculations or additional obfuscation
// Removing them as they serve no functional purpose and would cause errors

console.log("Heart Message Application - Main entry point loaded successfully");