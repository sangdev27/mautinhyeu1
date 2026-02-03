const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stars = [];
const explosions = [];
const shootingStars = [];
// fullText cÃ³ thá»ƒ Ä‘Æ°á»£c thay Ä‘á»•i bá»Ÿi load-valentine-data.js
let fullText = ["Happy Valentine", "vợ yêu"];
// Expose Ä‘á»ƒ load-valentine-data.js cÃ³ thá»ƒ thay Ä‘á»•i
if (typeof window !== 'undefined') {
    window.fullText = fullText;
}
const fontFamily = "Arial";

// Calculate responsive fontSize based on screen width
function getResponsiveFontSize() {
  const isMobileLandscape = window.innerWidth <= 1024 && window.innerHeight < window.innerWidth;
  return isMobileLandscape ? 60 : 100; // Smaller on mobile landscape
}

function getResponsiveLineHeight() {
  const fontSize = getResponsiveFontSize();
  return fontSize * 1.2; // lineHeight = fontSize * 1.2
}

let fontSize = getResponsiveFontSize();
let lineHeight = getResponsiveLineHeight();
const bearX = 70;
let bearY = canvas.height - 80;
let dots = [];
let targetDotsQueue = [];
let currentCharIndex = 0;
let animationDone = false;
let introFinishedOnce = false;
let bookMode = false;
let shootIntervalId = null;
let rafId = null;
var buttonShowFallbackTimer = null; // Hiá»‡n nÃºt tá»‘i Ä‘a sau vÃ i giÃ¢y náº¿u dot chÆ°a "á»•n Ä‘á»‹nh"

function showOpenBookButton() {
  if (buttonShowFallbackTimer) {
    clearTimeout(buttonShowFallbackTimer);
    buttonShowFallbackTimer = null;
  }
  var btn = document.getElementById('openBookBtn');
  if (!btn) return;
  btn.style.display = 'flex';
  btn.style.opacity = '0';
  requestAnimationFrame(function() {
    btn.style.transition = 'opacity 0.5s ease';
    btn.style.opacity = '1';
  });
  btn.onclick = function() {
    enterBookMode();
  };
  btn.ontouchend = function(e) {
    e.preventDefault();
    enterBookMode();
  };
}

function enterBookMode() {
  if (bookMode) return;
  bookMode = true;
  var openBookBtn = document.getElementById('openBookBtn');
  if (openBookBtn) {
    openBookBtn.style.opacity = '0';
    openBookBtn.style.pointerEvents = 'none';
  }
  document.body.classList.add('book-mode');

  // Dá»«ng cÃ¡c loop animation Ä‘á»ƒ "xÃ³a" hiá»‡u á»©ng tim-ghÃ©p-chá»¯ (CPU nháº¹ hÆ¡n)
  if (shootIntervalId) {
    clearInterval(shootIntervalId);
    shootIntervalId = null;
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  // áº¨n canvas luÃ´n (ná»n intro váº«n giá»¯ video + png)
  if (canvas) canvas.style.display = 'none';

  // Hiá»‡n cuá»‘n sÃ¡ch
  const secondScreen = document.getElementById('secondScreen');
  const bookContent = document.querySelector('.book-content');
  if (secondScreen) {
    secondScreen.classList.add('is-visible');
    secondScreen.setAttribute('aria-hidden', 'false');
  }
  // Cho bÃ¬a váº½ xong rá»“i má»›i hiá»‡n cÃ¡c tá» bÃªn trong, trÃ¡nh chá»›p trang chá»¯/áº£nh
  if (bookContent) {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        bookContent.classList.add('ready');
      });
    });
  }

  // Khá»Ÿi táº¡o page indicator (0 láº§n láº­t - chá»‰ má»Ÿ bÃ¬a, chÆ°a hiá»‡n indicator)
  setTimeout(function(){
    if (typeof updatePageIndicator === 'function') {
      updatePageIndicator(0);
    }
  }, 600);
}

// Load heart image with cache busting
const heartImage = new Image();
let heartImageLoaded = false;
const heartImagePath = "../assets/images/intro/heart_intro.png";
const heartCacheBuster = "?v=" + new Date().getTime();
heartImage.src = heartImagePath + heartCacheBuster;

heartImage.onload = function() {
  heartImageLoaded = true;
  // Show content after heart image is loaded
  showContent();
};

heartImage.onerror = function() {
  console.error('Failed to load heart image');
  // Still allow animation to proceed with emoji fallback
  heartImageLoaded = true;
  showContent();
};

