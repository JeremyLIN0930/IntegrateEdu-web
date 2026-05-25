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
      title:'Figma — 業界標準 UI/UX 設計與即時協作工具',
      description:'全球主流介面設計工具。初階掌握基礎元件操作與 RWD 排版，進階解鎖設計系統與變數應用。',
      extendedDesc:'Figma 是目前全球設計團隊最信任的介面設計與原型製作工具。它採用雲端協作架構，多人可同時在同一設計稿上編輯、評論。強大的 Auto Layout 與 Component 系統能大幅提昇介面開發效率，無縫銜接工程開發。',
      whyRecommend:'免安裝且完全在瀏覽器運行，即時協作無縫對接。內建自動排版系統能完美模擬響應式網頁，是踏入 UI/UX 設計領域必學的黃金標準。',
      whoIsItFor:'適合對介面設計有興趣的自學者、想增進切版準確度的前端工程師，以及需要進行產品概念原型設計的開發者。',
      studyTime:'15 - 30 小時 / 基礎至進階設計系統',
      beginnerPath: {
        desc: '初階 (Joy Shaheb 入門)：推薦自學者從知名講師 Joy Shaheb 在 freeCodeCamp 推出的 Figma 零基礎入門教學開始。您將學習 Figma 基礎介面操作、向量繪圖工具，以及建立第一個手機 App 線框圖與基本視覺排版。',
        link: 'https://www.youtube.com/watch?v=FTFaQWZBqA8',
        studyTime: '15 - 20 小時 / 基礎至實戰入門'
      },
      advancedPath: {
        desc: '進階 (設計系統與變數應用)：深入學習業界規範的設計系統（Design Systems）。掌握進階 Auto Layout 響應式排版、元件變體（Variants）、Figma Variables（變數應用）以及高保真互動原型設計。',
        link: 'https://www.figma.com/resources/learn-design/design-systems/',
        studyTime: '20 - 30 小時 / 進階設計系統'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['UI設計','即時協作'],
      image:'assets/images/card-design.png',
      url:'https://www.figma.com/', logo:'figma'
    },
    {
      id:'canva', platform:'Canva',
      title:'Canva — 零門檻雲端平面與簡報設計平台',
      description:'拖拉式簡單操作。初階學習平面排版與視覺平衡，進階掌握品牌識別系統建立。',
      extendedDesc:'Canva 讓設計變得人人皆可上手。它內建數十萬套精緻模板，涵蓋簡報、海報、履歷與社群貼文。使用者不需複雜的軟體操作基礎，透過直覺的拖拉式元件、多樣化的商用字體與圖庫，即可快速完成吸睛的視覺作品。',
      whyRecommend:'平面設計界的神級工具。內建極為豐富的免費模板與版權素材，拖拉式操作即可在幾分鐘內產出專業級的海報與簡報，是快速視覺化創意的首選。',
      whoIsItFor:'適合需要頻繁製作簡報的學生、自媒體創作者、行銷小編，以及所有想在短時間內產出精美圖樣的自學者。',
      studyTime:'3 - 10 小時 / 基礎排版至品牌視覺',
      beginnerPath: {
        desc: '初階 (平面排版基礎)：專為設計小白打造。透過 Canva 官方設計學院課程，掌握基礎的色彩搭配、字體階層與畫面留白原則，並學會運用拖拉式介面在一分鐘內套用模板製作專業海報。',
        link: 'https://www.canva.com/designschool/tutorials/design-elements/',
        studyTime: '3 - 5 小時 / 零基礎快速上手'
      },
      advancedPath: {
        desc: '進階 (品牌識別系統建立)：引導自學者建立專屬的「品牌視覺套件（Brand Kits）」。學習品牌一致性的視覺規劃、團隊協作流程、動態多媒體簡報設計，以及將靜態圖稿輸出為動畫影片的技巧。',
        link: 'https://www.canva.com/designschool/courses/create-a-brand/',
        studyTime: '6 - 10 小時 / 品牌視覺實務'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['平面設計','快速排版'],
      image:'assets/images/card-art.png',
      url:'https://www.canva.com/', logo:'canva'
    },
    {
      id:'freecodecamp', platform:'freeCodeCamp',
      title:'freeCodeCamp — 互動式全端開發與程式學習平台',
      description:'完全免費的開源程式學習平台。初階進行響應式網頁設計，進階取得 JavaScript/Python 認證。',
      extendedDesc:'freeCodeCamp 是全球最大的免費程式學習社群，提供超過 8,000 小時的實作課程。它最大的亮點在於「在瀏覽器動手做專案」——你不用安裝任何開發環境，直接寫程式通過測試即可獲得證書，在全球廣受企業認可。',
      whyRecommend:'以互動式專案為核心，免去繁瑣的環境設定。完成每個模組的 5 大專案即可免費獲得官方認證，內容由淺入深，是轉職全端開發最紮實的開源資源。',
      whoIsItFor:'適合想轉職網頁工程師的程式小白、想建立紮實程式底層邏輯的自學者，或需要大專專案實作經驗的理工學子。',
      studyTime:'300 - 600 小時 / 網頁基礎至專業開發',
      beginnerPath: {
        desc: '初階 (Responsive Web Design)：從基礎的 HTML5 和 CSS3 語法開始。透過互動式網頁編輯器，親手撰寫程式碼並即時通過測試，完成包括貓咪相簿、企鵝動畫等趣味專案，並取得響應式網頁設計證書。',
        link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        studyTime: '300+ 小時 / 奠定網頁基礎'
      },
      advancedPath: {
        desc: '進階 (JavaScript/Python 認證)：挑戰進階程式邏輯與資料科學。提供 JavaScript 演算法與資料結構認證，或是 Python 數據分析與機器學習證書，帶你實作多個實用專案以建構個人作品集。',
        link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
        studyTime: '300+ 小時 / 挑戰核心認證'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['網頁開發','開源學習'],
      image:'assets/images/card-programming.png',
      url:'https://www.freecodecamp.org/', logo:'freecodecamp'
    },
    {
      id:'scratch', platform:'MIT Scratch',
      title:'Scratch — 視覺化積木程式語言與創作平台',
      description:'MIT 開發的程式入門工具。初階拼湊積木動畫，進階開發遊戲邏輯與數學物理演算。',
      extendedDesc:'Scratch 是由 MIT 媒體實驗室專門開發的積木式程式語言。它將複雜的程式語法抽象化為彩色積木，透過拖拉組合，即可編寫出動畫、故事與遊戲。這是培養邏輯思考與解決問題能力的最棒起點。',
      whyRecommend:'完全擺脫拼字語法錯誤，以視覺化、遊戲化的方式培養運算思維。擁有全球數百萬人參與的活躍創意社群，可以隨時參考他人的專案原始碼。',
      whoIsItFor:'適合 8 歲以上的青少年兒童、想啟盟邏輯思維的成年人，以及對軟體開發毫無概念的完全初學者。',
      studyTime:'8 - 20 小時 / 邏輯啟蒙至複雜遊戲實作',
      beginnerPath: {
        desc: '初階 (積木動畫)：由 MIT 媒體實驗室專為程式啟蒙開發的積木語言。藉由「創作者新手村」的拖拉式積木，在不碰代碼語法的情況下，拼湊出角色對話、舞台音樂與基礎的鍵盤方向鍵控制動畫。',
        link: 'https://scratch.mit.edu/ideas',
        studyTime: '8 - 12 小時 / 邏輯思維與遊戲啟蒙'
      },
      advancedPath: {
        desc: '進階 (遊戲邏輯與數學演算)：適合想挑戰複雜程式邏輯的學習者。學習如何使用 Scratch 的「自訂積木（建立函式）」、廣播系統（訊息傳遞）、變數克隆技術，以及如何運用數學座標公式編寫流暢的物理碰撞和關卡判斷。',
        link: 'https://scratch.mit.edu/studios/5387201/',
        studyTime: '15 - 20 小時 / 遊戲物理與算法實作'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['邏輯啟蒙','遊戲化'],
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
        link: 'https://www.duolingo.com/register',
        studyTime: '每天 10 分鐘 / 自主入門'
      },
      advancedPath: {
        desc: '適合想提升日常聽力與口說流暢度的學習者。進階路徑提供語音 AI 對話練習、長篇閱讀理解，以及連續答題挑戰，幫助您在外語社交情境中對答如流。',
        link: 'https://www.duolingo.com/super',
        studyTime: '每天 20 分鐘 / 進階特訓'
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
        link: 'https://tw.voicetube.com/channel/everyday',
        studyTime: '10 - 15 小時 / 聽力語感建立'
      },
      advancedPath: {
        desc: '適合想精進商業聽力與口說流暢度的自學者。挑戰「TED 演講」或「BBC 新聞」，嘗試關閉中文字幕，並使用平台內建的口說挑戰錄音比對系統進行連音特訓。',
        link: 'https://tw.voicetube.com/challenges/pronunciation',
        studyTime: '15 - 20 小時 / 商業演說實戰'
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
        link: 'https://musescore.org/zh-hant/handbook/tutorial-layout',
        studyTime: '5 - 8 小時 / 基礎排版記譜'
      },
      advancedPath: {
        desc: '複雜多聲部與交響樂編曲。引導自學者如何使用多聲部編輯系統、管弦樂配器編制、動態總譜（Linked Parts）製作，以及匯出高品質的 MIDI/XML 檔案。',
        link: 'https://musescore.org/zh-hant/handbook/3/basics',
        studyTime: '8 - 12 小時 / 多軌交響配器'
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
        link: 'https://pixlr.com/tw/x/',
        studyTime: '2 - 3 小時 / 快速平面編修'
      },
      advancedPath: {
        desc: '專業級分層修圖與數位暗房。使用 Pixlr E 專業介面，解鎖多圖層混合模式、魔術棒去背、曲線色彩調整（Curves），以及非破壞性濾鏡等仿 Photoshop 專業功能。',
        link: 'https://pixlr.com/tw/e/',
        studyTime: '4 - 6 小時 / 分層合成調色'
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
        link: 'https://www.junyiacademy.org/root/junyi-math',
        studyTime: '每單元約 2 - 3 小時 / 進度同步'
      },
      advancedPath: {
        desc: '適合面臨升學大考（會考/學測）的考生。利用均一的「AI 診斷系統」自動偵測學習弱點，產出個人化複習考卷，並提供歷屆大考真題的影音解析與詳盡複習路徑。',
        link: 'https://www.junyiacademy.org/exam',
        studyTime: '每科約 15 - 20 小時 / 升學備考衝刺'
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
        link: 'https://www.coolenglish.edu.tw/mcourse.php',
        studyTime: '8 - 12 小時 / 口說趣味啟蒙'
      },
      advancedPath: {
        desc: '高中生及成人全民英檢（GEPT）與多益（TOEIC）備考。提供豐富的官方模擬試題、寫作 AI 線上批改反饋，以及商業英語聽力特訓，全面提升實戰檢定成績。',
        link: 'https://www.coolenglish.edu.tw/hcourse.php',
        studyTime: '15 - 25 小時 / 證照檢定衝刺'
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
        link: 'https://www.khanacademy.org/math',
        studyTime: '15 - 20 小時 / 基礎觀念打底'
      },
      advancedPath: {
        desc: '大學先修課程（AP Calculus, Linear Algebra）或進階科學。深入探討微積分、有機化學、總體經濟學，藉由精熟學習（Mastery Learning）演算法，突破硬核理工知識。',
        link: 'https://www.khanacademy.org/science/ap-physics-1',
        studyTime: '25 - 35 小時 / 進階學科建模'
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
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/physics',
        studyTime: '2 - 3 小時 / 互動模擬探索'
      },
      advancedPath: {
        desc: '定量理科實驗與假設驗證。在『氣體屬性定律』或『量子力學模型』模擬中，收集多組數據，利用統計圖表進行科學建模，適合高中理科專題與畢設專案驗證。',
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/chemistry',
        studyTime: '4 - 6 小時 / 定量實驗與分析'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['模擬實驗','視覺化'],
      image:'assets/images/card-science.png',
      url:'https://phet.colorado.edu/', logo:'phet'
    },
    {
      id:'photography', platform:'攝影藝術',
      title:'攝影藝術 — 從光影構圖到數位暗房處理',
      description:'探索視覺故事的張力。初階學習光影曝光與構圖美學，進階掌握開源軟體 Darktable 的無損 RAW 後製與色彩管理。',
      extendedDesc:'攝影是瞬間的藝術，更是光影與色彩的交響。本課程整合了劍橋攝影學院的光影構圖教材與 Darktable 數位暗房實作。初階學習如何利用相機參數調控畫面情緒，進階則教導你如何處理 RAW 檔、調整直方圖，產出大師級影像。',
      whyRecommend:'理論與實作完美結合。將相機的操作原理與開源專業修圖軟體 Darktable 無縫對接，免去付費軟體訂閱負擔，實現極具張力的攝影視覺美學。',
      whoIsItFor:'適合想提升生活拍攝質感的初學者、想精進調色技巧的設計師，或想深入學習 RAW 檔數位暗房處理的攝影愛好者。',
      studyTime:'8 - 18 小時 / 美感曝光至數位暗房',
      beginnerPath: {
        desc: '初階 (光影構圖基礎)：學習用照片說故事的視覺美學。掌握相機的三大曝光核心要素：光圈、快門與感光度，並學習如何在日常生活中捕捉光線，運用經典的三分法、引導線與對稱構圖。',
        link: 'https://www.cambridgeincolour.com/tutorials/camera-exposure.htm',
        studyTime: '8 - 12 小時 / 基礎曝光與構圖美學'
      },
      advancedPath: {
        desc: '進階 (Darktable/修圖數位暗房)：掌握專業 RAW 檔編修與數位暗房技術。對接免費開源的 Darktable 軟體，學習非破壞性影像編輯、白平衡矯正、色彩曲線（Curves）、局部遮罩（Masking）與調色風格建立。',
        link: 'https://www.darktable.org/usermanual/en/',
        studyTime: '12 - 18 小時 / 暗房後製與 RAW 編修'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['光影構圖','開源修圖'],
      image:'assets/images/card-art.png',
      url:'https://www.darktable.org/', logo:'photography'
    },
    {
      id:'music', platform:'音樂創作',
      title:'音樂創作 — 數位編曲與樂理大師之路',
      description:'解鎖你的音樂創作天賦。初階使用 GarageBand 輕鬆編曲，進階透過 MuseScore 學習數位打譜與編曲理論。',
      extendedDesc:'音樂創作不再遙不可及。透過數位音訊工作站（DAW）與開源打譜工具，你可以將腦中的旋律化為真實的音符。初階介紹如何利用預製 Loops 進行創意堆疊，進階引導學習正統樂理與交響配器，實現原創夢想。',
      whyRecommend:'完全免費的數位編曲與記譜學習方案。內建大量智慧樂器與開源樂理教學小遊戲，讓看譜與編曲變得像玩遊戲一樣簡單，是培養藝術素養的必備資源。',
      whoIsItFor:'適合想為短片/動畫配樂的自學者、音樂愛好者、想考取樂理檢定的學子，以及想學習原創編曲的音樂新手。',
      studyTime:'6 - 20 小時 / 數位編曲至專業打譜',
      beginnerPath: {
        desc: '初階 (GarageBand 基礎)：零經費也能彈奏編曲！使用 GarageBand 的虛擬智慧樂器、現成高品質循環 Loops 庫與多軌混音，即使看不懂五線譜，也能在幾分鐘內親手拼湊出第一首 8 小節輕快背景音樂。',
        link: 'https://support.apple.com/zh-tw/guide/garageband-ipad/welcome/ipados',
        studyTime: '6 - 10 小時 / 數位編曲輕鬆入門'
      },
      advancedPath: {
        desc: '進階 (數位音樂編曲理論)：學習專業樂譜製作與數位編曲。結合互動樂理、三和弦/七和弦結構，並使用開源 MuseScore 進行交響配器與高品質 MIDI 匯出。',
        link: 'https://musescore.org/zh-hant/handbook',
        studyTime: '15 - 20 小時 / 交響打譜與配器'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['數位音樂','樂理打譜'],
      image:'assets/images/card-language.png',
      url:'https://musescore.org/', logo:'music'
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
