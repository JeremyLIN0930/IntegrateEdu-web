/* ============================================================
   🃏 資料驅動卡片系統 + 3D Hover Tilt (cards.js)
   ============================================================
   
   架構設計：
   1. RESOURCES[] — 物件陣列，將所有卡片資料抽離（Data-Driven）
      → 未來新增/修改資源只需編輯此陣列，不需動 HTML
   2. renderCards() — 動態生成卡片 DOM
   3. CardTiltManager — 管理 3D Tilt 互動、滾動視差、Reveal 進場
   
   真實學習資源對接：
   - 設計：Figma Learn / Canva Design School
   - 程式：freeCodeCamp / The Odin Project
   - 科學：PhET 互動實驗室 / Khan Academy Science
   - 語文：BBC Learning English / VoiceTube
   - 藝術：Google Arts & Culture / MoMA Learning
   - 升學：均一教育平台 / 學習吧 LearnMode
   
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     § 學習資源資料陣列 (Resource Data Array)
     ─────────────────────────────────────────────
     欄位說明：
     - id:            唯一識別碼（用於 DOM id）
     - category:      分類鍵值（對應篩選器 data-filter）
     - categoryLabel: 分類顯示名稱（含 Emoji）
     - title:         資源名稱
     - description:   資源描述（限 2 行）
     - resourceCount: 收錄資源數量
     - image:         封面圖路徑（團隊攝影作品）
     - imageAlt:      圖片替代文字（無障礙）
     - url:           真實外部連結（target="_blank"）
     - source:        資源來源平台名稱
     ───────────────────────────────────────────── */
  const RESOURCES = [
    {
      id:'figma', platform:'Figma',
      title:'Figma — 免費協作 UI 設計工具',
      description:'業界標準的介面設計工具，免費版已含強大的即時協作功能。從零開始學習 UI/UX 設計的最佳起點。',
      extendedDesc:'Figma 是目前全球 UI/UX 設計師最仰賴的雲端協作工具，免費版即可建立無限個人專案。它最大的亮點在於「即時多人協作」——你可以和夥伴同時編輯同一份設計稿，搭配強大的元件系統（Components）與自動佈局（Auto Layout），從線框稿到高保真原型一氣成。',
      whyRecommend:'業界公認的 UI/UX 設計黃金標準。免安裝軟體即可直接在瀏覽器運作，並支援即時多人協作與強大的自動版面配置（Auto Layout），最適合團隊協同開發與原型驗證。',
      whoIsItFor:'適合零基礎想踏入 UI/UX 設計領域、前端工程師想看懂設計標註、或是想快速進行產品概念驗證的創業者與獨立開發者。',
      studyTime:'15 - 20 小時 / 基礎至實戰入門',
      beginnerPath: {
        desc: '適合完全零基礎的新手。我們推薦從 Figma 官方的「Figma 101」入門，教您如何建立基本形狀、套用色彩與字型，並快速拼湊出您的第一個手機介面線框圖。',
        link: 'https://www.figma.com/resources/learn-design/get-started/'
      },
      advancedPath: {
        desc: '適合已有介面概念的學習者。進階路徑引導您建構規範的「設計系統（Design Systems）」、運用 Auto Layout 進行複雜 RWD 排版，以及學習變體（Variants）與高保真原型交互。',
        link: 'https://www.figma.com/resources/learn-design/design-systems/'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['UI設計','免費工具'],
      image:'assets/images/card-design.png',
      url:'https://www.figma.com/', logo:'figma'
    },
    {
      id:'canva', platform:'Canva',
      title:'Canva — 零門檻視覺設計平台',
      description:'拖拉式操作，數千種免費模板。不懂設計也能快速產出專業的社群貼文、簡報、海報。',
      extendedDesc:'Canva 讓「不會設計」不再是阻礙你的理由。平台內建數十萬套由專業設計師打造的免費模板，涵蓋社群貼文、簡報、履歷、海報等各種場景，只需拖拉替換文字與圖片，幾分鐘就能產出視覺精緻的作品。',
      whyRecommend:'平面設計界的神級救星。內建數十萬套由專業設計師打造的精緻免費模板與商用圖庫，不懂設計原理的人也能透過拖拉式操作，快速產出專業級的海報與簡報。',
      whoIsItFor:'適合需要頻繁製作簡報與報告的學生、社群自媒體小編、行銷企劃人員，以及所有想讓視覺素材更有質感卻時間有限的自主學習者。',
      studyTime:'3 - 5 小時 / 零基礎快速上手',
      beginnerPath: {
        desc: '適合對視覺設計完全沒概念的自學者。透過 Canva 設計學院的「設計元素介紹」課程，您將學習如何挑選合適的字體、掌握基本排版對齊，並在一分鐘內套用精緻模板做出一張海報。',
        link: 'https://www.canva.com/designschool/tutorials/design-elements/'
      },
      advancedPath: {
        desc: '專為自媒體品牌或商業報告設計。進階路徑包含如何建立「品牌視覺套件（Brand Kits）」、製作多媒體動態簡報，以及使用 Canva Team 進行雲端多人同步審核。',
        link: 'https://www.canva.com/designschool/courses/create-a-brand/'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['平面設計','模板'],
      image:'assets/images/card-art.png',
      url:'https://www.canva.com/', logo:'canva'
    },
    {
      id:'freecodecamp', platform:'freeCodeCamp',
      title:'freeCodeCamp — 完全免費的程式學習',
      description:'超過 8,000 小時的免費課程與認證，涵蓋網頁開發、Python、資料科學等熱門領域。',
      extendedDesc:'freeCodeCamp 是全球最大的免費程式學習社群，提供超過 8,000 小時的互動式課程，完成後還能獲得正式的開發者認證。課程路徑從基礎的 HTML/CSS 開始，一路延伸到 JavaScript、React、Node.js、Python 資料科學與機器學習。',
      whyRecommend:'全球最大的免費開源程式教育平台。以「互動式實作」為核心，直接在瀏覽器動手撰寫程式碼並即時驗證。提供完整的全端開發認證，且全球社群規模龐大。',
      whoIsItFor:'適合完全零基礎的程式小白、想轉職全端工程師的自學者，或想要建立紮實 HTML/CSS/JavaScript 與 Python 底層邏輯的學習者。',
      studyTime:'300+ 小時 / 基礎到專業認證',
      beginnerPath: {
        desc: '適合程式小白。推薦從「響應式網頁設計（Responsive Web Design）」模組開始，透過直接在網頁編輯器上撰寫程式碼，打下紮實的 HTML5 與 CSS3 架構底子。',
        link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'
      },
      advancedPath: {
        desc: '適合已掌握基本網頁語法的自學者。進階路徑提供 React 前端庫、Node.js 後端開發、Python 資料分析等，包含多個實用的大型專案實作，建構您的專業履歷作品集。',
        link: 'https://www.freecodecamp.org/learn/front-end-development-libraries/'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['網頁開發','認證'],
      image:'assets/images/card-programming.png',
      url:'https://www.freecodecamp.org/', logo:'freecodecamp'
    },
    {
      id:'scratch', platform:'MIT Scratch',
      title:'Scratch — 視覺化積木程式語言',
      description:'MIT 開發的視覺化程式語言，用拖拉積木的方式學寫程式，最適合初學者與青少年入門。',
      extendedDesc:'Scratch 由 MIT 媒體實驗室開發，是全球最受歡迎的兒童與青少年程式入門平台。它採用直覺的「拖拉積木」介面，不需要記住任何語法，就能創作互動故事、動畫和遊戲。',
      whyRecommend:'MIT 媒體實驗室專為程式啟蒙開發的積木語言。免去繁瑣的語法除錯，僅需拖拉色彩繽紛的積木，即可直覺地理解條件分支、迴圈與變數等核心程式思維。',
      whoIsItFor:'適合 8 歲以上的兒童、青少年，以及完全沒有程式概念但想快速培養邏輯運算思維的軟體開發初學者。',
      studyTime:'8 - 12 小時 / 邏輯思維與遊戲創作',
      beginnerPath: {
        desc: '適合兒童與程式入門者。藉由「創作者新手村」的拖拉式積木，拼湊出簡單的對話動畫與方向鍵控制小遊戲，直覺地理解程式的順序執行與基本分支邏輯。',
        link: 'https://scratch.mit.edu/ideas'
      },
      advancedPath: {
        desc: '適合想挑戰複雜遊戲邏輯的學子。進階指南教您如何使用 Scratch 的「自訂積木（建立函式）」、廣播系統（訊息傳遞機制）以及變數克隆技術，建構多關卡動作遊戲。',
        link: 'https://scratch.mit.edu/studios/5387201/'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['入門友善','遊戲化'],
      image:'assets/images/card-science.png',
      url:'https://scratch.mit.edu/', logo:'scratch'
    },
    {
      id:'duolingo', platform:'Duolingo',
      title:'Duolingo — 遊戲化語言學習',
      description:'全球最受歡迎的免費語言學習 App，支援超過 40 種語言，用遊戲機制讓學習變得有趣。',
      extendedDesc:'Duolingo 將語言學習變成了一場令人上癮的遊戲冒險。每天只需 5 到 15 分鐘，透過聽、說、讀、寫四大核心訓練，搭配經驗值、連續天數、排行榜等遊戲化機制，讓學習不再枯燥。',
      whyRecommend:'Duolingo 將語言學習變成了一場驚喜的闖關冒險。利用零碎時間，透過聽說讀寫的個人化 AI 演算法，提供毫無壓力的多國語言口說與單字建立環境。',
      whoIsItFor:'適合想要利用每天 10 分鐘練習外語日常會話、擴展單字量，或是想在出國旅遊前快速掌握基礎問候語的學習者。',
      studyTime:'每天 10 分鐘 / 彈性進度',
      beginnerPath: {
        desc: '適合語言學習起步者。用遊戲化的字卡拼湊、基礎單字連連看，每天 5 分鐘在無痛環境中建立新語言的語感，克服對外語發音的恐懼。',
        link: 'https://www.duolingo.com/register'
      },
      advancedPath: {
        desc: '適合想提升日常聽力與口說流暢度的學習者。進階路徑提供語音 AI 對話練習、長篇閱讀理解，以及連續答題挑戰，幫助您在外語社交情境中對答如流。',
        link: 'https://www.duolingo.com/super'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['多語言','遊戲化'],
      image:'assets/images/card-language.png',
      url:'https://www.duolingo.com/', logo:'duolingo'
    },
    {
      id:'voicetube', platform:'VoiceTube',
      title:'VoiceTube — 看影片學英文',
      description:'透過 TED、電影片段等真實影片學英文，搭配即時字幕、口說練習功能，沉浸式提升英語能力。',
      extendedDesc:'VoiceTube 是台灣團隊打造的英語學習平台，收錄了 TED 演講、電影片段、新聞報導等數萬部真實影片作為教材。每部影片都搭配中英雙語字幕、單字即時查詢、口說錄音比對功能。',
      whyRecommend:'台灣最受歡迎影音英文學習平台。將 YouTube、TED 等海量真實情境影片轉為教材，搭配點擊即查單字與口說錄製比對，實現真正的沉浸式學習。',
      whoIsItFor:'適合希望擺脫死背教科書、想看懂西洋電影、聽懂英文演講，並希望矯正道地英文腔調的英語中高階自學者。',
      studyTime:'20 - 30 小時 / 聽說能力全面提升',
      beginnerPath: {
        desc: '適合英文聽力初學者。建議選用「日常生活與休閒會話」短影音，開啟中英雙語字幕，利用單字即時點擊查詢與收藏功能，在情境中自然記憶單字。',
        link: 'https://tw.voicetube.com/channel/everyday'
      },
      advancedPath: {
        desc: '適合想精進商業聽力與口說流暢度的自學者。挑戰「TED 演講」或「BBC 新聞」，嘗試關閉中文字幕，並使用平台內建的口說挑戰錄音比對系統進行連音特訓。',
        link: 'https://tw.voicetube.com/challenges/pronunciation'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['英語','影片學習'],
      image:'assets/images/card-language.png',
      url:'https://tw.voicetube.com/', logo:'voicetube'
    },
    {
      id:'musescore', platform:'MuseScore',
      title:'MuseScore — 免費樂譜創作工具',
      description:'開源的專業樂譜編輯軟體，免費使用所有核心功能。適合音樂創作者、學生與教師。',
      extendedDesc:'MuseScore 是一套完全免費且開源的專業樂譜編輯軟體，功能足以媲美付費商業軟體。你可以用它記譜、編曲、移調，並即時播放聆聽效果。它支援匯出 PDF、MIDI、MusicXML 等多種格式。',
      whyRecommend:'開源且功能完整的專業打譜軟體。介面友善，功能足以媲美昂貴的商業記譜軟體，並有龐大的全球社群提供百萬首免費樂譜下載交流。',
      whoIsItFor:'適合音樂系學生、合唱團或樂團編曲者、獨立音樂創作人，以及需要快速產出教學簡譜的音樂教師。',
      studyTime:'10 - 15 小時 / 記譜與編曲入門',
      beginnerPath: {
        desc: '樂譜編輯與基礎記譜入門。教您如何建立單旋律五線譜，手動輸入音符，並進行基礎的移調（Transpose）與簡易鋼琴曲記譜。',
        link: 'https://musescore.org/zh-hant/handbook/tutorial-layout'
      },
      advancedPath: {
        desc: '複雜多聲部與交響樂編曲。引導自學者如何使用多聲部編輯系統、管弦樂配器編制、動態總譜（Linked Parts）製作，以及匯出高品質的 MIDI/XML 檔案。',
        link: 'https://musescore.org/zh-hant/handbook/3/basics'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['音樂','開源'],
      image:'assets/images/card-art.png',
      url:'https://musescore.org/', logo:'musescore'
    },
    {
      id:'pixlr', platform:'Pixlr',
      title:'Pixlr — 免費線上圖片編輯器',
      description:'功能強大的線上影像編輯工具，免費版提供專業級修圖、去背、濾鏡等功能，無需安裝軟體。',
      extendedDesc:'Pixlr 是一款直接在瀏覽器中使用的專業級圖片編輯器，免費版即提供圖層編輯、一鍵去背、濾鏡特效、文字工具等核心功能，完全不需要安裝任何軟體。',
      whyRecommend:'直接在瀏覽器運行的專業修圖工具。免去安裝 Photoshop 的繁瑣，提供 Pixlr X (簡易圖案設計) 與 Pixlr E (專業分層修圖) 雙介面，支援大部分常見修圖功能。',
      whoIsItFor:'適合學生製作報告封面、社群小編快速進行去背與濾鏡調整，以及不想安裝重型軟體但需要基本照片編修的自主學習者。',
      studyTime:'5 - 8 小時 / 影像處理實務學會',
      beginnerPath: {
        desc: '線上輕量級修圖與卡片製作。推薦使用 Pixlr X 介面，教您如何一鍵去背、套用相片濾鏡、加入藝術文字，快速完成日常簡報配圖與海報設計。',
        link: 'https://pixlr.com/tw/x/'
      },
      advancedPath: {
        desc: '專業級分層修圖與數位暗房。使用 Pixlr E 專業介面，解鎖多圖層混合模式、魔術棒去背、曲線色彩調整（Curves），以及非破壞性濾鏡等仿 Photoshop 專業功能。',
        link: 'https://pixlr.com/tw/e/'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['修圖','線上工具'],
      image:'assets/images/card-art.png',
      url:'https://pixlr.com/', logo:'pixlr'
    },
    {
      id:'junyi', platform:'均一教育平台',
      title:'均一 — 最懂台灣學生的教育平台',
      description:'由財團法人均一平台教育基金會營運，完全免費，提供國小到高中完整課程影片與互動練習。',
      extendedDesc:'均一教育平台是台灣最具影響力的免費教育資源，由均一平台教育基金會營運，完全對應台灣 108 課綱。平台提供國小到高中的數學、自然、社會、英文等完整課程影片，每部影片搭配即時互動練習題。',
      whyRecommend:'台灣本土最具規模的 K-12 自主學習平台。完全對應教育部 108 課綱，利用 AI 技術診斷學習弱點，提供適性化的練習題與清晰的教學短片。',
      whoIsItFor:'適合國小、國中至高中在學學生課後複習、超前預習，或考生準備大考衝刺，以及家長輔導孩子課業的絕佳工具。',
      studyTime:'配合學校課程 / 長期自主學伴',
      beginnerPath: {
        desc: '適合 K-12 在學學生進行基礎觀念複習。平台提供與學校課堂同步的單元教學影片，搭配簡單的概念自測，確保每個小觀念都融會貫通。',
        link: 'https://www.junyiacademy.org/root/junyi-math'
      },
      advancedPath: {
        desc: '適合面臨升學大考（會考/學測）的考生。利用均一的「AI 診斷系統」自動偵測學習弱點，產出個人化複習考卷，並提供歷屆大考真題的影音解析與詳盡複習路徑。',
        link: 'https://www.junyiacademy.org/exam'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['K-12','台灣課綱'],
      image:'assets/images/card-exam.png',
      url:'https://www.junyiacademy.org/', logo:'junyi'
    },
    {
      id:'coolenglish', platform:'CoolEnglish',
      title:'Cool English — 教育部英語學習平台',
      description:'教育部建置的免費英語學習資源網，涵蓋聽說讀寫四大技能，搭配遊戲化練習機制。',
      extendedDesc:'Cool English 是教育部專為台灣中小學生打造的免費英語學習平台，涵蓋聽力、口說、閱讀、寫作四大技能。平台融入了遊戲化的闖關機制與排行榜，讓練習英文不再無聊。',
      whyRecommend:'教育部專為學子打造的官方英語學習網站。結合遊戲闖關、口說 AI 評分以及全民英檢、多益備考資源，內容由學界專家審核，安全且極具教育成效。',
      whoIsItFor:'適合國中小、高中生，或想考取英文證照、精進英語聽說讀寫能力的自主學習者。',
      studyTime:'10 - 20 小時 / 聽說讀寫全面精進',
      beginnerPath: {
        desc: '國中小學生英語啟蒙。透過口說精靈與繪本專區，在活潑的動漫童話情境中練習英文字母發音與基礎會話，用點數換禮物的機制保持學習熱情。',
        link: 'https://www.coolenglish.edu.tw/mcourse.php'
      },
      advancedPath: {
        desc: '高中生及成人全民英檢（GEPT）與多益（TOEIC）備考。提供豐富的官方模擬試題、寫作 AI 線上批改反饋，以及商業英語聽力特訓，全面提升實戰檢定成績。',
        link: 'https://www.coolenglish.edu.tw/hcourse.php'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['英文','官方資源'],
      image:'assets/images/card-exam.png',
      url:'https://www.coolenglish.edu.tw/', logo:'coolenglish'
    },
    {
      id:'khanacademy', platform:'Khan Academy',
      title:'Khan Academy — 全球化免費教育',
      description:'由 Sal Khan 創辦的非營利組織，提供數學、科學、經濟等完整課程，支援多國語言。',
      extendedDesc:'Khan Academy 是由 Sal Khan 於 2008 年創辦的非營利線上教育平台，願景是「為任何人、任何地方提供免費的世界級教育」。',
      whyRecommend:'全球最大的非營利教育網站。提供微積分、物理、化學、經濟學等高水準影音解析，並以「精熟學習法」引導學生穩打穩紮地掌握各知識點。',
      whoIsItFor:'適合想自主挑戰 AP 課程、探究硬核數理學科、自學程式設計或經濟學的國高中生與大專院校學生。',
      studyTime:'單一學科約 30 小時 / 自主精熟學習',
      beginnerPath: {
        desc: '數理科學基礎扎根。從最基礎的國中小數學代數、基礎物理運動學影片看起，每個影片不超過 10 分鐘，搭配直覺的連貫性練習題，無痛跨入數理領域。',
        link: 'https://www.khanacademy.org/math'
      },
      advancedPath: {
        desc: '大學先修課程（AP Calculus, Linear Algebra）或進階科學。深入探討微積分、有機化學、總體經濟學，藉由精熟學習（Mastery Learning）演算法，突破硬核理工知識。',
        link: 'https://www.khanacademy.org/science/ap-physics-1'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['數理','國際化'],
      image:'assets/images/card-science.png',
      url:'https://www.khanacademy.org/', logo:'khanacademy'
    },
    {
      id:'phet', platform:'PhET Simulations',
      title:'PhET — 互動式科學模擬實驗',
      description:'科羅拉多大學開發的免費互動模擬，涵蓋物理、化學、生物等學科，讓抽象概念視覺化。',
      extendedDesc:'PhET 互動式模擬實驗由科羅拉多大學波德分校開發，提供超過 160 個涵蓋物理、化學、生物、地球科學與數學的免費互動模擬。',
      whyRecommend:'科羅拉多大學開發的探究式互動實驗室。以滑鼠操作參數就能觀察電路、波的干涉或分子鍵結，將原本枯燥、太抽象的物理化學規律轉為極具趣味的動態實驗。',
      whoIsItFor:'適合覺得課本公式太抽象、想透過動手操作來探究物理化學規律的國高中生、理科教師與科學愛好者。',
      studyTime:'5 - 8 小時 / 探究式科學實作',
      beginnerPath: {
        desc: '趣味物理與化學實驗啟蒙。利用拖拉式的虛擬實驗室（例如：『波的干涉』或『組裝電路』），親手調整參數，用眼睛『看見』電壓與波動等抽象科學物理概念。',
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/physics'
      },
      advancedPath: {
        desc: '定量理科實驗與假設驗證。在『氣體屬性定律』或『量子力學模型』模擬中，收集多組數據，利用統計圖表進行科學建模，適合高中理科專題與畢設專案驗證。',
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/chemistry'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['模擬實驗','視覺化'],
      image:'assets/images/card-science.png',
      url:'https://phet.colorado.edu/', logo:'phet'
    },
    // ═══════════════════════════════════════════
    // 📸 攝影類 — Photography (新增)
    // ═══════════════════════════════════════════
    {
      id:'photography-light', platform:'攝影學基礎',
      title:'攝影基礎：光影控制與構圖美學',
      description:'教導如何利用自然光與構圖說故事，讓你的照片充滿生命力與故事感。',
      extendedDesc:'本課程對接頂尖攝影學觀念，帶你了解相機的三大曝光要素：光圈、快門、感光度，並學習如何在日常生活中捕捉光線，運用經典的三分法、引導線構圖等美學概念來說故事。',
      whyRecommend:'教導如何利用自然光與構圖說故事，由淺入深理解光線對照片情緒的控制，是建立美感視覺直覺的必修課。',
      whoIsItFor:'適合想提升日常拍攝質感、學習相機基本操作的攝影新手，或想為設計專案準備溫暖寫實素材的設計師。',
      studyTime:'8 - 12 小時 / 基礎美學與實作',
      beginnerPath: {
        desc: '零基礎日常攝影起步。學習如何用手機或入門相機，透過「三分法構圖」和尋找身邊的「單一光源」，在日常街拍中拍出有溫度的畫面。',
        link: 'https://www.cambridgeincolour.com/tutorials/camera-exposure.htm'
      },
      advancedPath: {
        desc: '專業人像與風景光影雕塑。深入學習多光源室內棚拍布光、HDR 高動態範圍曝光疊加技術、動態追焦（Panning），以及大片感的區域曝光法（Zone System）。',
        link: 'https://www.cambridgeincolour.com/tutorials/portraits.htm'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['攝影入門','構圖美學'],
      image:'assets/images/card-art.png',
      url:'https://www.cambridgeincolour.com/', logo:'photography'
    },
    {
      id:'photography-darkroom', platform:'Darktable 學院',
      title:'數位暗房基礎：Darktable 影像後製實務',
      description:'對接免費開源修圖軟體 Darktable，從曝光調整到色彩管理，掌握專業相片後製技術。',
      extendedDesc:'Darktable 是免費且開源的 RAW 檔編輯與調色工具，功能直追 Lightroom。本教學引導你如何進行非破壞性影像編輯，管理大量照片，並精準控制照片細節。',
      whyRecommend:'對接免費且開源的修圖軟體 Darktable，掌握媲美專業付費軟體的無損相片編修、白平衡矯正與風格色調建立。',
      whoIsItFor:'適合預算有限的自主學習者、獨立攝影師，以及想要深入掌握數位影像色彩校正與暗房處理的學子。',
      studyTime:'10 - 15 小時 / 專業後製技術學會',
      beginnerPath: {
        desc: '新手 RAW 檔調色入門。認識 RAW 檔與 JPEG 的差異，教您如何在 Darktable 中進行基礎的「白平衡校正」、調整曝光與飽和度，拯救照片。',
        link: 'https://www.darktable.org/usermanual/en/overview/basic_concepts/'
      },
      advancedPath: {
        desc: '高階色調分離與區域編修。掌握 Darktable 強大的「遮罩層（Masking）」功能、色彩區域重建（Color Reconstruction）、漸層濾鏡，以及膠片模擬調色風格。',
        link: 'https://www.darktable.org/usermanual/en/darkroom/processing_modules/'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['開源修圖','相片後製'],
      image:'assets/images/card-design.png',
      url:'https://www.darktable.org/', logo:'darktable'
    },
    // ═══════════════════════════════════════════
    // 🎵 音樂類 — Music (新增)
    // ═══════════════════════════════════════════
    {
      id:'music-garageband', platform:'Apple Learn',
      title:'GarageBand 數位音樂編曲入門',
      description:'零經費也能用手機或電腦創作出第一首 SDGs 公益主題曲，解鎖你的音樂創作天賦。',
      extendedDesc:'GarageBand 將你的 Apple 裝置變成一間功能齊備的錄音室。本教學教你如何運用虛擬智慧樂器、現成 Loops 音效與多軌混音，即使看不懂樂譜也能輕鬆創作出第一首歌。',
      whyRecommend:'零經費編曲神作。內建大量的高品質虛擬樂器與預製循環 Loops 庫，支援多聲部軌道錄音與混音，是快速學寫原創歌的捷徑。',
      whoIsItFor:'適合想為自己設計的動畫或短片配樂的創作者、音樂愛好者，以及想零門檻嘗試寫第一首歌的學習者。',
      studyTime:'6 - 10 小時 / 音樂編曲輕鬆入門',
      beginnerPath: {
        desc: '手機/電腦樂器演奏與錄音。用觸控樂器錄製簡單旋律，教您如何剪輯音軌、調整音量大小，並拼湊出第一首屬於您的 8 小節輕快背景音樂。',
        link: 'https://support.apple.com/zh-tw/guide/garageband-ipad/welcome/ipados'
      },
      advancedPath: {
        desc: '多聲部混音與合成器編曲。教您如何調整等化器（EQ）、加入混響（Reverb）與延遲（Delay）音效，並利用 Loop 循環庫進行精緻的 SDGs 公益單曲編曲與混音。',
        link: 'https://support.apple.com/zh-tw/guide/garageband/welcome/mac'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['音樂製作','數位編曲'],
      image:'assets/images/card-language.png',
      url:'https://www.apple.com/tw/mac/garageband/', logo:'garageband'
    },
    {
      id:'music-theory', platform:'MusicTheory.net',
      title:'互動樂理基礎與視唱聽寫',
      description:'對接免費線上互動樂理開源網站，用遊戲化且直覺的介面，輕鬆學習五線譜與和弦。',
      extendedDesc:'MusicTheory.net 是完全免費的線上互動樂理網站，提供從認識音高、音程、三和弦、七和弦到調性等系列課程，並搭配極具趣味的視唱聽寫小遊戲，快速訓練耳朵對音高的直覺。',
      whyRecommend:'完全免費且開源的樂理學習天花板。用極簡乾淨的黑白琴鍵與五線譜動畫，配合無壓力的連連看聽音小遊戲，快速訓練你的耳朵與音準感。',
      whoIsItFor:'適合合唱團或樂團團員、音樂自學者、需要準備升學視唱聽寫考試的考生，以及所有想看懂五線譜的人。',
      studyTime:'10 - 15 小時 / 聽力與視唱訓練',
      beginnerPath: {
        desc: '認識五線譜與基礎音高。用最直覺的鍵盤對照圖，學習認識高低音譜號、音名、基礎節拍，並透過聽音小遊戲快速建立您的音高直覺感。',
        link: 'https://www.musictheory.net/lessons'
      },
      advancedPath: {
        desc: '大調/小調和弦建構與視唱聽寫。深入學習三和弦（Triads）、七和弦（Seventh Chords）、大小調調性關係，以及進行實用的音程與和弦視唱聽寫特訓。',
        link: 'https://www.musictheory.net/exercises'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['樂理基礎','聽力訓練'],
      image:'assets/images/card-exam.png',
      url:'https://www.musictheory.net/', logo:'musictheory'
    }
  ];

  /* ─────────────────────────────────────────────
     § 卡片 HTML 模板生成器
     ─────────────────────────────────────────────
     根據 RESOURCES 陣列動態生成卡片 DOM，
     不需手動編輯 HTML。
     ───────────────────────────────────────────── */

  /**
   * 生成單張卡片的 HTML 字串
   * @param {Object} resource - 資源物件
   * @param {number} index - 索引（用於階梯動畫延遲）
   * @returns {string} HTML 字串
   */
  function createCardHTML(resource, index) {
    const delayClass = (index % 6) > 0 ? `reveal-delay-${index % 6}` : '';
    const brandLogoHtml = typeof getBrandLogo === 'function' ? getBrandLogo(resource.logo) : '';

    return `
      <article class="resource-card reveal ${delayClass}" 
               data-category="${resource.category}" 
               data-id="${resource.id}" 
               role="listitem" 
               tabindex="0" 
               aria-label="點擊查看 ${resource.platform} 的詳細介紹與分階學習路徑">
        <div class="card-image-wrap">
          <img src="${resource.image}" alt="${resource.title}" loading="lazy">
          <span class="card-category-tag" data-cat="${resource.category}">${resource.categoryLabel}</span>
        </div>
        <div class="card-body">
          <div class="card-platform">${resource.platform}</div>
          <h3 class="card-title">${resource.title}</h3>
          <p class="card-desc">${resource.description}</p>
          <div class="card-footer">
            <div class="card-tags">
              ${resource.tags.map(t => `<span class="card-tag-item">${t}</span>`).join('')}
            </div>
            <button type="button" class="card-link" data-id="${resource.id}" aria-label="查看 ${resource.platform} ${resource.title} 的詳細介紹與分階學習路徑">
              <span class="card-link-logo">${brandLogoHtml}</span>
              查看詳情
            </button>
          </div>
        </div>
      </article>
    `;
  }

    /**
   * 將所有卡片渲染到 #card-grid 容器
   */
  function renderCards() {
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    const html = RESOURCES.map((res, i) => createCardHTML(res, i)).join('');
    grid.innerHTML = html;
  }


  /* ─────────────────────────────────────────────
     § 3D Tilt 可調參數
     ───────────────────────────────────────────── */
  const TILT_CONFIG = {
    // 最大傾斜角度 (deg)
    MAX_TILT_DEG: 8,

    // 懸浮上移量 (px) — 反重力效果
    HOVER_LIFT_PX: 10,

    /*
       阻尼感（Damping）透過 CSS transition timing 控制：
       - hover 進入：0.15s ease-out → 快速跟手、靈敏
       - hover 離開：0.6s cubic-bezier(0.23,1,0.32,1) → Quint EaseOut
         模擬彈簧阻尼模型：快速啟動 → 緩慢減速 → 優雅停止
       
       ★ 調參指南：
       想更「彈」→ 改 TRANSITION_OUT 為 'cubic-bezier(0.34, 1.56, 0.64, 1)'
       想更「穩」→ 延長時間至 0.8s 或改用 'ease-out'
       想更「跟手」→ 縮短 TRANSITION_IN 至 0.08s
    */
    TRANSITION_IN: 'transform 0.15s ease-out, box-shadow 0.3s ease',
    TRANSITION_OUT: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease',

    // 光暈追蹤強度 (0~1)
    GLARE_OPACITY: 0.1,

    // 滾動視差速度 (0~1，圖片移動 = 卡片的 N 倍)
    PARALLAX_SPEED: 0.3,
  };


  /* ─────────────────────────────────────────────
     § CardTiltManager — 管理所有卡片的 3D Tilt
     ───────────────────────────────────────────── */
  class CardTiltManager {
    constructor() {
      this.cards = [];
      this.observer = null;
      this._init();
    }

    _init() {
      const cardElements = document.querySelectorAll('.resource-card');
      if (cardElements.length === 0) return;

      cardElements.forEach(card => {
        this._bindTiltEvents(card);
        this.cards.push(card);
      });

      this._initParallax();
      this._initRevealObserver();
    }

    /**
     * 為單張卡片綁定 3D Tilt 事件
     *
     * 數學原理：
     * 1. 取得滑鼠相對於卡片中心的 (dx, dy) 偏移
     * 2. 除以半寬/半高 → 正規化為 [-1, 1]
     * 3. 乘以最大角度 → rotateX / rotateY
     * 4. rotateY 對應水平，rotateX 對應垂直（且反向）
     */
    _bindTiltEvents(card) {
      card.addEventListener('mouseenter', () => {
        card.style.transition = TILT_CONFIG.TRANSITION_IN;
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 正規化到 [-1, 1]
        const normalizedX = (mouseX - centerX) / centerX;
        const normalizedY = (mouseY - centerY) / centerY;

        // 計算旋轉角度
        const rotateY = normalizedX * TILT_CONFIG.MAX_TILT_DEG;
        const rotateX = -normalizedY * TILT_CONFIG.MAX_TILT_DEG;

        // 套用 3D transform + 反重力上浮
        card.style.transform =
          `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${TILT_CONFIG.HOVER_LIFT_PX}px)`;

        // Tiffany 綠微光陰影 — 隨傾斜方向偏移
        const shadowX = normalizedX * 8;
        const shadowY = normalizedY * 4 + 12;
        card.style.boxShadow =
          `${shadowX}px ${shadowY}px 40px rgba(10, 186, 181, 0.18), ` +
          `0 4px 12px rgba(0, 0, 0, 0.06)`;

        // 光暈追蹤
        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.background =
            `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,${TILT_CONFIG.GLARE_OPACITY}), transparent 60%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        // 慢速回彈 — 物理阻尼感的關鍵
        card.style.transition = TILT_CONFIG.TRANSITION_OUT;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.boxShadow = '';

        const glare = card.querySelector('.card-glare');
        if (glare) glare.style.opacity = '0';
      });
    }

    /** 滾動視差（圖片 vs 卡片） */
    _initParallax() {
      const visibleCards = new Set();
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visibleCards.add(entry.target);
          else visibleCards.delete(entry.target);
        });
      }, { rootMargin: '100px 0px', threshold: 0 });

      this.cards.forEach(card => this.observer.observe(card));

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            visibleCards.forEach(card => {
              const img = card.querySelector('.card-image');
              if (!img) return;
              const rect = card.getBoundingClientRect();
              const progress = (rect.top + rect.height / 2) / window.innerHeight;
              const offset = (progress - 0.5) * 30 * TILT_CONFIG.PARALLAX_SPEED;
              img.style.transform = `translateY(${offset}px)`;
            });
            ticking = false;
          });
        }
      }, { passive: true });
    }

    /** 滾動進場觀察者 (Reveal on Scroll) */
    _initRevealObserver() {
      const revealElements = document.querySelectorAll('.reveal');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }


  /* ─────────────────────────────────────────────
     § 匯出到全域
     ───────────────────────────────────────────── */
  window.RESOURCES = RESOURCES;
  window.renderCards = renderCards;
  window.CardTiltManager = CardTiltManager;

})();