function showContent() {
  const canvas = document.getElementById('canvas');
  const bear = document.getElementById('bear');
  const leftCupid = document.getElementById('leftCupid');
  const rightCupid = document.getElementById('rightCupid');
  const doubleHeart = document.getElementById('doubleHeart');
  const leftBottom = document.getElementById('leftBottom');
  const rightBottom = document.getElementById('rightBottom');
  
  if (canvas) canvas.classList.add('loaded');
  if (bear) bear.classList.add('loaded');
  if (leftCupid) leftCupid.classList.add('loaded');
  if (rightCupid) rightCupid.classList.add('loaded');
  if (doubleHeart) doubleHeart.classList.add('loaded');
  if (leftBottom) leftBottom.classList.add('loaded');
  if (rightBottom) rightBottom.classList.add('loaded');
}

var readyOverlayDismissed = false;

function dismissReadyOverlay() {
  if (readyOverlayDismissed) return;
  readyOverlayDismissed = true;
  var overlay = document.getElementById("readyToStartOverlay");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.4s ease";
    setTimeout(function() {
      overlay.style.display = "none";
    }, 400);
  }
  // PhÃ¡t nháº¡c khi user Ä‘Ã£ tÆ°Æ¡ng tÃ¡c (trÃ¡nh browser cháº·n autoplay)
  window.userHasClickedReady = true;
  if (window.backgroundMusic) {
    window.backgroundMusic.play().catch(function(err) {
      console.warn("[Ready] KhÃ´ng thá»ƒ phÃ¡t nháº¡c:", err);
    });
  }
  // Reset intro vÃ  báº¯t Ä‘áº§u hiá»‡u á»©ng báº¯n tim tá»« Ä‘áº§u
  resetIntro();
  startAnimation();
}

function checkOrientation() {
  // Khi Ä‘Ã£ vÃ o book mode thÃ¬ khÃ´ng hiá»‡n rotate notice/ready overlay ná»¯a
  if (bookMode) return;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isPortrait = window.innerHeight > window.innerWidth;

  const notice = document.getElementById("rotateNotice");
  const readyOverlay = document.getElementById("readyToStartOverlay");
  const video = document.getElementById("backgroundVideo");
  const leftCupid = document.getElementById("leftCupid");
  const rightCupid = document.getElementById("rightCupid");
  const doubleHeart = document.getElementById("doubleHeart");
  const leftBottom = document.getElementById("leftBottom");
  const rightBottom = document.getElementById("rightBottom");

  if (isMobile && isPortrait) {
    notice.style.display = "block";
    if (readyOverlay) readyOverlay.style.display = "none";
    canvas.style.display = "none";
    document.getElementById("bear").style.display = "none";
    if (video) video.style.display = "none";
    if (leftCupid) leftCupid.style.display = "none";
    if (rightCupid) rightCupid.style.display = "none";
    if (doubleHeart) doubleHeart.style.display = "none";
    if (leftBottom) leftBottom.style.display = "none";
    if (rightBottom) rightBottom.style.display = "none";
  } else {
    notice.style.display = "none";
    canvas.style.display = "block";
    document.getElementById("bear").style.display = "block";
    if (video) video.style.display = "block";
    if (leftCupid) leftCupid.style.display = "block";
    if (rightCupid) rightCupid.style.display = "block";
    if (doubleHeart) doubleHeart.style.display = "block";
    if (leftBottom) leftBottom.style.display = "block";
    if (rightBottom) rightBottom.style.display = "block";
    // Khi Ä‘Ã£ xoay ngang: hiá»‡n overlay Sáºµn sÃ ng (trá»« khi user Ä‘Ã£ báº¥m rá»“i)
    if (readyOverlay && !readyOverlayDismissed) {
      readyOverlay.style.display = "flex";
      readyOverlay.style.opacity = "1";
    }
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  bearY = canvas.height - 80;

  // Stars removed - using simple pink background
  checkOrientation();

  // Update responsive fontSize and lineHeight
  fontSize = getResponsiveFontSize();
  lineHeight = getResponsiveLineHeight();

  targetDotsQueue = [];
  currentCharIndex = 0;
  animationDone = false;
  generateAllTargetDots();
}

function resetIntro() {
  if (bookMode) return;
  if (buttonShowFallbackTimer) {
    clearTimeout(buttonShowFallbackTimer);
    buttonShowFallbackTimer = null;
  }
  animationDone = false;
  dots = [];
  explosions.length = 0;
  introFinishedOnce = false;
  var openBookBtn = document.getElementById('openBookBtn');
  if (openBookBtn) {
    openBookBtn.style.display = 'none';
    openBookBtn.style.opacity = '0';
  }
  var bear = document.getElementById('bear');
  if (bear) {
    bear.src = "../assets/images/intro/shooting_heart.gif";
    delete bear.dataset.changed;
  }
  // KhÃ´ng gá»i scheduleBearChange() á»Ÿ Ä‘Ã¢y ná»¯a
  resizeCanvas();
}

var resizeDebounceTimer = null;
function onResizeOrOrientation() {
  if (bookMode) return;
  clearTimeout(resizeDebounceTimer);
  resizeDebounceTimer = setTimeout(function() {
    resetIntro();
  }, 150);
}

resizeCanvas();
window.addEventListener('resize', onResizeOrOrientation);
window.addEventListener('orientationchange', onResizeOrOrientation);

// Setup nÃºt Sáºµn sÃ ng (trÃ¡nh browser cháº·n nháº¡c autoplay)
(function setupReadyButton() {
  var btn = document.getElementById("readyToStartBtn");
  if (btn) {
    btn.onclick = function() { dismissReadyOverlay(); };
    btn.ontouchend = function(e) { e.preventDefault(); dismissReadyOverlay(); };
  }
})();

function createExplosion(x, y) {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    explosions.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
      opacity: 1
    });
  }
}

