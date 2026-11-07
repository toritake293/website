// Sample Artwork Data (tag プロパティを追加)
const artworkData = [
  { id: 1, type: 'fanart', tag: 'コミック風', title: 'C109(冬コミ)表紙', date: '2026-11-07', src: './image/a.png' },
  { id: 2, type: 'fanart', tag: 'デフォルメ', title: 'はま寿司の思い出', date: '2026-11-03', src: './image/sushi.jpg' },
  { id: 3, type: 'fanart', tag: 'デフォルメ', title: '閉じ込めラッシュ', date: '2026-11-01',  src: './image/じゅじゅつ.jpg' },
  { id: 4, type: 'fanart', tag: 'コミック風', title: '昼メシの流儀', date: '2026-10-20',  src: './image/昼メシの流儀.jpg' },
  { id: 5, type: 'fanart', tag: 'デフォルメ', title: 'おそらのたび', date: '2026-10-20', src: './image/おジェム.jpg' },
  { id: 6, type: 'fanart', tag: 'コミック風', title: 'レゼ篇鑑賞記念', date: '2026-10-20', src: './image/DENREZE2.jpg' },
  { id: 7, type: 'fanart', tag: 'デフォルメ', title: 'いのちをすくった男', date: '2026-10-20', src: './image/江戸和田.jpg' },
  { id: 8, type: 'fanart', tag: 'コミック風', title: 'ふーみん', date: '2026-10-20', src: './image/マサルさん.jpg' },
  { id: 9, type: 'fanart', tag: 'デフォルメ', title: 'ボイラーだいばくはつ', date: '2026-10-20', src: './image/ジェームス.jpg' },
  { id: 10, type: 'fanart', tag: 'コミック風', title: 'ロックンロール', date: '2026-10-20', src: ' ./image/フェスタ (1).jpg' },
  { id: 11, type: 'fanart', tag: 'コミック風', title: '国電乗車パンチ', date: '2026-10-20', src: './image/国電3.jpg' },
  { id: 12, type: 'fanart', tag: 'コミック風', title: 'ゆかりちゃん', date: '2026-10-20', src: './image/ゆかり2.jpg' },

  { id: 16, type: 'original', tag: 'コミック風', title: 'じょうろ', date: '2026-10-20',  src: './image/zou.jpg' },
  { id: 17, type: 'original', tag: 'イラスト', title: 'オリジナル作品 #2', date: '2026-10-20',  src: 'https://placehold.co/600x600/ecfdf5/84cc16?text=Original+2' }
];

// 現在選択されているFanartタグ
let currentFanartTag = 'all';

// Page Switching (SPA Logic with History Support)
function showPage(pageId, updateHistory = true) {
  const pages = ['top', 'fanart', 'original'];
  pages.forEach(id => {
    const el = document.getElementById(`page-${id}`);
    if (el) {
      el.classList.add('hidden');
    }
  });
  
  const targetEl = document.getElementById(`page-${pageId}`);
  if (targetEl) {
    targetEl.classList.remove('hidden');
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 手動で切り替えたときだけURL履歴を更新
  if (updateHistory) {
    if (pageId === 'top') {
      history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = pageId;
    }
  }
}

// Toggle Mobile Navigation
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Dynamic Monthly Calendar Render Function (■ / □)
function renderCalendar(type, containerId, activeClass) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  let html = '';
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const dateString = `${year}-${monthStr}-${dayStr}`;

    const hasPosted = artworkData.some(a => a.type === type && a.date === dateString);

    if (hasPosted) {
      html += `<div title="${dateString} 投稿あり" class="cal-cell ${activeClass}"></div>`;
    } else {
      html += `<div title="${dateString} お休み" class="cal-cell empty"></div>`;
    }
  }
  container.innerHTML = html;
}

