  // Sample Artwork Data
    const artworkData = [
      { id: 1, type: 'fanart', title: 'C109(冬コミ)表紙', date: '2026-11-07', isNew: true, src: './image/a.png' },
      { id: 2, type: 'fanart', title: 'はま寿司の思い出', date: '2026-11-03', isNew: true, src: './image/sushi.jpg' },
      { id: 3, type: 'fanart', title: '閉じ込めラッシュ', date: '2026-11-01', isNew: false, src: './image/じゅじゅつ.jpg' },
      { id: 4, type: 'fanart', title: '昼メシの流儀', date: '2026-10-20', isNew: false, src: './image/昼メシの流儀.jpg' },
      { id: 4, type: 'fanart', title: 'おそらのたび', date: '2026-10-20', isNew: false, src: './image/おジェム.jpg' },
      { id: 5, type: 'original', title: 'オリジナル作品 #1', date: '2026-11-02', isNew: true, src: 'https://placehold.co/600x600/ecfdf5/84cc16?text=Original+1' },
      { id: 6, type: 'original', title: 'オリジナル作品 #2', date: '2026-11-05', isNew: true, src: 'https://placehold.co/600x600/ecfdf5/84cc16?text=Original+2' }
    ];

    // Page Switching (SPA Logic)
    function showPage(pageId) {
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
      const daysInMonth = new Date(year, month, 0).getDate(); // Days in current month

      let html = '';
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = String(day).padStart(2, '0');
        const monthStr = String(month).padStart(2, '0');
        const dateString = `${year}-${monthStr}-${dayStr}`;

        // Check if artwork exists on this date
        const hasPosted = artworkData.some(a => a.type === type && a.date === dateString);

        if (hasPosted) {
          // Posted Day (■: Filled Color)
          html += `<div title="${dateString} 投稿あり" class="cal-cell ${activeClass}"></div>`;
        } else {
          // Rest Day (□: Empty Box)
          html += `<div title="${dateString} お休み" class="cal-cell empty"></div>`;
        }
      }
      container.innerHTML = html;
    }

    // Populate counts, calendar, and galleries
    function renderGalleries() {
      const now = new Date();
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const fanarts = artworkData.filter(a => a.type === 'fanart');
      const originals = artworkData.filter(a => a.type === 'original');

      const fanartMonth = fanarts.filter(a => a.date.startsWith(currentYearMonth)).length;
      const originalMonth = originals.filter(a => a.date.startsWith(currentYearMonth)).length;

      // Update Top Page Badge Counts
      document.getElementById('top-fanart-total').innerText = fanarts.length;
      document.getElementById('top-fanart-month').innerText = fanartMonth;
      document.getElementById('top-original-total').innerText = originals.length;
      document.getElementById('top-original-month').innerText = originalMonth;

      // Update Category Page Badge Counts
      document.getElementById('fanart-total-count').innerText = fanarts.length;
      document.getElementById('fanart-month-count').innerText = fanartMonth;
      document.getElementById('original-total-count').innerText = originals.length;
      document.getElementById('original-month-count').innerText = originalMonth;

      // Render Monthly Calendars
      renderCalendar('fanart', 'top-fanart-calendar', 'active-red');
      renderCalendar('original', 'top-original-calendar', 'active-green');

      // Card Generator HTML Template
      const createCard = (art) => `
        <div onclick="openModal('${art.src}', '${art.title}', '${art.date}')" class="art-card">
          <div class="art-card-img-wrapper">
            <img src="${art.src}" alt="${art.title}" class="art-card-img" onerror="this.src='https://placehold.co/600x600/f1f5f9/94a3b8?text=Image+Not+Found'">
            ${art.isNew ? '<span class="new-tag">NEW</span>' : ''}
          </div>
          <div class="art-card-body">
            <h3 class="art-card-title">${art.title}</h3>
            <p class="art-card-date">${art.date}</p>
          </div>
        </div>
      `;

      document.getElementById('fanart-gallery').innerHTML = fanarts.map(createCard).join('');
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

    // Initialize on window load
window.onload = () => {
      if (window.lucide) {
        lucide.createIcons();
      }

      // ★ここを追加：URLのハッシュ（#fanart など）をチェックしてページを復元する
      const hash = window.location.hash.replace('#', '');
      if (hash === 'fanart' || hash === 'original') {
        showPage(hash);
      } else {
        showPage('top');
      }

      renderGalleries();
    };

    // 戻る・進むボタンを押したときに画面を自動更新する関数
    function handleHashChange() {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['top', 'fanart', 'original'];
      
      // ハッシュが有効ならそのページ、空ならtopを表示
      const targetPage = validPages.includes(hash) ? hash : 'top';
      
      // 表示を更新（falseを渡すことで無限ループを防止）
      showPage(targetPage, false);
    }

    // showPage関数も少し修正（第2引数 updateHistory を追加）
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

      // 手動でボタンを押したときだけURL履歴を更新
      if (updateHistory) {
        if (pageId === 'top') {
          history.pushState(null, '', window.location.pathname);
        } else {
          window.location.hash = pageId;
        }
      }
    }

    // 初期化 ＆ ブラウザの戻る・進むボタンの監視
    window.onload = () => {
      if (window.lucide) {
        lucide.createIcons();
      }

      // 初回読み込み時のページ表示
      handleHashChange();

      // ★ここが重要：ブラウザの「戻る」「進む」ボタンが押されたのを検知してページを切り替える
      window.addEventListener('popstate', handleHashChange);

      renderGalleries();
    };
