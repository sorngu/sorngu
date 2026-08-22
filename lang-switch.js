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
        'Munan Province': '木南省',
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
        "fotomemo is a personal photography project that began as a quiet practice of observation and has grown into an ongoing visual archive. Rooted in the everyday, it documents the subtle textures of urban life — the interplay between architecture and nature, the traces of time on buildings, and the fleeting moments that often go unnoticed.":
            'fotomemo 是一个个人摄影项目，始于一次安静的观察练习，如今已长成一座持续生长的视觉档案。它扎根于日常，记录城市生活中细腻的质地——建筑与自然的交织、时间留在建筑物上的痕迹，以及那些常被忽略的瞬间。',
        "The work spans multiple cities across China, from the industrial landscapes of Tianjin's Binhai New District to the atmospheric streets of Chengdu, from Beijing's monumental spaces to the quiet corners of smaller towns. Each photograph is an attempt to capture something both specific and universal — a fragment of place that resonates beyond its immediate context.":
            '作品的足迹遍布中国的多座城市：从天津滨海新区的工业景观，到成都氤氳的街头；从北京宏大的空间，到小城镇安静的角落。每一张照片都试图捕捉既具体又普遍的东西——一个地点的片段，却能在更远处引起回响。',
        'This is not a commercial endeavor but a sustained commitment to looking carefully and documenting honestly. The approach is patient and cumulative: images are gathered over time, allowed to accumulate meaning through repetition and variation. There is no grand narrative imposed from above; instead, patterns emerge organically from the act of walking, observing, and returning.':
            '这不是一次商业尝试，而是对认真观看与诚实记录的长期坚持。方法是耐心而累积式的：影像在时间里被收集，借由重复与变化慢慢积蓄意义。这里没有自上而下强加的宏大叙事，图景与韵律，自然地从行走、观看与重返中浮现。',
        'The photographs exist in dialogue with each other — black and white studies alongside color documentation, architectural details next to human-scale observations. This sequencing creates rhythms and connections that extend beyond individual frames, building a larger sense of place and atmosphere.':
            '照片之间彼此对话——黑白习作与彩色记录并置，建筑细节与人的尺度相互照应。这样的编排生成超越单幅画面的节奏与联系，构筑起更辽阔的现场感与氛围。',
        'fotomemo will continue to evolve as new places are explored and familiar ones reveal different facets. It is a living archive, open-ended and responsive to the world as it changes. Updates come irregularly but consistently, driven by curiosity rather than schedule.':
            'fotomemo 会继续演化：新的地方被探索，熟悉的地方显露出不同的侧面。它是一座活着的档案，开放、流动，回应着这个变化中的世界。更新不规律，却从未停止——驱动它的是好奇心，而不是日程表。',
        'All images are taken personally, without staging or intervention. The goal is not to transform reality but to attend to it — to find beauty in what already exists, to honor the ordinary, and to preserve moments that might otherwise disappear.':
            '所有影像均为亲自拍摄，不做摆拍，也不加干预。目的不是改造现实，而是注视现实——在已经存在的事物中发现美，向平凡致意，留存那些可能就此消失的瞬间。',
        'This project is an invitation to slow down and look more closely. To notice the way light falls on concrete, how vegetation reclaims abandoned structures, or how people navigate spaces designed for other purposes. It is about finding poetry in the mundane and dignity in decay.':
            '这个项目是一次邀请：邀请你慢下来，看得更仔细一些。看光如何落在混凝土上，看植物如何收回废弃的建筑，看人们如何在为他人设计的空间里行走。它关乎在平凡中寻找诗意，在衰败中看见尊严。',
        'The archive grows slowly but steadily. Each addition is deliberate, chosen not for novelty but for its contribution to an emerging whole. Over time, these fragments coalesce into something larger than any single image — a portrait of contemporary China seen through the lens of someone who cares deeply about seeing clearly.':
            '档案缓慢而稳定地生长。每一次新增都经过斟酌，不为猎奇，只为它对一个正在成形的整体的贡献。时间会让这些碎片汇聚成比任何单张照片都更大的东西——一幅当代中国的肖像，透过一个在意「看清」的人的镜头。',
        'Thank you for taking the time to look.': '谢谢你，愿意花时间来看。'
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
