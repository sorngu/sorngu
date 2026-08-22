/* =========================================================
   lang-switch.js — 中英文切换（仿 fofofoto 风格）
   页面上带 id="langToggle" 的元素作为切换按钮；
   脚本按词典自动匹配页面文字并整体切换语言，
   选择保存在 localStorage('site_lang')，跨页面生效。
   ========================================================= */
(function () {
    var KEY_LANG = 'site_lang';

    /* 切换语言时文字淡入淡出的过渡样式（注入一次，三页共用） */
    var fadeCss = document.createElement('style');
    fadeCss.textContent = '[data-i18n]{transition:opacity 0.5s ease}' +
        'html.lang-switching [data-i18n]{opacity:0}';
    document.head.appendChild(fadeCss);

    /* ---------- 词典：英文原文(归一化) → 简体中文 ---------- */
    var DICT = {
        /* 项目标题 */
        'Binhai New District': '滨海新区',
        'Black and White': '黑白',
        'Untitled': '无题',
        'Untitled 2': '无题 2',
        'Untitled 3': '无题 3',
        'Other': '其他',

        /* 地点 / 分类 */
        'Jian Gong New Village': '建工新村',
        'Jian Gong Village': '建工村',
        "Fisherman's Port": '渔港',
        'chengdu': '成都',
        'Chengdu': '成都',
        'Tianjin': '天津',
        'Dazhou': '达州',
        'Beijing': '北京',

        /* 图片说明（Overview / Index 缩略图） */
        'Park corridor': '公园长廊',
        'Park corridor 2': '公园长廊 2',
        'Construction Village Iron Gate': '建设村铁门',
        'The corridor 3': '长廊 3',
        'Port of Entry': '港口入口',
        'The quilt by the port': '港口边的被子',
        'church': '教堂',
        'ridge': '山脊',
        'fog': '雾',
        'Ruins': '废墟',
        'Daisy': '雏菊',
        'Old building': '老建筑',
        'The entrance of the stairs': '楼梯入口',
        'Tiananmen Square': '天安门广场',
        'Munan Road': '睦南道',
        'Bao di': '宝坻',
        'The Great Hall of the People': '人民大会堂',
        'Passage': '通道',
        'Anren Theatre': '安仁剧院',
        'Corridor Angle': '走廊转角',
        'Courtyard with ancient wall': '古墙院落',
        'Old railway carriage': '旧火车车厢',
        'Zheduo Mountain 02': '折多山 02',
        'Mountain range': '山脉',
        'Dule Temple': '独乐寺',
        'Old house': '老房子',
        'kuāng': '框',
        'Water park': '水上公园',
        'Angivare': '鸽子',

        /* archive：项目信息 */
        'Tianjin, China': '中国 · 天津',
        'Chengdu, Tianjin': '成都、天津',
        'Chengdu, Dazhou, Beijing, Tianjin': '成都、达州、北京、天津',
        "The Binhai New District project documents the rapid transformation of Tianjin's coastal urban landscape. Through photography and visual archive, the work captures the tension between abandoned villages, new infrastructure, and the daily life that persists in between.":
            '滨海新区项目记录了天津滨海城市景观的快速变迁。透过摄影与视觉档案，作品捕捉了废弃村落、新建基础设施与在其间延续的日常生活之间的张力。',
        "The Jian Gong New Village, completed in 1996, saw approximately 1,200 households move out of this area in 2021, leaving behind only abandoned buildings and wild-growing plants. This area is not yet completely demolished. It retains a large number of the architectural styles of the houses from the late 20th century and the 1990s in the north. The most distinctive feature is an artificially constructed park and playground.":
            '建工新村于 1996 年建成，2021 年约有 1200 户家庭从这里搬离，只留下废弃的建筑和野蛮生长的植物。这里尚未被完全拆除，保留着大量 20 世纪末、90 年代北方民居的建筑样式，其中最特别的是一个人工修建的公园和游乐场。',
        "This residential area was previously a housing complex for the families of employees of the petroleum system. It was established to address the housing needs of the staff of Bohai Petroleum Company and related construction and engineering systems. Therefore, the early residents were mostly petroleum workers, construction engineers and their families.":
            '这个居民区曾是石油系统职工的家属大院，为解决渤海石油公司及相关建筑工程系统职工的住房需求而设立。因此，早期居民多为石油工人、建筑工程师和他们的家属。',
        "The community buildings feature distinct Soviet aesthetic elements and the industrial style of the 1970s and 1980s. Most of the buildings are multi-story brick-concrete structures. The exterior often features gray or beige prefabricated panels, and the balconies are equipped with blue plastic steel windows or iron railings.":
            '小区建筑带有鲜明的苏式审美元素和七八十年代的工业风格，多为多层砖混结构。外立面常用灰色或米色的预制板，阳台装着蓝色塑钢窗或铁栏杆。',
    
        /* about：正文段落 */
        'fotomemo is my personal photography project. I simply like taking pictures — the places I pass through, the moments that quietly touch me. This site is where I keep them all.':
            'fotomemo 是我的个人摄影项目。我只是喜欢拍照——路过的地方、悄悄打动我的瞬间，这个网站是我把它们都收好的地方。',
        'I love photography because it makes me slow down and really look. The light on a wall, a street corner about to disappear, a person lost in thought — once I press the shutter, they stay. These photographs are proof that I looked carefully, and that I lived.':
            '我喜欢摄影，因为它让我慢下来，认真地去看。墙上的光、快要消失的街角、一个出神的人——按下快门，它们就留下来了。这些照片是我认真看过、认真活过的证据。',
        'I made this website for two reasons. One is for myself: a place to store my photos and the memories attached to them, so nothing gets lost along the way. The other is the quiet hope that someone, somewhere, might see them — and pause, even for a moment.':
            '我做这个网站有两个原因。一个是为我自己：存下照片，和照片里的记忆，不让它们在路上走丢。另一个，是小小的期盼——希望有人能看到它们，哪怕只是停留一会儿。',
        'As long as I am still looking, and there are still moments worth keeping, I will continue. Thank you for taking the time to look.':
            '只要我还在看，还有想留住的瞬间，我就会继续拍下去。谢谢你花时间来看。'
    };

    /* ---------- 工具 ---------- */
    function norm(s) {
        return String(s).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    }

    var OR = {};      /* key → 英文原文（用于切回英文） */
    var tagged = [];  /* 已标记的元素列表 */

    /* 给匹配词典的“最深”元素打标记，避免父子重复替换 */
    function tagNodes() {
        var els = document.querySelectorAll('h1,h2,h3,p,span,strong,div,a,button');
        var candidates = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.id === 'langToggle' || (el.closest && el.closest('#langToggle'))) continue;
            if (el.closest && (el.closest('script') || el.closest('style'))) continue;
            var k = norm(el.textContent);
            if (k && DICT.hasOwnProperty(k)) candidates.push(el);
        }
        /* 倒序处理：文档顺序中越靠后的越深，先标记深层节点 */
        for (var j = candidates.length - 1; j >= 0; j--) {
            var c = candidates[j];
            if (c.hasAttribute('data-i18n')) continue;
            if (c.querySelector('[data-i18n]')) continue; /* 更深的节点已处理 */
            var key = norm(c.textContent);
            if (!OR.hasOwnProperty(key)) OR[key] = c.textContent;
            c.setAttribute('data-i18n', key);
            tagged.push(c);
        }
    }

    function applyLang(lang) {
        for (var i = 0; i < tagged.length; i++) {
            var el = tagged[i];
            var key = el.getAttribute('data-i18n');
            el.textContent = (lang === 'zh') ? DICT[key] : OR[key];
        }
        /* 切换按钮：英文态 = 黑色 "EN"，中文件态 = 灰色 "CN"，
           文字和颜色都随状态变，点击是否生效一眼可见 */
        var btn = document.getElementById('langToggle');
        if (btn) {
            var opt = btn.querySelector('.lt-opt');
            if (lang === 'zh') {
                btn.classList.add('is-zh');
                if (opt) opt.textContent = 'CN';
            } else {
                btn.classList.remove('is-zh');
                if (opt) opt.textContent = 'EN';
            }
        }
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    }

    function getLang() {
        try {
            var l = localStorage.getItem(KEY_LANG);
            if (l === 'zh' || l === 'en') return l;
        } catch (e) {}
        return 'en';
    }

    /* ---------- 初始化 ---------- */
    tagNodes();
    var lang = getLang();
    applyLang(lang);

    var tog = document.getElementById('langToggle');
    if (tog) {
        var switching = false;
        function doSwitch() {
            if (switching) return;   /* 动画进行中忽略重复点击 */
            switching = true;
            lang = (getLang() === 'zh') ? 'en' : 'zh';
            try { localStorage.setItem(KEY_LANG, lang); } catch (e) {}
            /* 文字先淡出 → 隐藏状态下换内容 → 再淡入 */
            document.documentElement.classList.add('lang-switching');
            setTimeout(function () {
                applyLang(lang);
                setTimeout(function () {
                    document.documentElement.classList.remove('lang-switching');
                    switching = false;
                }, 50);
            }, 500);
        }
        /* iOS Safari 对 div 等非交互元素的 click 事件派发不可靠，
           用 touchend 兜底；_handled 标记防止触屏后补发 click 造成二次切换 */
        tog.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (tog._handled) { tog._handled = false; return; }
            doSwitch();
        });
        tog.addEventListener('touchend', function (ev) {
            ev.preventDefault();   /* 阻止 Safari 后续补发 click / 双击缩放判定 */
            tog._handled = true;
            doSwitch();
            /* 稍后复位，避免影响其他触发路径 */
            setTimeout(function () { tog._handled = false; }, 500);
        });
    }
})();