// Card Generator HTML Template (with Like Button and Tag Badge)
function createCard(art) {
  const savedLikes = parseInt(localStorage.getItem(`like_count_${art.id}`) || '0', 10);
  const isLiked = localStorage.getItem(`liked_${art.id}`) === 'true';

  return `
    <div class="art-card">
      <div class="art-card-img-wrapper" onclick="openModal('${art.src}', '${art.title}', '${art.date}')">
        <img src="${art.src}" alt="${art.title}" class="art-card-img" onerror="this.src='https://placehold.co/600x600/f1f5f9/94a3b8?text=Image+Not+Found'">
        ${art.isNew ? '<span class="new-tag">NEW</span>' : ''}
      </div>
      <div class="art-card-body">
        <h3 class="art-card-title" onclick="openModal('${art.src}', '${art.title}', '${art.date}')">${art.title}</h3>
        
        <div class="art-card-footer">
          <div class="art-card-meta">
            <span class="art-card-date">${art.date}</span>
            ${art.tag ? `<span class="art-tag">${art.tag}</span>` : ''}
          </div>
          
          <!-- いいねボタン -->
          <button onclick="toggleLike(event, ${art.id})" id="like-btn-${art.id}" class="like-btn ${isLiked ? 'liked' : ''}">
            <i data-lucide="heart" class="icon-sm"></i>
            <span id="like-count-${art.id}">${savedLikes}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Fanartのタグフィルター切り替え関数
function filterFanart(tag) {
  currentFanartTag = tag;

  // ボタンのアクティブ表示変更
  const buttons = document.querySelectorAll('#fanart-tag-filters .tag-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-tag') === tag) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // ギャラリーの再描画
  renderFanartGallery();
}

// Fanartギャラリー単体の描画関数
function renderFanartGallery() {
  const fanarts = artworkData.filter(a => a.type === 'fanart');
  const filteredFanarts = currentFanartTag === 'all' 
    ? fanarts 
    : fanarts.filter(a => a.tag === currentFanartTag);

  const container = document.getElementById('fanart-gallery');
  if (container) {
    if (filteredFanarts.length === 0) {
      container.innerHTML = '<p class="no-art-msg">該当する作品がありません。</p>';
    } else {
      container.innerHTML = filteredFanarts.map(createCard).join('');
    }
  }

  // アイコンの再初期化（動的生成のため）
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Populate counts, calendar, and galleries
function renderGalleries() {
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const fanarts = artworkData.filter(a => a.type === 'fanart');
  const originals = artworkData.filter(a => a.type === 'original');

  const fanartMonth = fanarts.filter(a => a.date.startsWith(currentYearMonth)).length;
  const originalMonth = originals.filter(a => a.date.startsWith(currentYearMonth)).length;

  // Update Badge Counts
  document.getElementById('top-fanart-total').innerText = fanarts.length;
  document.getElementById('top-fanart-month').innerText = fanartMonth;
  document.getElementById('top-original-total').innerText = originals.length;
  document.getElementById('top-original-month').innerText = originalMonth;

  document.getElementById('fanart-total-count').innerText = fanarts.length;
  document.getElementById('fanart-month-count').innerText = fanartMonth;
  document.getElementById('original-total-count').innerText = originals.length;
  document.getElementById('original-month-count').innerText = originalMonth;

  // Render Monthly Calendars
  renderCalendar('fanart', 'top-fanart-calendar', 'active-red');
  renderCalendar('original', 'top-original-calendar', 'active-green');

  // ギャラリー描画
  renderFanartGallery();
  document.getElementById('original-gallery').innerHTML = originals.map(createCard).join('');
}

// Modal Lightbox Handlers
function openModal(src, title, date) {
  document.getElementById('modal-img').src = src;
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-date').innerText = date;
  document.getElementById('image-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('image-modal').classList.add('hidden');
}

// Like Button Toggle Handler
function toggleLike(event, artId) {
  event.stopPropagation();

  const countEl = document.getElementById(`like-count-${artId}`);
  const btnEl = document.getElementById(`like-btn-${artId}`);
  
  let currentLikes = parseInt(localStorage.getItem(`like_count_${artId}`) || '0', 10);
  let isLiked = localStorage.getItem(`liked_${artId}`) === 'true';

  if (isLiked) {
    currentLikes = Math.max(0, currentLikes - 1);
    isLiked = false;
    btnEl.classList.remove('liked');
  } else {
    currentLikes += 1;
    isLiked = true;
    btnEl.classList.add('liked');
  }

  localStorage.setItem(`like_count_${artId}`, currentLikes);
  localStorage.setItem(`liked_${artId}`, isLiked);

  countEl.innerText = currentLikes;
}

// Hash Change Handler
function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['top', 'fanart', 'original'];
  const targetPage = validPages.includes(hash) ? hash : 'top';
  showPage(targetPage, false);
}

// Initialize on window load
window.onload = () => {
  handleHashChange();
  window.addEventListener('popstate', handleHashChange);
  renderGalleries();

  if (window.lucide) {
    lucide.createIcons();
  }
};