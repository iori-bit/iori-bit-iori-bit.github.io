/*共通部分*/
$(function(){
  var pagetop = $('#page-top');
  pagetop.hide();
  $(window).scroll(function () {
     if ($(this).scrollTop() > 100) {
          pagetop.fadeIn();
     } else {
          pagetop.fadeOut();
     }
  });
  pagetop.click(function () {
     $('body, html').animate({ scrollTop: 0 }, 500);
     return false;
  });
});

/*header*/
let nav = document.querySelector("#navArea");
let btn = document.querySelector(".toggle-btn");
let mask = document.querySelector("#mask");
btn.onclick=()=>{nav.classList.toggle("open");};
mask.onclick=()=>{nav.classList.toggle("open");};

/*index.html*/
$(function () {
  var webStorage = function () {
    if (sessionStorage.getItem('access')) {
      $(".loading").addClass('is-active');
    } else {
      sessionStorage.setItem('access', 'true'); 
      $(".loading-animation").addClass('is-active');
      setTimeout(function () {
        $(".loading").addClass('is-active');
        $(".loading-animation").removeClass('is-active');
      }, 3000);
    }
  }
  webStorage();
});

$(document).ready(function(){
  $('.slider').slick({
    dots:true,
    arrows:true,
    prevArrow:'<div class="slick-prev"></div>',
    nextArrow:'<div class="slick-next"></div>',
    centerMode:true,
    centerPadding:"25%",
  });  
});