function drawStars() {
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha >= 1 || star.alpha <= 0) {
      star.delta = -star.delta;
    }

    ctx.save();
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = "#ffb6c1";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createShootingStar() {
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height / 2;
  shootingStars.push({
    x: startX,
    y: startY,
    length: Math.random() * 300 + 100,
    speed: Math.random() * 10 + 6,
    angle: Math.PI / 4,
    opacity: 1
  });
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const endX = s.x - Math.cos(s.angle) * s.length;
    const endY = s.y - Math.sin(s.angle) * s.length;

    const gradient = ctx.createLinearGradient(s.x, s.y, endX, endY);
    gradient.addColorStop(0, `rgba(255, 182, 193, ${s.opacity})`);
    gradient.addColorStop(1, `rgba(255, 182, 193, 0)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.opacity -= 0.01;

    if (s.opacity <= 0) {
      shootingStars.splice(i, 1);
    }
  }
}

function generateCharDots(char, x, y) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.font = `bold ${fontSize}px ${fontFamily}`;
  tempCtx.fillStyle = "#ff69b4";
  tempCtx.textAlign = "left";
  tempCtx.fillText(char, x, y);

  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  const charDots = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      if (imageData[index + 3] > 128) {
        charDots.push({ x, y });
      }
    }
  }

  return charDots;
}

function generateAllTargetDots() {
  const tempCtx = document.createElement('canvas').getContext('2d');
  tempCtx.font = `bold ${fontSize}px ${fontFamily}`;
  const lines = fullText;
  
  // Calculate total height of text container (from baseline of first line to baseline of last line)
  const totalTextHeight = (lines.length - 1) * lineHeight;
  // Center the entire text container vertically, then push down a bit
  // Baseline of first line = center of canvas - half of total text height + offset
  const verticalOffset = 10; // Push text down by 10px
  const startY = canvas.height / 2 - totalTextHeight / 2 + verticalOffset;

  lines.forEach((line, lineIndex) => {
    const lineWidth = tempCtx.measureText(line).width;
    let xCursor = (canvas.width - lineWidth) / 2;
    const y = startY + lineIndex * lineHeight;

    for (let char of line) {
      if (char === " ") {
        xCursor += tempCtx.measureText(" ").width;
        targetDotsQueue.push([]);
        continue;
      }

      const charDots = generateCharDots(char, xCursor, y);
      targetDotsQueue.push(charDots);
      xCursor += tempCtx.measureText(char).width;
    }
  });
}

function shootDot() {
  if (animationDone) return;

  while (
    currentCharIndex < targetDotsQueue.length &&
    targetDotsQueue[currentCharIndex].length === 0
  ) {
    currentCharIndex++;
  }

  const targetDots = targetDotsQueue[currentCharIndex];
  if (!targetDots || targetDots.length === 0) return;

  const batch = 10;
  for (let i = 0; i < batch; i++) {
    const target = targetDots.shift();
    if (!target) return;
    const angle = Math.random() * Math.PI / 6 - Math.PI / 12;
    const speed = 5 + Math.random() * 3;
    dots.push({
      x: bearX + 40 + Math.random() * 20,
      y: bearY - 20 + Math.random() * 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetX: target.x,
      targetY: target.y
    });
  }

  if (targetDots.length === 0 && currentCharIndex < targetDotsQueue.length - 1) {
    currentCharIndex++;
  }
  
}

function animate() {
  if (bookMode) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    const dx = dot.targetX - dot.x;
    const dy = dot.targetY - dot.y;
    dot.vx += dx * 0.005; // TÄƒng lá»±c hÆ°á»›ng tÃ¢m Ä‘á»ƒ kÃ©o vá» nhanh hÆ¡n
    dot.vy += dy * 0.005;
    dot.vx *= 0.92; // TÄƒng damping Ä‘á»ƒ giáº£m tá»‘c Ä‘á»™ nhanh hÆ¡n
    dot.vy *= 0.88;
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (heartImage.complete && heartImage.naturalWidth > 0) {
      const size = 14;
      ctx.save();
      ctx.drawImage(heartImage, dot.x - size / 2, dot.y - size / 2, size, size);
      ctx.restore();
    } else {
      // Fallback to emoji if image not loaded yet
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("â¤ï¸", dot.x, dot.y);
    }
  });

  for (let i = explosions.length - 1; i >= 0; i--) {
    const p = explosions[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.life--;
    p.opacity -= 0.015;

    ctx.globalAlpha = Math.max(p.opacity, 0);
    ctx.fillStyle = "#ff69b4";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (p.life <= 0 || p.opacity <= 0) {
      explosions.splice(i, 1);
    }
  }

  if (!animationDone && currentCharIndex >= targetDotsQueue.length) {
    var allSettled = dots.every(function (dot) {
      return Math.abs(dot.targetX - dot.x) < 18 && Math.abs(dot.targetY - dot.y) < 18;
    });
    if (allSettled) {
      animationDone = true;
      if (buttonShowFallbackTimer) {
        clearTimeout(buttonShowFallbackTimer);
        buttonShowFallbackTimer = null;
      }
      if (!introFinishedOnce) {
        introFinishedOnce = true;
        showOpenBookButton();
      }
    } else if (!buttonShowFallbackTimer) {
      // Fallback: hiá»‡n nÃºt sau tá»‘i Ä‘a 2.5s ká»ƒ tá»« lÃºc báº¯n háº¿t chá»¯, khÃ´ng cáº§n Ä‘á»£i dot dá»«ng háº³n
      buttonShowFallbackTimer = setTimeout(function () {
        buttonShowFallbackTimer = null;
        if (animationDone || introFinishedOnce) return;
        animationDone = true;
        introFinishedOnce = true;
        showOpenBookButton();
      }, 2500);
    }
  }

  rafId = requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  createExplosion(e.clientX, e.clientY);
});
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  if (touch) {
    createExplosion(touch.clientX, touch.clientY);
  }
});

// Wait for heart image to load AND overlay dismissed before starting animation
function startAnimation() {
  if (!heartImageLoaded && !heartImage.complete) {
    setTimeout(startAnimation, 50);
    return;
  }
  // Chá»‰ cháº¡y khi user Ä‘Ã£ áº¥n Sáºµn sÃ ng (trÃ¡nh cháº¡y khi overlay Ä‘ang hiá»ƒn thá»‹)
  if (!readyOverlayDismissed) {
    return;
  }
  if (shootIntervalId) return; // ÄÃ£ cháº¡y rá»“i
  
  // Chá»‰ báº¯t Ä‘áº§u timer thay Ä‘á»•i bear khi animation thá»±c sá»± báº¯t Ä‘áº§u
  scheduleBearChange();
  shootIntervalId = setInterval(shootDot, 22);
  animate();
}

// Start animation after heart image is loaded
startAnimation();

// Setup background video with cache busting
const backgroundVideo = document.getElementById("backgroundVideo");
const videoSource = document.getElementById("videoSource");
if (backgroundVideo && videoSource) {
  // Add cache busting parameter to force reload new video
  const videoPath = "../assets/background_intro.mp4";
  const cacheBuster = "?v=" + new Date().getTime();
  videoSource.src = videoPath + cacheBuster;
  
  // Force reload video
  backgroundVideo.load();
  
  backgroundVideo.addEventListener('loadeddata', () => {
    backgroundVideo.play().catch(err => {
      console.warn('Video autoplay prevented:', err);
    });
  });
  backgroundVideo.addEventListener('error', (e) => {
    console.error('Video loading error:', e);
  });

  // Cháº·n context menu (right-click)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Cháº·n long press (touch hold)
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  const LONG_PRESS_DURATION = 500; // 500ms
  const MOVE_THRESHOLD = 10; // 10px

  document.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    // Reset náº¿u di chuyá»ƒn quÃ¡ nhiá»u
    if (touchStartTime > 0) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
        touchStartTime = 0;
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    if (touchStartTime > 0) {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration >= LONG_PRESS_DURATION) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      touchStartTime = 0;
    }
  });

  // Cháº·n text selection báº±ng cÃ¡ch cháº·n cÃ¡c event liÃªn quan
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });
}

// Change bear image after shooting animation (estimate ~7s for shooting all hearts)
var bearChangeTimer = null;
function scheduleBearChange() {
  if (bearChangeTimer) clearTimeout(bearChangeTimer);
  bearChangeTimer = setTimeout(function() {
    bearChangeTimer = null;
    var bear = document.getElementById("bear");
    if (bear && !bear.dataset.changed) {
      bear.src = "../assets/images/intro/after_shooting.gif";
      bear.dataset.changed = "true";
    }
  }, 7000);  // 7000ms = 7 giÃ¢y
}