$(window).scroll(function(){
  var scrollAnimationElm = document.querySelectorAll('.scroll_up');
  var scrollAnimationFunc = function () {
    for (var i = 0; i < scrollAnimationElm.length; i++) {
      var triggerMargin = 100;
      if (window.innerHeight > scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin) {
        scrollAnimationElm[i].classList.add('on');
      }
    }
  }
  window.addEventListener('load', scrollAnimationFunc);
  window.addEventListener('scroll', scrollAnimationFunc);
});
/*group.html*/
function normalizeJapanese(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
    }).replace(/[\u30A1-\u30F6]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('search-box');
    const listItems = document.querySelectorAll('.list-item');

    searchBox.addEventListener('input', function() {
        const searchTerm = normalizeJapanese(this.value.toLowerCase());
        listItems.forEach(item => {
            const question = item.querySelector('.list-question');
            const answer = item.querySelector('.list-answer');
            const yomi = question.getAttribute('data-yomi');
            const normalizedText = normalizeJapanese(question.textContent.toLowerCase() + ' ' + yomi + ' ' + answer.textContent.toLowerCase());
            
            if (normalizedText.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

$(function(){
    var $btn = $('.i-btn [data-filter]'),
    $list = $('.i-list [data-category]');
    $btn.on('click', function(e) {
      e.preventDefault();                                               
    $('.group-active').removeClass('group-active')
    $(this).addClass('group-active');
      var $btnTxt = $(this).attr('data-filter');
       
      if ($btnTxt == 'all'){
        $list.fadeOut().promise().done(function() {
          $list.addClass('animate').fadeIn();
        });
      } else {
        $list.fadeOut().promise().done(function() {
          $list.filter('[data-category = "' + $btnTxt + '"]').addClass('animate').fadeIn();
       
        });
      }
      });
  });

  document.addEventListener('DOMContentLoaded', () => {
    // アコーディオンの初期化
    $(".js-accordion-title").on("click", function() {
        $(".js-accordion-title").not(this).removeClass("open");
        $(".js-accordion-title").not(this).next().slideUp(200);
        $(this).toggleClass("open");
        $(this).next().slideToggle(200);
    });

    const favoriteButtons = document.querySelectorAll('.favorite-button');
    const favoriteItemsContainer = document.getElementById('favorite-items');

    // ローカルストレージからお気に入りデータを取得
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // 初期表示のセットアップ
    setupButtons(favoriteButtons);
    updateFavoriteList();

    // お気に入りリストを更新
    function updateFavoriteList() {
        favoriteItemsContainer.innerHTML = '';
        favorites.forEach(itemId => {
            const originalItem = document.querySelector(`.item[data-item-id="${itemId}"]`);
            if (originalItem) {
                const clonedItem = originalItem.cloneNode(true);
                clonedItem.classList.add('favorite-item');
                const button = clonedItem.querySelector('.favorite-button');

                // 複製されたボタンにイベントを設定
                button.addEventListener('click', () => {
                    removeFavoriteWithFeathers(itemId, clonedItem);
                });

                // アコーディオンイベントの再設定
                setupAccordionEvents(clonedItem);

                favoriteItemsContainer.appendChild(clonedItem);
            }
        });
    }

    // アコーディオンイベントを設定
    function setupAccordionEvents(item) {
        const accordionTitles = item.querySelectorAll('.js-accordion-title');
        accordionTitles.forEach(title => {
            title.addEventListener('click', () => {
                // 他のアコーディオンを閉じる
                accordionTitles.forEach(t => {
                    if (t !== title) {
                        t.classList.remove('open');
                        if (t.nextElementSibling) {
                            $(t.nextElementSibling).slideUp(1000);
                        }
                    }
                });
                // 自身をトグル
                title.classList.toggle('open');
                const content = title.nextElementSibling;
                if (content) {
                    $(content).slideToggle(200);
                }
            });
        });
    }

    // 元のアイテムボタンをセットアップ
    function setupButtons(buttons) {
        buttons.forEach(button => {
            const itemId = button.closest('.item').getAttribute('data-item-id');
            if (favorites.includes(itemId)) {
                button.classList.add('fav-items');
            }

            button.addEventListener('click', () => {
                if (button.classList.toggle('fav-items')) {
                    addFavorite(itemId);
                } else {
                    removeFavorite(itemId);
                }
                updateFavoriteList();
            });
        });
    }

    // お気に入りに追加
    function addFavorite(itemId) {
        if (!favorites.includes(itemId)) {
            favorites.push(itemId);
            saveFavorites();
        }
    }

    // お気に入りから削除（羽アニメーション付き）
    function removeFavoriteWithFeathers(itemId, favoriteItem) {
        if (favoriteItem) {
            const rect = favoriteItem.getBoundingClientRect();
            
            for (let i = 0; i < 40; i++) { // 羽の数
                const feather = createFeather(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
                animateFeather(feather);
            }
            
            favoriteItem.remove();
        }
        
        favorites = favorites.filter(fav => fav !== itemId);
        saveFavorites();
        updateOriginalButtons();
    }

    // 通常の削除（アニメーションなし）
    function removeFavorite(itemId) {
        favorites = favorites.filter(fav => fav !== itemId);
        saveFavorites();
        updateFavoriteList();
        updateOriginalButtons();
    }

    // 元のボタンの状態を更新
    function updateOriginalButtons() {
        favoriteButtons.forEach(button => {
            const itemId = button.closest('.item').getAttribute('data-item-id');
            if (favorites.includes(itemId)) {
                button.classList.add('fav-items');
            } else {
                button.classList.remove('fav-items');
            }
        });
    }

    // ローカルストレージに保存
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // 羽を作成
    function createFeather(x, y) {
        const feather = document.createElement('img');
        feather.src = 'img/other/feather.png'; // 羽の画像パス
        feather.classList.add('feather');
        feather.style.position = 'fixed';
        feather.style.left = `${x}px`;
        feather.style.top = `${y}px`;
        document.body.appendChild(feather);
        return feather;
    }

    // 羽をアニメーション
    function animateFeather(feather) {
        const animation = feather.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.random() * 500 + 50}px, -${Math.random() * 300 + 50}px) rotate(${Math.random() * 240}deg)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => feather.remove();
    }
});

  /*time-table*/
  $(function () {
    var tabList = $('.tab-list li'),
        tabSet = $('.tab-set');
    tabSet.hide();
    $('.tab-set:first-child').show();
    tabList.click(function () {
      switchTab($(this));
    });
  
    // URLパラメータに基づいて初期タブを設定
    const urlParams = new URLSearchParams(window.location.search);
    const day = urlParams.get('day');
    if (day === '2') {
      switchTab(tabList.eq(1));
    } else {
      switchTab(tabList.eq(0));
    }
  });
  
  function switchTab(tab) {
    var tabList = $('.tab-list li'),
        tabSet = $('.tab-set');
    tabList.removeClass('is-active');
    tab.addClass('is-active');
    var index = tabList.index(tab);
    tabSet.hide();
    tabSet.eq(index).fadeIn();
    addTimeLine(); // タブ切り替え時に時間線を更新
    highlightGroup(); // タブ切り替え時にも団体のハイライトを適用
  }
  
  function addTimeLine() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
  
    const tables = document.querySelectorAll('.tableBox table');
    tables.forEach(table => {
      const rows = table.querySelectorAll('tbody tr');
      let lastRowTime = 0;
  
      // 既存の時間線を削除
      const existingLines = table.parentNode.querySelectorAll('.time-line');
      existingLines.forEach(line => line.remove());
  
      // 最後の行の時間を取得
      const lastTimeCell = rows[rows.length - 1].querySelector('th');
      const [lastHours, lastMinutes] = lastTimeCell.textContent.split(':').map(Number);
      lastRowTime = lastHours * 60 + lastMinutes;
  
      if (currentTime < lastRowTime) {
        // 現在時刻がスケジュール内の場合
        for (let i = 0; i < rows.length; i++) {
          const timeCell = rows[i].querySelector('th');
          const [rowHours, rowMinutes] = timeCell.textContent.split(':').map(Number);
          const rowTime = rowHours * 60 + rowMinutes;
  
          if (currentTime < rowTime) {
            const prevRow = i > 0 ? rows[i - 1] : null;
            const prevTime = prevRow ? getPrevTime(prevRow) : 0;
            const percentage = (currentTime - prevTime) / (rowTime - prevTime);
            const top = prevRow ? prevRow.offsetTop + percentage * (rows[i].offsetTop - prevRow.offsetTop) : rows[i].offsetTop * percentage;
  
            addLine(table, top, 'current', formatTime(hours, minutes));
            break;
          }
        }
      } else {
        // 全ての時間が過ぎている場合、最後の行の下に線を引く
        addLine(table, rows[rows.length - 1].offsetTop + rows[rows.length - 1].offsetHeight, 'past');
      }
    });
  }
  
  function getPrevTime(row) {
    const timeCell = row.querySelector('th');
    const [hours, minutes] = timeCell.textContent.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  function addLine(table, top, type, time) {
    const line = document.createElement('div');
    line.className = 'time-line ' + type;
    line.style.position = 'absolute';
    line.style.left = '0';
    line.style.right = '0';
    line.style.top = `${top}px`;
    line.style.height = '2px';
    line.style.backgroundColor = type === 'current' ? 'red' : 'blue';
    line.style.zIndex = '1000';
  
    if (type === 'current') {
      const marker = document.createElement('div');
      marker.className = 'time-marker';
      marker.textContent = time;
      marker.style.position = 'absolute';
      marker.style.left = '-30px';
      marker.style.top = '-9px';
      marker.style.backgroundColor = 'red';
      marker.style.color = 'white';
      marker.style.padding = '2px 5px';
      marker.style.borderRadius = '3px';
      marker.style.fontSize = '12px';
      marker.style.whiteSpace = 'nowrap';
      line.appendChild(marker);
    }
  
    table.parentNode.style.position = 'relative';
    table.parentNode.appendChild(line);
  }
  
  function formatTime(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function highlightGroup() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupName = urlParams.get('highlight');
    
    if (groupName) {
      const decodedGroupName = decodeURIComponent(groupName);
      const cells = document.querySelectorAll('.tableBox td');
      cells.forEach(cell => {
        if (cell.textContent.includes(decodedGroupName)) {
            cell.style.backgroundColor = 'rgba(173, 216, 230, 0.8)';
          cell.style.transition = 'background-color 0.5s';
          
          // スクロール位置の調整
          setTimeout(() => {
            cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      });
    }
  }
  
  // 初期化
  addTimeLine();
  highlightGroup();
  
  // 1分ごとに更新
  setInterval(addTimeLine, 60000);
  
  // DOMの読み込みが完了したら実行
  document.addEventListener('DOMContentLoaded', () => {
    addTimeLine();
    highlightGroup();
  });
  

  
/*maps*/
document.addEventListener('DOMContentLoaded', function() {
    const maps = document.querySelectorAll('.campus-map');
    const searchInput = document.getElementById('area-search');
    const suggestionBox = document.createElement('div');
    suggestionBox.id = 'suggestion-box';

    const areas = {
        "f1,F1、f-1,F-1": "F-1",
        "f2,F2、f-2,F-2": "F-2",
        "f3,F3、f-3,F-3": "F-3",
        "f4,F4、f-4,F-4": "F-4",
        "f5,F5、f-5,F-5": "F-5",
        "f6,F6、f-6,F-6": "F-6",
        "f7,F7、f-7,F-7": "F-7",
        "f8,F8、f-8,F-8": "F-8",
        "f9,F9、f-9,F-9": "F-9",
        "j1,J1、j-1,J-1": "J-1",
        "j2,J2、j-2,J-2": "J-2",
        "j3,J3、j-3,J-3": "J-3",
        "j4,J4、j-4,J-4": "J-4",
        "j5,J5、j-5,J-5": "J-5",
        "j6,J6、J-6,J-6": "J-6",
        "j7,J7、j-7,J-7": "J-7",
        "j8,J8、j-8,J-8": "J-8",
        "j9,J9、j-9,J-9": "J-9",
        "s1,S1、s-1,S-1": "S-1",
        "s2,S2、s-2,S-2": "S-2",
        "s3,S3、s-3,S-3": "S-3",
        "s4,S4、s-4,S-4": "S-4",
        "s5,S5、s-5,S-5": "S-5",
        "s6,S6、s-6,S-6": "S-6",
        "s7,S7、s-7,S-7": "S-7",
        "s8,S8、s-8,S-8": "S-8",
        "s9,S9、s-9,S-9": "S-9",
        "ばすけっとぼーるぶ(もぎ)": "バスケットボール部(模擬)",
        "はんどぼーるぶ(もぎ)": "ハンドボール部(模擬)",
        "こうしきてにすぶ(もぎ)": "硬式テニス部(模擬)",
        "すいえきょうぎぶ(もぎ)": "水泳競技部(模擬)",
        "たっきゅうぶ(もぎ)": "卓球部(模擬)",
        "りくじょうきょうぎぶ(もぎ)": "陸上競技部(模擬)",
        "やきゅうぶ(もぎ)": "野球部(模擬)",
        "きゅうどうぶ(1)(もぎ)": "弓道部(1)(模擬)",
        "きゅうどうぶ(2)(もぎ)": "弓道部(2)(模擬)",
        "あーちぇりーぶ(もぎ)": "アーチェリー部(模擬)",
        "けんどうぶ(もぎ)": "剣道部(模擬)",
        "りょうりぶ(もぎ)": "料理部(模擬)",
        "そふとてにすぶ(もぎ)": "ソフトテニス部(模擬)",
        "かがくぶ(もぎ)": "化学部(模擬)",
        "しゃしんぶ(もぎ)": "写真部(模擬)",
        "しょどうぶ(もぎ)": "書道部(模擬)",
        "せいぶつぶ(もぎ)": "生物部(模擬)",
        "ばれーぼーるぶ(もぎ)": "バレーボール部(模擬)",
        "びじゅつぶ(もぎ)": "美術部(模擬)",
        "ろぼっとけんきゅうぶ(もぎ)": "ロボット研究部(模擬)",
        "さどうぶ(もぎ)": "茶道部(模擬)",

        "すいえいきょうぎぶ": "水絵競技部(展示)",
        "しょどうぶ(1)": "書道部(1)(展示)",
        "かがくぶ": "化学部(展示)",
        "かどうぶ": "華道部(展示)",
        "おぐらひゃくにんいっしゅぶ": "小倉百人一首部(展示)",
        "ちがくぶ": "地学部(展示)",
        "しゃしんぶ": "写真部(展示)",
        "しょどうぶ(2)": "書道部(2)(展示)",
        "いーえすえすぶ": "ESS部(展示)",
        "いごしょうぎぶ": "囲碁将棋部(展示)",
        "じんけんぶんかけんきゅうかい": "人権文化研究会(展示)",
        "すうがくけんきゅうかい": "数学研究会(展示)",
        "ぶんげいぶ": "文芸部(展示)",
        "てつどうあいこうかい": "鉄道愛好会(展示)",
        "かていくらぶ": "家庭クラブ(展示)",
        "せいぶつぶ": "生物部(展示)",
        "びじゅつぶ": "美術部(展示)",
        "ろぼっとけんきゅうぶ": "ロボット研究部(展示)",

        "すいそうがくぶ": "吹奏楽部",
        "こーらすぶ": "コーラス部",
        "ほうがくぶ": "邦楽部",
        "だんすぶ": "ダンス部",
        "ぎたーまんどりんぶ": "ギターマンドリン部",
        "たんきゅうおんがく": "探求音楽",
        "けいおんがくぶ": "軽音楽部",
    };

    const areaIds = {
        "F-1": "gym",
        "F-2": "gym",
        "F-3": "gym",
        "F-4": "gym",
        "F-5": "gym",
        "F-6": "gym",
        "F-7": "gym",
        "F-8": "gym",
        "F-9": "gym",
        "J-1": "J1",
        "J-2": "J-2",
        "J-3": "J-3",
        "J-4": "J-4",
        "J-5": "J-5",
        "J-6": "J-6",
        "J-7": "J-7",
        "J-8": "J-8",
        "J-9": "J-9",
        "S-1": "japanese-archery1",
        "S-2": "S-7",
        "S-3": "S-3",
        "S-4": "S-4",
        "S-5": "kendo",
        "S-6": "cook",
        "S-7": "S-7",
        "S-8": "S-4",
        "S-9": "S-3",
       
        "バスケットボール部(模擬)":"swimming",
        "ハンドボール部(模擬)":"handball",
        "硬式テニス部(模擬)":"tennis",
        "水泳競技部(模擬)":"swimming",
        "卓球部(模擬)":"handball",
        "陸上競技部(模擬)":"tennis",
        "野球部(模擬)":"baseball",
        "弓道部(1)(模擬)":"japanese-archery2",
        "弓道部(2)(模擬)":"japanese-archery1",
        "アーチェリー部(模擬)":"archery",
        "剣道部(模擬)":"kendo",
        "料理部(模擬)":"cook",
        "ソフトテニス部(模擬)":"softtennis",
        "化学部(模擬)":"chemistry",
        "写真部(模擬)":"picuture",
        "書道部(模擬)":"calligraphy",
        "生物部(模擬)":"biology",
        "バレーボール部(模擬)":"vollyball",
        "美術部(模擬)":"art",
        "ロボット研究部(模擬)":"robot",
        "茶道部(模擬)":"tea",

        "水絵競技部(展示)":"pool",
        "書道部(1)(展示)":"yard",
        "化学部(展示)":"chemistry",
        "華道部(展示)":"flowerarrangement",
        "小倉百人一首部(展示)":"HyakuninIsshu",
        "地学部(展示)":"geology",
        "写真部(展示)":"picture",
        "書道部(2)(展示)":"calligraphy",
        "ESS部(展示)":"ess",
        "囲碁将棋部(展示)":"Go",
        "人権文化研究会(展示)":"train",
        "数学研究会(展示)":"math",
        "文芸部(展示)":"Literature",
        "鉄道愛好会(展示)":"train",
        "家庭クラブ(展示)":"homeeconomics",
        "生物部(展示)":"biology",
        "美術部(展示)":"art",
        "ロボット研究部(展示)":"robot",
        
        "吹奏楽部":"gym",
        "コーラス部":"gym",
        "邦楽部":"gym",
        "ダンス部":"gym",
        "ギターマンドリン部":"gym",
        "探求音楽":"gym",
        "軽音楽部":"gym",
    };

    const areaImages = {
        "F-1": "img/groups/f1.png",
        "F-2": "img/groups/f2.png",
        "F-3": "img/groups/f3.png",
        "F-4": "img/groups/f4.png",
        "F-5": "img/groups/f5.png",
        "F-6": "img/groups/f6.png",
        "F-7": "img/groups/f7.png",
        "F-8": "img/groups/f8.png",
        "F-9": "img/groups/f9.png",
        "J-1": "img/groups/j1.png",
        "J-2": "img/groups/j2.png",
        "J-3": "img/groups/j3.png",
        "J-4": "img/groups/j4.png",
        "J-5": "img/groups/j5.png",
        "J-6": "img/groups/j6.png",
        "J-7": "img/groups/j7.png",
        "J-8": "img/groups/j8.png",
        "J-9": "img/groups/j9.png",
        "S-1": "img/groups/s1.png",
        "S-2": "img/groups/s2.png",
        "S-3": "img/groups/s3.png",
        "S-4": "img/groups/s4.png",
        "S-5": "img/groups/s5.png",
        "S-6": "img/groups/s6.png",
        "S-7": "img/groups/s7.png",
        "S-8": "img/groups/s8.png",
        "S-9": "img/groups/s9.png",

        "バスケットボール部(模擬)":"img/groups/club1.png",
        "ハンドボール部(模擬)":"img/groups/club2.png",
        "硬式テニス部(模擬)":"img/groups/club3.png",
        "水泳競技部(模擬)":"img/groups/club4.png",
        "卓球部(模擬)":"img/groups/club5.png",
        "陸上競技部(模擬)":"img/groups/club6.png",
        "野球部(模擬)":"img/groups/club7.png",
        "弓道部(1)(模擬)":"img/groups/club9.png",
        "弓道部(2)(模擬)":"img/groups/club10.png",
        "アーチェリー部(模擬)":"img/groups/club8.png",
        "剣道部(模擬)":"img/groups/club11.png",
        "料理部(模擬)":"img/groups/club12.png",
        "ソフトテニス部(模擬)":"img/groups/club14.png",
        "化学部(模擬)":"img/groups/club15.png",
        "写真部(模擬)":"img/groups/club14.png",
        "書道部(模擬)":"img/groups/club17.png",
        "生物部(模擬)":"img/groups/club16.png",
        "バレーボール部(模擬)":"img/groups/club18.png",
        "美術部(模擬)":"img/groups/club19.png",
        "ロボット研究部(模擬)":"img/footer/roboken.png",
        "茶道部(模擬)":"img/groups/club20.png",

        "水絵競技部(展示)":"img/groups/club21.png",
        "書道部(1)(展示)":"img/groups/club22.png",
        "化学部(展示)":"img/groups/club23.png",
        "華道部(展示)":"img/groups/club24.png",
        "小倉百人一首部(展示)":"img/groups/club25.png",
        "地学部(展示)":"img/groups/club26.png",
        "写真部(展示)":"img/groups/club27.png",
        "書道部(2)(展示)":"img/groups/club28.png",
        "ESS部(展示)":"img/groups/club29.png",
        "囲碁将棋部(展示)":"img/groups/club30.png",
        "人権文化研究会(展示)":"img/groups/club31.png",
        "数学研究会(展示)":"img/groups/club32.png",
        "文芸部(展示)":"img/groups/club33.png",
        "鉄道愛好会(展示)":"img/groups/club34.png",
        "家庭クラブ(展示)":"img/groups/club45.png",
        "生物部(展示)":"img/groups/club35.png",
        "美術部(展示)":"img/groups/club36.png",
        "ロボット研究部(展示)":"img/footer/roboken.png",
        
        "吹奏楽部":"img/groups/club38.png",
        "コーラス部":"img/groups/club39.png",
        "邦楽部":"img/groups/club40.png",
        "ダンス部":"img/groups/club41.png",
        "ギターマンドリン部":"img/groups/club42.png",
        "探求音楽":"img/groups/club43.png",
        "軽音楽部":"img/groups/club44.png",
        
    };

        function createAreaOverlays(map) {
            const mapImage = map.querySelector('img');
            const areaOverlays = map.querySelector('.area-overlays');
            const areas = map.querySelectorAll('area');
    
            areaOverlays.innerHTML = '';
            areas.forEach(area => {
                const coords = area.getAttribute('coords').split(',').map(Number);
                const overlay = document.createElement('div');
                overlay.className = 'area-overlay';
                updateOverlayPosition(overlay, coords, mapImage);
                overlay.setAttribute('data-area', area.getAttribute('data-area'));
                areaOverlays.appendChild(overlay);
            });
        }
    
        function updateOverlayPosition(overlay, coords, mapImage) {
            const scaleX = mapImage.width / mapImage.naturalWidth;
            const scaleY = mapImage.height / mapImage.naturalHeight;
            overlay.style.left = `${coords[0] * scaleX}px`;
            overlay.style.top = `${coords[1] * scaleY}px`;
            overlay.style.width = `${(coords[2] - coords[0]) * scaleX}px`;
            overlay.style.height = `${(coords[3] - coords[1]) * scaleY}px`;
        }
    
        function highlightArea(areaName) {
            document.querySelectorAll('.area-overlay').forEach(overlay => {
                overlay.classList.remove('highlight');
                if (overlay.getAttribute('data-area') === areaName) {
                    overlay.classList.add('highlight');
                }
            });
        }
    
        function updateAllOverlays() {
            maps.forEach(map => {
                const mapImage = map.querySelector('img');
                map.querySelectorAll('.area-overlay').forEach(overlay => {
                    const area = map.querySelector(`area[data-area="${overlay.getAttribute('data-area')}"]`);
                    if (area) {
                        const coords = area.getAttribute('coords').split(',').map(Number);
                        updateOverlayPosition(overlay, coords, mapImage);
                    }
                });
            });
        }
    
        function searchArea(query) {
            const suggestions = [];
            for (const [hiragana, kanji] of Object.entries(areas)) {
                if (hiragana.includes(query) || kanji.includes(query)) {
                    suggestions.push(kanji);
                }
            }
            return suggestions;
        }
    
        function scrollToMap(areaId) {
            const targetElement = document.querySelector(`[data-area="${areaId}"]`);
            if (targetElement) {
                const mapContainer = targetElement.closest('.map-container');
                mapContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    
        function showSuggestions(query) {
            if (query.trim() === '') {
                suggestionBox.innerHTML = '';
                return;
            }
    
            const suggestions = searchArea(query);
            suggestionBox.innerHTML = '';
    
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
    
                const image = document.createElement('img');
                image.src = areaImages[suggestion];
                image.alt = suggestion;
                image.className = 'suggestion-image';
    
                const text = document.createElement('span');
                text.textContent = suggestion;
                text.className = 'suggestion-text';
    
                suggestionItem.appendChild(image);
                suggestionItem.appendChild(text);
    
                suggestionItem.addEventListener('click', function() {
                    const areaId = areaIds[suggestion];
                    highlightArea(areaId);
                    searchInput.value = suggestion;
                    suggestionBox.innerHTML = '';
                    scrollToMap(areaId);
                });
    
                suggestionBox.appendChild(suggestionItem);
            });
        }
    
        maps.forEach(createAreaOverlays);
    
        const urlParams = new URLSearchParams(window.location.search);
        const selectedArea = urlParams.get('area');
        if (selectedArea) {
            highlightArea(selectedArea);
            scrollToMap(selectedArea);
        }
    
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 100);
            }
        }
    
        searchInput.addEventListener('input', function() {
            showSuggestions(this.value);
        });
    
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                suggestionBox.innerHTML = '';
            }, 200);
        });
    
        window.addEventListener('resize', updateAllOverlays);
    
        maps.forEach(map => {
            const mapImage = map.querySelector('img');
            mapImage.addEventListener('load', () => createAreaOverlays(map));
        });
    
        searchInput.parentNode.appendChild(suggestionBox);
    });
    

/*show*/
function createShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    
    const width = Math.random() * 1 + 0.5;
    const height = Math.random() * 100 + 50;
    const duration = Math.random() * 3 + 2;
    
    star.style.width = `${width}px`;
    star.style.height = `${height}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${duration}s`;
    
    return star;
}

function addShootingStars() {
    const container = document.getElementById('starContainer');
    for (let i = 0; i < 20; i++) {
        const star = createShootingStar();
        container.appendChild(star);
        
        star.addEventListener('animationend', () => {
            star.remove();
            container.appendChild(createShootingStar());
        });
    }
}

function handleScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= windowHeight * 0.75) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('h1');
    const chars = title.querySelectorAll('span');
    
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.1}s`;
    });

    addShootingStars();
});
