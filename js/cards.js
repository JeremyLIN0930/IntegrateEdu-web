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
    // 🎨 1. 數位設計類 (design)
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
      id:'substance3d', platform:'Adobe',
      title:'Substance 3D Painter — 3D 材質與貼圖繪製軟體',
      description:'業界標準的 3D 貼圖工具。初階學習模型烘焙與智慧材質，進階學習手繪舊化與生鏽細節。',
      extendedDesc:'Substance 3D Painter 是目前遊戲與影視產業的 3D 貼圖繪製標準。它支援即時的 3D 視口繪製，能將高度、粗糙度、金屬度等物理屬性直接畫在模型上，並支援智慧材質（Smart Materials）的自適應生成。',
      whyRecommend:'3D 材質渲染界的王者。直覺的圖層管理系統與即時物理渲染視窗，搭配強大的粒子筆刷，能輕易畫出極具寫實感的表面紋理。',
      whoIsItFor:'適合 3D 建模愛好者、遊戲美術設計師、動畫製作者，以及想精進模型貼圖寫實質感的學習者。',
      studyTime:'12 - 30 小時 / 材質入門至寫實後製',
      beginnerPath: {
        desc: '初階 (基礎烘焙與 Smart Materials)：學習 Substance 3D Painter 官方新手系列課程，掌握基礎的 3D 網格導入、法線貼圖烘焙（Baking），以及如何使用智慧材質套件快速鋪設模型基底。',
        link: 'https://substance3d.adobe.com/tutorials/courses/first-steps-with-substance-3d-painter',
        studyTime: '12 - 15 小時 / 材質基礎入門'
      },
      advancedPath: {
        desc: '進階 (手繪 Weathering 舊化與生鏽細節)：深入學習手繪遮罩、發光材質、自訂發電機（Generators）、以及在模型邊角手動疊加磨損、漏雨與金屬生鏽的 weathering 擬真細節。',
        link: 'https://substance3d.adobe.com/tutorials/courses/advanced-techniques-in-substance-3d-painter',
        studyTime: '15 - 30 小時 / 寫實舊化實務'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['3D貼圖','材質渲染'],
      image:'assets/images/card-design.png',
      url:'https://substance3d.adobe.com/', logo:'substance3d'
    },
    {
      id:'blender', platform:'Blender',
      title:'Blender — 免費開源 3D 動畫與建模套件',
      description:'完全免費的 3D 創作套件。初階掌握基礎幾何與多邊形建模，進階學習節點材質渲染與物理模擬。',
      extendedDesc:'Blender 是一個功能強大且完全免費開源的 3D 創作軟體。它涵蓋了建模、雕刻、材質、綁定、動畫、模擬、渲染及影像合成等全套工作流程，是獨立創作者與學子的首選。',
      whyRecommend:'完全免費、無商業授權限制的開源神作。功能廣泛且社群極度活躍，更新速度極快，足以與昂貴的商業 3D 軟體媲美。',
      whoIsItFor:'適合獨立遊戲開發者、3D 藝術家、影視動畫學生，以及想嘗試 3D 建模的跨領域自主學習者。',
      studyTime:'20 - 40 小時 / 多邊形建模至物理渲染',
      beginnerPath: {
        desc: '初階 (基礎幾何建模)：學習如何利用基礎幾何體進行擠出、倒角等編輯，掌握 Blender 的視角操作與快捷鍵，並親手完成一個經典的「低多邊形（Low-Poly）」小島模型。',
        link: 'https://www.blender.org/support/tutorials/',
        studyTime: '20 - 25 小時 / 基礎多邊形建模'
      },
      advancedPath: {
        desc: '進階 (節點渲染與布料物理模擬)：深入探討 Cycles 著色節點編輯器（Shading nodes）、布料與剛體物理模擬（Physics simulation），以及幾何節點程序化建模。',
        link: 'https://www.youtube.com/playlist?list=PL3UlaMy8_t82Hw1MvY2w6m5AoxJ3T5h5e',
        studyTime: '25 - 40 小時 / 程序化與動態模擬'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['3D建模','開源軟體'],
      image:'assets/images/card-art.png',
      url:'https://www.blender.org/', logo:'blender'
    },
    {
      id:'designquiz', platform:'設計主題庫',
      title:'設計系專屬繪畫與猜題主題庫導引',
      description:'提升手繪聯想與設計敏銳度。初階進行日常速寫與創意塗鴉猜題，進階挑戰設計史考題與造型語意解讀。',
      extendedDesc:'本資源整合了設計系學子不可或缺的手繪基本功與設計聯想訓練。透過經典的繪圖猜題機制，幫助使用者在遊戲中鍛鍊「將文字概念轉化為視覺造型」的敏銳度，適合術科備考與設計創意訓練。',
      whyRecommend:'結合遊戲化機制與設計系術科概念。能快速激發右腦的圖形聯想力，是破除設計思維瓶頸、增進快速速寫聯想力的趣味工具。',
      whoIsItFor:'適合準備設計科系術科考試的學生、插畫新手，以及希望提升自己「意象視覺化」能力的創意工作者。',
      studyTime:'5 - 15 小時 / 創意聯想與速寫特訓',
      beginnerPath: {
        desc: '初階 (日常速寫與創意塗鴉猜題)：使用日常隨手可得的物件與概念，進行 1 分鐘限時速寫。藉由簡單的手繪猜題，鍛鍊基本造型掌握能力與幾何線條聯想。',
        link: 'https://quickdraw.withgoogle.com/',
        studyTime: '5 - 8 小時 / 基礎聯想與速寫'
      },
      advancedPath: {
        desc: '進階 (設計史考題與造型語意解讀)：融入歷屆設計術科考試主題，練習將複雜的語意（如「永續」、「流動」）以極簡圖形表達，並進行同儕設計作品剖析與線上競猜交流。',
        link: 'https://skribbl.io/',
        studyTime: '8 - 15 小時 / 高級造型語意挑戰'
      },
      category:'design', categoryLabel:'🎨 設計',
      tags:['創意聯想','手繪練習'],
      image:'assets/images/card-design.png',
      url:'https://quickdraw.withgoogle.com/', logo:'designquiz'
    },

    // 💻 2. 資訊程式類 (code)
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
      id:'codecademy', platform:'Codecademy',
      title:'Codecademy — 互動式程式設計學習網站',
      description:'直觀的程式碼即時反饋平台。初階打好 HTML/CSS 語法基礎，進階學習網頁後端資料庫串接。',
      extendedDesc:'Codecademy 提供豐富的程式語言課程，以「做中學」為宗旨。使用者可以直接在網頁上寫 Code，平台會立即判斷正確性並給予詳細提示，非常適合需要系統化語法訓練的新手。',
      whyRecommend:'提供極為乾淨的互動式編輯器，提供即時的語法回饋，省去安裝本機編輯器的痛苦。課程循序漸進，並有明確的職涯學習地圖。',
      whoIsItFor:'適合想無痛跨入網頁開發、學習特定程式語言語法，以及需要結構化章節練習的程式初學者。',
      studyTime:'10 - 40 小時 / 語法基礎至後端資料庫',
      beginnerPath: {
        desc: '初階 (HTML基礎)：學習如何建立網頁的基本架構、標題、段落、表單，以及如何透過 CSS 樣式微調網頁顏色與字體，親手拼湊出第一個靜態網頁。',
        link: 'https://www.codecademy.com/learn/learn-html',
        studyTime: '10 - 15 小時 / 靜態網頁入門'
      },
      advancedPath: {
        desc: '進階 (網頁後端資料庫串接)：學習後端伺服器概念。引入 Node.js、Express 框架與 SQL 資料庫，建立能進行資料庫 CRUD（增刪改查）的動態全端網頁應用。',
        link: 'https://www.codecademy.com/learn/paths/web-development',
        studyTime: '25 - 40 小時 / 後端與資料庫實務'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['互動學習','語法手冊'],
      image:'assets/images/card-science.png',
      url:'https://www.codecademy.com/', logo:'codecademy'
    },
    {
      id:'unity', platform:'Unity',
      title:'Unity — 業界主流 3D/2D 遊戲開發引擎',
      description:'全球使用率最高的遊戲開發工具。初階製作第一人稱導航與 C# 控制器，進階實作 URP 渲染與敵人 AI。',
      extendedDesc:'Unity 是一款功能齊備的遊戲開發平台，廣泛應用於行動遊戲、虛擬實境（VR）與即時 3D 動畫製作。它具備強大的物理引擎、豐富的資產商店（Asset Store）與跨平台發佈能力，讓獨立開發者也能做出精美大作。',
      whyRecommend:'全球市佔率最高的跨平台遊戲引擎。擁有極為龐大的免費教學資源與 Asset Store 資產庫，並支援多平台一鍵匯出，是邁向遊戲設計師的必經之路。',
      whoIsItFor:'適合對遊戲開發有濃厚興趣、想撰寫 3D 物理互動邏輯的自學者，以及有多平台發行需求的獨立遊戲工作室。',
      studyTime:'25 - 60 小時 / 互動邏輯至 URP 渲染與 AI',
      beginnerPath: {
        desc: '初階 (基礎第一人稱導航與 C# 控制器)：透過 Unity 官方的「Creative Core」課程，學習如何建立 3D 場景、配置碰撞器、編寫基礎的 C# 移動腳本，並實作第一人稱視角走動。',
        link: 'https://learn.unity.com/pathway/unity-essentials',
        studyTime: '25 - 30 小時 / 遊戲引擎基礎'
      },
      advancedPath: {
        desc: '進階 (URP 渲染管線與 NPC 敵人生態 AI)：學習使用 Universal Render Pipeline（URP）打造絕美光影，編寫 NavMesh 自動尋路系統，並利用有限狀態機（FSM）實作具備攻擊與警戒行為的敵人生態 AI。',
        link: 'https://learn.unity.com/pathway/creative-core',
        studyTime: '35 - 60 小時 / 進階渲染與 AI 控制'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['遊戲開發','3D引擎'],
      image:'assets/images/card-programming.png',
      url:'https://unity.com/', logo:'unity'
    },
    {
      id:'w3schools', platform:'W3Schools',
      title:'W3Schools — 全球最大的網頁開發語法手冊',
      description:'最直覺的網頁語法查閱聖地。初階查閱 HTML/CSS/JS 字典，進階學習實務 API 呼叫與後端串接。',
      extendedDesc:'W3Schools 是網頁開發的百科全書。它以「Try It Yourself」著稱，將複雜的語法濃縮成簡短的範例程式，讓使用者可以直接在網頁上編輯修改並看到即時效果，是極佳的語法字典。',
      whyRecommend:'網頁工程師必備的語法字典。結構極清晰，程式碼範例短小精悍，查找語法非常快速，且隨附線上測試沙盒，是寫 Code 查資料的第一站。',
      whoIsItFor:'適合所有網頁開發者、需要時常查閱 CSS 屬性與 JS 方法的切版人員，以及需要快速語法參考的新手。',
      studyTime:'5 - 20 小時 / 語法檢索至實務 API 應用',
      beginnerPath: {
        desc: '初階 (語法字典查閱)：學習如何快速查閱 HTML 標籤屬性、CSS 選取器優先級、以及 JavaScript 的字串與陣列操作方法，並在線上沙盒中調整參數進行實驗。',
        link: 'https://www.w3schools.com/html/default.asp',
        studyTime: '5 - 10 小時 / 基礎語法檢索'
      },
      advancedPath: {
        desc: '進階 (實務 API 呼叫應用)：深入學習 Fetch API 與 AJAX 進行非同步資料請求、使用 JSON 資料格式、操作 Web Storage，以及串接第三方 Web API 載入動態數據。',
        link: 'https://www.w3schools.com/js/js_api_intro.asp',
        studyTime: '10 - 20 小時 / 非同步與 API 實務'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['語法字典','快速查閱'],
      image:'assets/images/card-science.png',
      url:'https://www.w3schools.com/', logo:'w3schools'
    },
    {
      id:'leetcode', platform:'LeetCode',
      title:'LeetCode — 程式演算法挑戰與面試備考平台',
      description:'軟體工程師求職演算法題庫。初階學習基礎資料結構，進階挑戰期中考級演算法與效能優化。',
      extendedDesc:'LeetCode 是全球程式工程師磨練演算法與準備技術面試的首選平台。收錄數千道程式題目，涵蓋陣列、字串、鏈結串列、二元樹、動態規劃等，支援多種程式語言並即時評分效能。',
      whyRecommend:'大廠技術面試的必考題庫。能訓練撰寫出高效率、低時間/空間複雜度的優質程式碼，是轉職與求職軟體工程師的必練兵工廠。',
      whoIsItFor:'適合大專院校資工學生備考、想提升資料結構基本功的程式學習者，以及準備軟體工程師求職面試的自學者。',
      studyTime:'50 - 200 小時 / 邏輯鍛鍊與演算法面試',
      beginnerPath: {
        desc: '初階 (基礎資料結構題目)：從 Easy 難度開始，專注於陣列（Array）、雙指標、基礎雜湊表（Hash Table）的題目，打好寫雙迴圈與條件判斷的底子，例如 Two Sum。',
        link: 'https://leetcode.com/explore/featured/card/the-leetcode-beginners-guide/',
        studyTime: '50+ 小時 / 資料結構打底'
      },
      advancedPath: {
        desc: '進階 (模擬程式期中考演算法挑戰)：挑戰 Medium 與 Hard 題目的經典演算法。深入學習深度優先搜尋（DFS）、廣度優先搜尋（BFS）、動態規劃（DP）以及滑動視窗等演算法，提高執行效能。',
        link: 'https://leetcode.com/problemset/all/',
        studyTime: '100+ 小時 / 演算法效能優化'
      },
      category:'code', categoryLabel:'💻 程式',
      tags:['演算法','面試求職'],
      image:'assets/images/card-exam.png',
      url:'https://leetcode.com/', logo:'leetcode'
    },

    // 📖 3. 語文學習類 (language)
    {
      id:'bbcenglish', platform:'BBC',
      title:'BBC Learning English — 英國官方免費英語學習網',
      description:'權威的道地英式英語資源。初階學習 6 分鐘日常英語與字彙，進階提升商業英語思辨與新聞聽力。',
      extendedDesc:'BBC Learning English 由英國國家廣播公司（BBC）營運，免費提供全球學子高品質的英語學習教材。網站每日更新，包含發音、單字、文法、聽力與商業英語，極具權威性與實用價值。',
      whyRecommend:'最權威、最純正的英式英語學習入口。資源完全免費且附有完整逐字稿與小測驗，涵蓋日常生活到職場專業，是練習聽力與道地口音的不二之選。',
      whoIsItFor:'適合想矯正英式發音、充實詞彙庫，或準備雅思（IELTS）等英式英語檢定考試的自主學習者。',
      studyTime:'20 - 50 小時 / 英式英語日常與實務訓練',
      beginnerPath: {
        desc: '初階 (6 Minute English 與發音)：透過聽 6 分鐘日常主題對話，搭配簡短的單字卡與逐字稿，無痛累積生活常用詞彙，並跟著官方發音指南特訓純正的英式連音。',
        link: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
        studyTime: '20 - 30 小時 / 基礎聽力發音建立'
      },
      advancedPath: {
        desc: '進階 (商業英語與新聞聽力)：挑戰「Lingohack」新聞英語，關閉文字稿直接收聽時事廣播，學習新聞報導中的高級字彙與句型結構，並掌握職場會議與郵件寫作的語氣語境。',
        link: 'https://www.bbc.co.uk/learningenglish/english/features/news-report',
        studyTime: '30 - 50 小時 / 高級新聞與職場英語'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['英式英語','聽力訓練'],
      image:'assets/images/card-language.png',
      url:'https://www.bbc.co.uk/learningenglish/', logo:'bbcenglish'
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
        desc: '初階 (生活日常會話)：建議選用「日常生活與休閒會話」短影音，開啟中英雙語字幕，利用單字即時點擊查詢與收藏功能，在情境中自然記憶單字。',
        link: 'https://tw.voicetube.com/channel/everyday',
        studyTime: '10 - 15 小時 / 聽力語感建立'
      },
      advancedPath: {
        desc: '進階 (商業英語與簡報會話)：挑戰「TED 演講」或「商業職場英語」，嘗試關閉中文字幕，並使用平台內建的口說挑戰錄音比對系統進行連音與語調特訓。',
        link: 'https://tw.voicetube.com/challenges/pronunciation',
        studyTime: '15 - 20 小時 / 商業演說實戰'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['英語','影片學習'],
      image:'assets/images/card-language.png',
      url:'https://tw.voicetube.com/', logo:'voicetube'
    },
    {
      id:'duolingo', platform:'Duolingo',
      title:'Duolingo — 遊戲化多國語言學習',
      description:'全球最受歡迎的免費語言學習 App，支援超過 40 種語言，用遊戲機制讓學習變得有趣。',
      extendedDesc:'Duolingo 將語言學習變成了一場令人上癮的遊戲冒險。每天只需 5 到 15 分鐘，透過聽、說、讀、寫四大核心訓練，搭配經驗值、連續天數、排行榜等遊戲化機制，讓學習不再枯燥。',
      whyRecommend:'Duolingo 將語言學習變成了一場驚喜的闖關冒險。利用零碎時間，透過聽說讀寫的個人化 AI 演算法，提供毫無壓力的多國語言口說與單字建立環境。',
      whoIsItFor:'適合想要利用每天 10 分鐘練習外語日常會話、擴展單字量，或是想在出國旅遊前快速掌握基礎問候語的學習者。',
      studyTime:'每天 10 分鐘 / 彈性進度',
      beginnerPath: {
        desc: '初階 (基礎單字破關)：用遊戲化的字卡拼湊、基礎單字連連看，每天 5 分鐘在無痛環境中建立新語言的語感，克服對外語發音的恐懼。',
        link: 'https://www.duolingo.com/register',
        studyTime: '每天 10 分鐘 / 自主入門'
      },
      advancedPath: {
        desc: '進階 (語法結構複習)：適合想提升日常聽力與口說流暢度的學習者。進階路徑提供語音 AI 對話練習、長篇閱讀理解，以及連續答題挑戰，深入理解複雜句型。',
        link: 'https://www.duolingo.com/super',
        studyTime: '每天 20 分鐘 / 進階特訓'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['多語言','遊戲化'],
      image:'assets/images/card-language.png',
      url:'https://www.duolingo.com/', logo:'duolingo'
    },
    {
      id:'teded', platform:'TED-Ed',
      title:'TED-Ed — 趣味動畫英文知識平台',
      description:'結合科普知識與英文學習。初階利用中文字幕進行知識理解，進階挑戰全英聽力與思辨問答。',
      extendedDesc:'TED-Ed 是 TED 旗下專為教育設計的品牌。它將世界頂尖學者與創作者的想法轉化為 3 到 5 分鐘的精美科普動畫，涵蓋科學、歷史、哲學等多元主題，是用趣味知識學英文的最佳利器。',
      whyRecommend:'內容生動有趣，將高難度科學概念圖形化。隨附豐富的「Think」思辨考題與「Dig Deeper」擴展閱讀文獻，是培養英語探究與批判性思考的最佳資源。',
      whoIsItFor:'適合討厭枯燥英文課、想同時充實人文與自然科普常識，以及需要練習高階長篇聽力的自主學習者。',
      studyTime:'15 - 30 小時 / 科普英語與思辨挑戰',
      beginnerPath: {
        desc: '初階 (中文字幕導讀)：開啟中英雙語字幕，專注於理解動畫中的科學或歷史脈絡，並在播放中隨時點擊查閱專有名詞，輕鬆熟悉科普對話。',
        link: 'https://ed.ted.com/lessons',
        studyTime: '15 - 20 小時 / 科普聽力引導'
      },
      advancedPath: {
        desc: '進階 (全英思辨與聽力演練)：關閉中文字幕進行盲聽，並完成影片後的「Think」問答測驗，挑戰如何用英文表達自己的科學假設或哲學觀點，進行深度閱讀擴展。',
        link: 'https://ed.ted.com/',
        studyTime: '20 - 30 小時 / 英語邏輯與思辨實作'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['科普英文','思辨問答'],
      image:'assets/images/card-science.png',
      url:'https://ed.ted.com/', logo:'teded'
    },
    {
      id:'ntuenglish', platform:'臺大開放式課程',
      title:'實用英文寫作 — 國立臺灣大學開放式課程',
      description:'臺大外文系權威寫作課。初階建立正確的英文句子與段落架構，進階解鎖邏輯論證與學術論文寫作。',
      extendedDesc:'本課程由台灣大學外文系提供，開放給所有自學者。課程系統性地從英文字詞選用、句子結構、段落發展，一路教授到長篇論說文與學術論文寫作，是提升寫作邏輯與正式文體表達的極佳管道。',
      whyRecommend:'臺大頂尖師資授課。不用付學費就能獲得與臺大在校生同等品質的英文寫作特訓，強調寫作邏輯、文法細節與段落連貫性，最能解決亞洲學子的寫作盲點。',
      whoIsItFor:'適合需要撰寫大專英文論文、準備出國留學檢定（托福/雅思寫作）、或職場上需要撰寫商務分析報告的英文中高級學習者。',
      studyTime:'24 - 40 小時 / 系統化英文寫作特訓',
      beginnerPath: {
        desc: '初階 (正確句子與段落架構)：理解五大基本句型、主詞動詞一致性、修飾語位置，並練習如何用主題句與支持句撰寫出結構嚴緊、無語法漏洞的標準英文段落。',
        link: 'http://ocw.aca.ntu.edu.tw/ntu-ocw/index.php/ocw/cou/101S203',
        studyTime: '24 小時 / 語法句型與段落基礎'
      },
      advancedPath: {
        desc: '進階 (邏輯論證與學術寫作)：學習論說文與分析寫作的組織結構。掌握如何進行邏輯推論、駁論，以及文獻引用與學術論文架構，讓文章更具說服力。',
        link: 'http://ocw.aca.ntu.edu.tw/ntu-ocw/index.php/ocw/cou/102S205',
        studyTime: '30 - 40 小時 / 邏輯寫作與學術論證'
      },
      category:'language', categoryLabel:'📖 語文',
      tags:['英文寫作','臺大開放課程'],
      image:'assets/images/card-exam.png',
      url:'http://ocw.aca.ntu.edu.tw/', logo:'ntuenglish'
    },

    // 🎭 4. 藝術文化類 (art)
    {
      id:'googlearts', platform:'Google',
      title:'Google Arts & Culture — 虛擬美術館與全球文化探索',
      description:'打破地理限制的藝術寶庫。初階進行虛擬博物館街景導覽，進階研讀全球藝術史專題文獻。',
      extendedDesc:'Google 與全球 2,000 多家知名藝術機構合作，將數百萬張珍貴名畫以超高畫質數位化。使用者可以透過街景技術足不出戶逛羅浮宮或大都會博物館，甚至可以放大到看清名畫上的每一道筆觸。',
      whyRecommend:'全球最大的數位藝術圖書館。提供極高解析度的文物掃描、3D 模型與 360 度實景街景，並有專業策展人撰寫的多元文化背景解說。',
      whoIsItFor:'適合藝術設計系學生、歷史愛好者，或想在做設計報告時尋找高清藝術原作素材與創作靈感的自學者。',
      studyTime:'10 - 20 小時 / 虛擬導覽與全球藝術史',
      beginnerPath: {
        desc: '初階 (虛擬博物館導覽)：使用 Google 街景技術，線上穿梭於紐約 MoMA、倫敦大英博物館展廳，一鍵將世界名畫放大至數十億像素，觀察最細微的筆觸與顏料質地。',
        link: 'https://artsandculture.google.com/partner',
        studyTime: '10 - 12 小時 / 虛擬美學感官探索'
      },
      advancedPath: {
        desc: '進階 (全球藝術史專題文獻)：研讀平台與藝術史學家合作推出的專題展覽。剖析古典畫派脈絡、研究工藝與文明演進史，深入探尋藝術品背後的政治社會文化背景。',
        link: 'https://artsandculture.google.com/project/art-history',
        studyTime: '12 - 20 小時 / 藝術史專題深度研究'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['虛擬美術館','藝術史'],
      image:'assets/images/card-art.png',
      url:'https://artsandculture.google.com/', logo:'googlearts'
    },
    {
      id:'metmuseum', platform:'大都會博物館',
      title:'大都會博物館開放資源庫 (Open Access Data)',
      description:'百萬件公有領域文物免版權下載。初階瀏覽與珍藏世界名畫，進階探索歷史文物學術考證資料。',
      extendedDesc:'紐約大都會博物館（The MET）提供 Open Access 政策，將館藏中超過 49 萬件公有領域的藝術品與文物高清影像釋出。這意味著你可以免費下載、修改、甚至商用這些世界級大師的珍貴之作。',
      whyRecommend:'無版權風險的高清創作素材庫。所有標註 CC0 的文物照片、雕塑模型與畫作均可自由使用，是藝術創作、網頁配圖或報告設計的無價寶庫。',
      whoIsItFor:'適合需要插圖素材的創作者、歷史研究者，以及對古典文明、文藝復興藝術感興趣的自學者。',
      studyTime:'8 - 15 小時 / 文物珍藏與學術目錄檢索',
      beginnerPath: {
        desc: '初階 (名畫珍藏與無版權下載)：學會使用 MET 線上檢索系統篩選標註「Open Access」的 CC0 高清畫作，了解其創作年份、媒材，並免費下載作為個人創作的靈感版（Mood Board）。',
        link: 'https://www.metmuseum.org/art/collection',
        studyTime: '8 - 10 小時 / 高清素材獲取與賞析'
      },
      advancedPath: {
        desc: '進階 (文物歷史考證與文獻研讀)：深入研讀 MET 官方釋出的展覽圖錄、文物學術考古研究報告，以及館員撰寫的修復紀錄，全面理解藝術品背後的文獻流變。',
        link: 'https://www.metmuseum.org/art/metpublications',
        studyTime: '10 - 15 小時 / 藝術考證與學術研讀'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['開放資源','免版權素材'],
      image:'assets/images/card-design.png',
      url:'https://www.metmuseum.org/', logo:'metmuseum'
    },
    {
      id:'npmonline', platform:'故宮博物院',
      title:'國立故宮博物院線上策展與 3D 導覽',
      description:'中華文物數位美學殿堂。初階體驗文物 3D 環景導覽，進階研讀歷史美學考據文獻。',
      extendedDesc:'故宮博物院將數十萬件珍貴國寶數位化，推出 3D 多媒體線上策展。使用者可以直接在線上將青銅器 360 度旋轉，放大觀看金文銘刻細節，搭配語音導覽，體驗傳統文化。',
      whyRecommend:'中華美學的極致數位化呈現。將深奧的古文字、山水畫皴法、瓷器窯址歷史轉為直覺的動態解說，是研究東方設計美學的必訪之地。',
      whoIsItFor:'適合對東方歷史美學感興趣者、中學歷史課後延伸學習者，或尋找古典東方色彩與圖騰靈感的設計師。',
      studyTime:'5 - 12 小時 / 文物導覽與東方美學',
      beginnerPath: {
        desc: '初階 (文物3D導覽與故事賞析)：進入 3D 線上展廳，使用拖拉與縮放功能細細觀賞故宮名瓷的釉色與青銅器銘文，並搭配多媒體解說影片了解其歷史故事。',
        link: 'https://theme.npm.edu.tw/3d/',
        studyTime: '5 - 8 小時 / 3D 文物環景賞析'
      },
      advancedPath: {
        desc: '進階 (歷史美學考據與專題研究)：閱讀故宮釋出的「故宮學術季刊」等專業考古報告。深入分析山水畫筆墨結構、瓷器窯址成分考證，以及古典園林空間規劃。',
        link: 'https://www.npm.edu.tw/Activity-Publications.aspx?sno=03001151&l=1',
        studyTime: '8 - 12 小時 / 歷史考證與專題研究'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['東方美學','3D文物'],
      image:'assets/images/card-art.png',
      url:'https://theme.npm.edu.tw/', logo:'npmonline'
    },
    {
      id:'webmuseum', platform:'WebMuseum',
      title:'WebMuseum — 巴黎網路美術館',
      description:'巴黎開源藝術教育典範。初階瀏覽古典歐洲畫家生平與作品，進階研究中世紀至現代畫派演變脈絡。',
      extendedDesc:'WebMuseum 是歷史最悠久的數位藝術博物館之一。它提供完整的歐洲畫派流變介紹，特別是巴黎古典與現代主義繪畫，是研究西方繪畫史的教科書。',
      whyRecommend:'歷史悠久的開源藝術百科全書。分類嚴謹，將藝術名家（從達文西到莫內、畢卡索）的生平與代表作進行系統化整理，是撰寫藝術報告的極佳文獻源。',
      whoIsItFor:'適合想深入理解西方美術史、研究古典畫家生平、以及撰寫油畫技法分析報告的學習者。',
      studyTime:'6 - 15 小時 / 畫家生平至畫派脈絡',
      beginnerPath: {
        desc: '初階 (畫家生平與作品瀏覽)：按畫家姓名首字母或年代索引，瀏覽達文西、米開朗基羅等名家的生平故事與代表性油畫大圖，學習分析其基礎畫面構圖。',
        link: 'https://www.ibiblio.org/wm/paint/auth/',
        studyTime: '6 - 8 小時 / 藝術家生平入門'
      },
      advancedPath: {
        desc: '進階 (畫派演變與繪畫技法研究)：深入研讀從中世紀宗教畫、文藝復興透視法、印象派光影技巧到立體主義的畫派演變史，並分析其色彩理論與歷史美學意義。',
        link: 'https://www.ibiblio.org/wm/paint/glo/',
        studyTime: '8 - 15 小時 / 西方畫派深度流變'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['西方繪畫','藝術史'],
      image:'assets/images/card-art.png',
      url:'https://www.ibiblio.org/wm/', logo:'webmuseum'
    },
    {
      id:'moma', platform:'MoMA',
      title:'MoMA 紐約現代藝術博物館 — 線上公開藝術課',
      description:'紐約現代藝術博物館官方課程。初階理解現代藝術的創作意圖，進階學習當代藝術的社會思辨。',
      extendedDesc:'紐約現代藝術博物館（MoMA）提供完全免費的線上課程。由館內資深策展人親自授課，解構從梵谷、畢卡索到當代裝置藝術的創作語意與社會意義，教導如何欣賞與分析現代藝術。',
      whyRecommend:'世界頂尖現代藝術館授課。課程安排專業，搭配大量的高清作品影像、藝術家訪談影片與討論區，能徹底打破「看不懂現代藝術」的困惑。',
      whoIsItFor:'適合當代設計師尋求思維突破、藝術系學生精進視覺分析，以及想提升當代審美與文化素養的自主學習者。',
      studyTime:'12 - 30 小時 / 現代藝術賞析至策展思維',
      beginnerPath: {
        desc: '初階 (現代藝術基本賞析)：學習 MoMA 的「What is Contemporary Art?」課程，透過了解藝術家使用的媒材、技法，掌握現代藝術的解讀框架，建立基礎審美。',
        link: 'https://www.coursera.org/moma',
        studyTime: '12 - 15 小時 / 現代藝術引導'
      },
      advancedPath: {
        desc: '進階 (當代藝術的社會思辨)：學習「Modern Art & Ideas」等專題。研究女性主義、環保議題、政治運動如何體現在藝術創作中，並探討現代藝術展覽的策劃邏輯與語意傳達。',
        link: 'https://www.coursera.org/learn/modern-art-ideas',
        studyTime: '15 - 30 小時 / 藝術議題與策展思維'
      },
      category:'art', categoryLabel:'🎭 藝術',
      tags:['現代藝術','官方線上課'],
      image:'assets/images/card-art.png',
      url:'https://www.coursera.org/moma', logo:'moma'
    },

    // 📈 5. 升學與跨領域類 (exam)
    {
      id:'junyi', platform:'均一',
      title:'均一教育平台 — 最懂台灣學生的教育平台',
      description:'教育部合作免費適性學習網。初階精熟國小到高中學科知識，進階探索高中職跨領域素養課程。',
      extendedDesc:'均一教育平台是台灣最具影響力的免費教育資源，由均一平台教育基金會營運，完全對應台灣 108 課綱。平台提供國小到高中的數學、自然、社會、英文等完整課程影片，每部影片搭配即時互動練習題。',
      whyRecommend:'台灣本土最具規模的 K-12 自主學習平台。完全對應教育部 108 課綱，利用 AI 技術診斷學習弱點，提供適性化的練習題與清晰的教學短片。',
      whoIsItFor:'適合國小、國中至高中在學學生課後複習、超前預習，或考生準備大考衝刺，以及家長輔導孩子課業的絕佳工具。',
      studyTime:'配合學校課程 / 長期自主學伴',
      beginnerPath: {
        desc: '初階 (基礎學科知識)：適合 K-12 在學學生進行基礎觀念複習。平台提供與學校課堂同步的單元教學影片，搭配簡單的概念自測，確保每個小觀念都融會貫通。',
        link: 'https://www.junyiacademy.org/root/junyi-math',
        studyTime: '每單元約 2 - 3 小時 / 進度同步'
      },
      advancedPath: {
        desc: '進階 (大考複習與跨領域探索)：適合面臨升學大考（會考/學測）的考生。利用均一的「AI 診斷系統」偵測學習弱點，規劃複習考卷，並提供歷屆大考真題的影音解析與跨領域探究課程。',
        link: 'https://www.junyiacademy.org/exam',
        studyTime: '每科約 15 - 20 小時 / 升學備考衝刺'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['K-12','台灣課綱'],
      image:'assets/images/card-exam.png',
      url:'https://www.junyiacademy.org/', logo:'junyi'
    },
    {
      id:'semiconductor', platform:'科技股分析',
      title:'台灣半導體與科技股產業分析與資產配置導讀',
      description:'科技產業財經通識。初階建立台積電/聯發科半導體產業鏈概念，進階挑戰半導體中下游財務與技術分析。',
      extendedDesc:'本資源專為台灣科技與財經跨領域學習者打造。深入介紹台灣半導體上游 IC 設計、中游晶圓代工與下游封裝測試的完整產業鏈，並解讀當前 AI 晶片製程趨勢，提供財務分析與股權研究框架。',
      whyRecommend:'結合科技與財經的跨領域實務。剖析台灣「護國神山群」的競爭優勢與技術壁壘，將艱深的微電子製程與財務指標轉為清晰易懂的圖表導讀。',
      whoIsItFor:'適合想跨足半導體產業鏈、研讀產業分析報告的商管或電機系學生，以及想學習基本股權分析與合理配置的理財自學者。',
      studyTime:'8 - 20 小時 / 產業鏈認知至財務估值',
      beginnerPath: {
        desc: '初階 (半導體產業鏈概念)：快速建立 IC 設計、晶圓代工（台積電）、封測（日月光）的上下游分工地圖，了解成熟製程與先進製程差異，以及 AI 伺服器供應鏈基本輪廓。',
        link: 'https://ir.tsmc.com/chinese/corporate-governance/annual-reports',
        studyTime: '8 - 10 小時 / 產業鏈基本功'
      },
      advancedPath: {
        desc: '進階 (財務與技術面深度資產配置)：深入研讀華邦電 (2337) 記憶體週期、達明 (3030) 機器人手臂關聯技術、國巨 (2327) 被動元件供需。學習如何閱讀損益表、追蹤毛利率與專利研發，建立個人化估值模型與配置策略。',
        link: 'https://mops.twse.com.tw/mops/web/t57sb01_q5',
        studyTime: '10 - 20 小時 / 高級財務估值與配置'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['半導體','財務分析'],
      image:'assets/images/card-exam.png',
      url:'https://mops.twse.com.tw/', logo:'semiconductor'
    },
    {
      id:'portfolio104', platform:'104學習歷程',
      title:'104 高校生與大學社群學習歷程設計指南',
      description:'學生專屬的學習成果展示指南。初階進行社群貼文排版與美學，進階學習數據分析與文案策展。',
      extendedDesc:'本資源由 104 升學導航與社群專家提供，教導高校生與大學生如何將雜亂的課外活動、專案成果、社團經驗，轉化為邏輯嚴謹、排版美觀、具備數據支撐的「學習歷程檔案（Portfolio）」。',
      whyRecommend:'升學轉折點必備的實用指南。提供眾多獲獎檔案範本，結合資訊圖表設計技巧與故事性撰寫手法，大幅提昇檔案的吸睛度。',
      whoIsItFor:'適合準備申請大學的高中生、正準備實習履歷的大學生，以及希望讓個人社群經營成效更有說服力的自主學習者。',
      studyTime:'5 - 12 小時 / 排版美學至數據策展',
      beginnerPath: {
        desc: '初階 (社群貼文排版美學)：學習如何將活動照片與文字排版得乾淨清爽，學會運用 Canva 製作簡明的前後對照圖，以及如何用「STAR 原則」寫出 150 字精練的活動摘要。',
        link: 'https://student.104.com.tw/hs/',
        studyTime: '5 - 8 小時 / 高校排版美學'
      },
      advancedPath: {
        desc: '進階 (數據分析與文案策展)：深入探討如何將專案成果量化（如：觸及率提昇 50%、降低 20% 成本），撰寫具說服力的核心反思，並以「策展人思維」架構出符合大學教授或人資喜好的個人履歷。',
        link: 'https://blog.104.com.tw/category/hr/recruitment-training/resume-writing/',
        studyTime: '8 - 12 小時 / 數據量化與文案策展'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['學習歷程','排版策展'],
      image:'assets/images/card-exam.png',
      url:'https://student.104.com.tw/', logo:'portfolio104'
    },
    {
      id:'sanheyuan', platform:'三合院規劃',
      title:'傳統建築三合院 Booths 展位空間規劃與施工指引',
      description:'融合文化遺產與策展設計。初階認識三合院展位基本結構，進階探討畢業展實體施工可行性結構。',
      extendedDesc:'這是一門將古典閩南傳統三合院建築的「埕、正身、護龍」空間語彙，轉化為現代創意展位設計（Booths）的跨領域指引。教導學子如何在限制的展覽空間中，融合傳統建築美學與結構安全。',
      whyRecommend:'極具在地文化深度與實作價值的指引。將三合院木構造卡榫原理應用在現代臨時展架上，能提供高度創新的策展思維與環保低碳的實體施工方案。',
      whoIsItFor:'適合空間設計系、建築系、策展設計學生，以及正準備新一代設計展（YODEX）或實體成果展的畢業生團隊。',
      studyTime:'10 - 25 小時 / 空間佈局至實體施工結構',
      beginnerPath: {
        desc: '初階 (三合院展位基本結構)：認識三合院的空間對稱性、主從關係（正身與左右護龍），學習如何將展櫃、投影區與參觀動線融入傳統建築比例中，繪製出 3D 概念圖。',
        link: 'https://www.culture.tw/',
        studyTime: '10 - 12 小時 / 空間佈局入門'
      },
      advancedPath: {
        desc: '進階 (畢業展實體施工結構分析)：分析新一代設計展（YODEX）展位規範。探討如何使用輕鋼架、木作木榫與低污染漆料實體搭建三合院概念展架，進行承重與安全結構分析。',
        link: 'https://www.yodex.com.tw/',
        studyTime: '12 - 25 小時 / 實體施工結構設計'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['傳統建築','空間展示'],
      image:'assets/images/card-design.png',
      url:'https://www.yodex.com.tw/', logo:'sanheyuan'
    },
    {
      id:'quickbento', platform:'桌遊研發',
      title:'Chef Quick Bento Battle 廚手快手便當大作戰桌遊研發',
      description:'桌遊產品設計與商業化實務。初階解析基礎卡牌平衡機制，進階學習實體桌遊盒裝印刷與拆模打樣。',
      extendedDesc:'這是一門將遊戲設計轉化為實體文創產品的跨領域實務。以原創桌遊《廚手快手便當大作戰》為案例，剖析如何從概念紙筆原型，一步步優化規則、包裝設計，最終對接商業印刷與量產打樣。',
      whyRecommend:'真實的桌遊產品商業化地圖。完美串聯「遊戲機制設計」與「工業包裝印刷」，讓自學者能全面掌握一個創意 IP 落地為實體商品的完整產業鏈。',
      whoIsItFor:'適合遊戲設計學生、玩具開發愛好者、原創 IP 創作者，以及想了解印刷工藝與實體打樣流程的自學者。',
      studyTime:'8 - 20 小時 / 機制設計至印刷商業化',
      beginnerPath: {
        desc: '初階 (基礎桌遊卡牌機制設計)：學習卡牌桌遊的「核心循環」、資源收集機制，如何利用 Excel 建立卡牌數值平衡表，並使用瓦楞紙與手繪完成可玩的紙筆測試原型。',
        link: 'https://boardgamegeek.com/thread/1013233/guide-to-board-game-design-references-and-resource',
        studyTime: '8 - 10 小時 / 卡牌機制平衡基礎'
      },
      advancedPath: {
        desc: '進階 (實體桌遊盒裝與印刷商業化)：探討紙張磅數、上光工藝、刀模線繪製。學習如何進行實體盒子拆模打樣、內襯泡棉防撞規劃，以及與印刷廠溝通打樣與估價流程。',
        link: 'https://www.printninja.com/resources/board-game-industry-standards',
        studyTime: '10 - 20 小時 / 印刷工藝與量產打樣'
      },
      category:'exam', categoryLabel:'📝 升學',
      tags:['桌遊設計','產品包裝'],
      image:'assets/images/card-art.png',
      url:'https://boardgamegeek.com/', logo:'quickbento'
    },

    // 🔬 6. 系統科學類 (science)
    {
      id:'phet', platform:'PhET',
      title:'PhET — 互動式科學模擬實驗',
      description:'科羅拉多大學開發的免費互動模擬。初階操作齒輪/力學/電路實驗，進階分析天文軌道與微積分模型。',
      extendedDesc:'PhET 互動式模擬實驗由科羅拉多大學波德分校開發，提供超過 160 個涵蓋物理、化學、生物、地球科學與數學的免費互動模擬。',
      whyRecommend:'科羅拉多大學開發的探究式互動實驗室。以滑鼠操作參數就能觀察電路、波的干涉或分子鍵結，將原本枯燥、太抽象的物理化學規律轉為極具趣味的動態實驗。',
      whoIsItFor:'適合覺得課本公式太抽象、想透過動手操作來探究物理化學規律的國高中生、理科教師與科學愛好者。',
      studyTime:'5 - 8 小時 / 探究式科學實作',
      beginnerPath: {
        desc: '初階 (趣味物理與化學實驗啟蒙)：利用拖拉式的虛擬實驗室（例如：『波的干涉』或『組裝電路』），親手調整參數，用眼睛『看見』電壓與波動等抽象科學物理概念。',
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/physics',
        studyTime: '2 - 3 小時 / 互動模擬探索'
      },
      advancedPath: {
        desc: '進階 (定量理科實驗與假設驗證)：在『氣體屬性定律』或『量子力學模型』模擬中，收集多組數據，利用統計圖表進行科學建模，並利用天文微積分模擬觀察雙星與多星運行規律。',
        link: 'https://phet.colorado.edu/zh_TW/simulations/category/chemistry',
        studyTime: '4 - 6 小時 / 定量實驗與分析'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['模擬實驗','物理化學'],
      image:'assets/images/card-science.png',
      url:'https://phet.colorado.edu/', logo:'phet'
    },
    {
      id:'nasa', platform:'NASA',
      title:'NASA 探索眼線上天文台',
      description:'NASA 官方實時 3D 太空觀察站。初階進行太陽系星座基本辨識，進階分析行星軌道與重力數據。',
      extendedDesc:'NASA Eyes 是美國國家航空暨太空總署開發的即時 3D 天文模擬工具。它利用真實的太空探測器數據，實時重現太陽系、系外行星以及所有航行中太空船的精確軌道與位置。',
      whyRecommend:'NASA 提供的權威太空資料庫。高解析度的 3D 視覺渲染與豐富的實時星體物理參數，能將遙遠冰冷的太空公式轉為生動、震撼的探索冒險。',
      whoIsItFor:'適合天文愛好者、物理科學生、或需要天文高精度數據進行科展模擬的學習者。',
      studyTime:'6 - 15 小時 / 太陽系漫遊至軌道動力學',
      beginnerPath: {
        desc: '初階 (太陽系漫遊與星體基本辨識)：搭乘虛擬太空船穿梭太陽系八大行星，觀賞火星表面 3D 全景，學習辨識八大行星的特徵、軌道順序與主要衛星。',
        link: 'https://eyes.nasa.gov/apps/solar-system/',
        studyTime: '6 - 8 小時 / 星體基礎辨識'
      },
      advancedPath: {
        desc: '進階 (行星軌道與探測器數據分析)：追蹤特定太空探測器的實時飛行軌道，獲取其重力彈弓效應參數，下載太空遙測光譜數據並分析行星引力場。',
        link: 'https://eyes.nasa.gov/',
        studyTime: '8 - 15 小時 / 探測器數據與重力演算'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['太空觀察','NASA官方'],
      image:'assets/images/card-science.png',
      url:'https://eyes.nasa.gov/', logo:'nasa'
    },
    {
      id:'gizmos', platform:'Gizmos',
      title:'ExploreLearning Gizmos — 互動科學探究平台',
      description:'全球主流科學探究模擬。初階學習基礎光合作用與力學天平，進階模擬複雜遺傳學與天體運行軌道。',
      extendedDesc:'Gizmos 是全球極受歡迎的數理探究實驗平台。提供 400 多個涵蓋物理、化學、生物、地球科學與數學的互動模擬實驗，特別強調「假設驗證」與「探究學習單」的引導。',
      whyRecommend:'極佳的探究式教案平台。每個模擬實驗都配有完整的學生引導單、教師詳解與隨堂測驗，能引導自學者進行標準的科學實驗建模。',
      whoIsItFor:'適合中學數理自學者、理科教師尋找互動教案素材，以及需要進行科學假設與對照組設計的學生。',
      studyTime:'8 - 20 小時 / 科學探究與假設驗證',
      beginnerPath: {
        desc: '初階 (基礎科學互動)：利用天平、溫度計、光譜儀等虛擬工具，探究「光合作用因子」或「槓桿原理平衡」等基礎科學實驗，完成對照組數據收集。',
        link: 'https://www.explorelearning.com/index.cfm?method=cResource.dspResourceCatalog',
        studyTime: '8 - 10 小時 / 基礎實驗操作'
      },
      advancedPath: {
        desc: '進階 (遺傳與天體軌道模擬)：模擬「自然選擇與基因遺傳」的演化機率、分析「萬有引力與衛星軌道」的多體運行規律，並撰寫實驗報告。',
        link: 'https://www.explorelearning.com/',
        studyTime: '10 - 20 小時 / 定量科學實驗與統計'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['數理探究','模擬實驗'],
      image:'assets/images/card-science.png',
      url:'https://www.explorelearning.com/', logo:'gizmos'
    },
    {
      id:'crashcourse', platform:'CrashCourse',
      title:'CrashCourse — 系統化科學速成班',
      description:'YouTube 最強科普教育頻道。初階利用中文字幕快速建立科學通識，進階研讀延伸文獻進行思辨挑戰。',
      extendedDesc:'由 Hank Green 等知名科普創作者發起的 CrashCourse 頻道，以高速、資訊密集、搭配爆笑手繪動畫而聞名全球。涵蓋物理、化學、生物、電腦科學等系統化大課，已成為最受歡迎的科普聖地。',
      whyRecommend:'資訊密度極高、邏輯清晰的動畫短片。能用 10 分鐘講透一章教科書的物理或化學核心概念，配有中文字幕，是突破學科理解瓶頸的神器。',
      whoIsItFor:'適合面臨大考想快速複習觀念的學生、想在極短時間內建立跨學科知識架構的自學者。',
      studyTime:'15 - 40 小時 / 跨學科系統化學習',
      beginnerPath: {
        desc: '初階 (中文字幕版通識)：學習「電腦科學速成班」或「生物學速成班」，開啟中文字幕，藉由生動的動態圖表與歷史趣事，快速理解底層核心邏輯（如 CPU 如何計算）。',
        link: 'https://www.youtube.com/user/crashcourse',
        studyTime: '15 - 20 小時 / 系統化學科通識'
      },
      advancedPath: {
        desc: '進階 (全英學科思辨與文獻探究)：閱讀影片附帶的學術研究文獻與教科書出處。挑戰寫出自己的思維導圖，並與全球社群參與學科論證，探究知識流變。',
        link: 'https://thecrashcourse.com/',
        studyTime: '20 - 40 小時 / 論文檢索與學科挑戰'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['科普知識','系列課程'],
      image:'assets/images/card-science.png',
      url:'https://thecrashcourse.com/', logo:'crashcourse'
    },
    {
      id:'scishow', platform:'SciShow',
      title:'SciShow — 全球科普探秘與科學論壇',
      description:'解密日常科學與前沿發現。初階解析身邊的科學冷知識，進階閱讀前沿學術論文進行科學論證。',
      extendedDesc:'SciShow 每天發布有趣的科學影片，解密奇特的自然現象、醫學新知與前沿科技。影片充滿好奇心與嚴謹的科學查證，帶領學習者站在科學的最前線。',
      whyRecommend:'即時性極強的前沿科學解讀。所有冷知識與奇特現象背後均有嚴謹的學術論文背書，是培養對自然界的好奇心與實事求是精神的最佳頻道。',
      whoIsItFor:'適合對世界充滿好奇心、想知道「為什麼」、想培養理性思維與科學素養的所有自主學習者。',
      studyTime:'10 - 25 小時 / 前沿科學探秘與實證',
      beginnerPath: {
        desc: '初階 (日常科學冷知識)：收看「SciShow Quick Questions」系列短片，探索「為什麼海水是鹹的」、「貓為什麼會發出呼嚕聲」等生活中的物理化學現象。',
        link: 'https://www.youtube.com/user/scishow',
        studyTime: '10 - 12 小時 / 生活科學啟蒙'
      },
      advancedPath: {
        desc: '進階 (前沿學術論文解讀)：深入影片下方引用的 Science、Nature 等前沿期刊文獻。學習如何剖析實驗設計、評估樣本量大小，培養批判性論文解讀能力。',
        link: 'https://www.scishow.com/',
        studyTime: '12 - 25 小時 / 論文解讀與前沿論證'
      },
      category:'science', categoryLabel:'🔬 科學',
      tags:['前沿科學','生活科普'],
      image:'assets/images/card-science.png',
      url:'https://www.scishow.com/', logo:'scishow'
    },

    // 📸 7. 視覺攝影類 (photography)
    {
      id:'camera-light', platform:'攝影美學',
      title:'基礎相機光影控制 — 三要素快門/光圈/ISO 互補原理',
      description:'攝影核心基本功。初階學習相機三大曝光參數與構圖，進階掌握商業棚拍與自然光影雕塑。',
      extendedDesc:'本課程對接頂尖攝影學觀念，帶你了解相機的三大曝光要素：光圈、快門、感光度，並學習如何在日常生活中捕捉光線，運用經典的三分法、引導線構圖等美學概念來說故事。',
      whyRecommend:'教導如何利用自然光與構圖說故事，由淺入深理解光線對照片情緒的控制，是建立美感視覺直覺的必修課。',
      whoIsItFor:'適合想提升日常拍攝質感、學習相機基本操作的攝影新手，或想為設計專案準備溫暖寫實素材的設計師。',
      studyTime:'8 - 12 小時 / 基礎美學與實作',
      beginnerPath: {
        desc: '初階 (三要素快門/光圈/ISO 互補原理)：學習如何用手機或入門相機，透過「三分法構圖」和尋找身邊的「單一光源」，並熟練操作光圈與快門組合拍出有溫度的畫面。',
        link: 'https://www.cambridgeincolour.com/tutorials/camera-exposure.htm',
        studyTime: '8 - 12 小時 / 基礎曝光與構圖美學'
      },
      advancedPath: {
        desc: '進階 (暖調自然光影商業棚拍構圖)：深入學習多光源室內棚拍布光、HDR 高動態範圍曝光疊加技術、動態追焦（Panning），以及大片感自然光人像商業構圖。',
        link: 'https://www.cambridgeincolour.com/tutorials/portraits.htm',
        studyTime: '12 - 18 小時 / 商業布光與進階曝光'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['曝光控制','攝影構圖'],
      image:'assets/images/card-art.png',
      url:'https://www.cambridgeincolour.com/', logo:'photography'
    },
    {
      id:'darktable', platform:'Darktable',
      title:'Darktable 數位暗房後製實務',
      description:'專業級無損影像後製。初階學習 RAW 檔基本色彩調整，進階掌握多重遮罩與色彩管理。',
      extendedDesc:'Darktable 是免費且開源的 RAW 檔編輯與調色工具，功能直追 Lightroom。本教學引導你如何進行非破壞性影像編輯，管理大量照片，並精準控制照片細節。',
      whyRecommend:'對接免費且開源的修圖軟體 Darktable，掌握媲美專業付費軟體的無損相片編修、白平衡矯正與風格色調建立。',
      whoIsItFor:'適合預算有限的自主學習者、獨立攝影師，以及想要深入掌握數位影像色彩校正與暗房處理的學子。',
      studyTime:'10 - 15 小時 / 專業後製技術學會',
      beginnerPath: {
        desc: '初階 (RAW檔基礎調色)：認識 RAW 檔與 JPEG 的差異，教您如何在 Darktable 中進行基礎的「白平衡校正」、調整曝光與飽和度，快速還原現場色彩。',
        link: 'https://www.darktable.org/usermanual/en/overview/basic_concepts/',
        studyTime: '5 - 8 小時 / RAW 檔基礎色彩'
      },
      advancedPath: {
        desc: '進階 (色調曲線與深度舊化濾鏡)：掌握 Darktable 強大的「局部遮罩」功能、色彩區域重建、膠片風格調色模擬，製作極具電影故事感的色調效果。',
        link: 'https://www.darktable.org/usermanual/en/darkroom/processing_modules/',
        studyTime: '10 - 15 小時 / 進階修圖與調色'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['開源修圖','RAW檔調色'],
      image:'assets/images/card-design.png',
      url:'https://www.darktable.org/', logo:'darktable'
    },
    {
      id:'studioschedule', platform:'製片管理',
      title:'攝影棚 Shooting 實務排程與多現場製片調度',
      description:'攝影棚製片與調度實務。初階設計基本鏡頭配置與拍攝腳本，進階探討多場景燈光與多機位製片調度。',
      extendedDesc:'攝影是一門光影與時間的調度藝術。本資源帶領學習者深入理解一個標準商業攝影棚的運作流程，從分鏡腳本撰寫、模特與攝影棚檔期排程，到現場多機位調度與燈光架設，培養專業製片思維。',
      whyRecommend:'極具實戰價值的攝影製片指南。完整解密商業大片背後的「時間表設計」與「多現場光源配置」，是從業餘攝影邁向專業製片的必讀教材。',
      whoIsItFor:'適合影視傳播系學生、獨立製片人、商業攝影助理，以及想了解大型拍攝專案專案管理的自主學習者。',
      studyTime:'10 - 24 小時 / 腳本設計至多機位製片',
      beginnerPath: {
        desc: '初階 (基本鏡頭配置與腳本)：學習如何使用簡單的試算表規劃「Shot List」，設計單一棚內拍攝的主光與輔助光佈局，並完成一份拍攝排程表。',
        link: 'https://www.studiobinder.com/blog/production-scheduling-template/',
        studyTime: '10 - 12 小時 / 拍攝腳本與排程入門'
      },
      advancedPath: {
        desc: '進階 (多場景燈光與多機位製片調度)：深入學習複雜的倫勃朗光、蝴蝶光等三點布光陣列，編寫大型多場景的製片排程（Call Sheets），並掌握多機位同步時間碼錄製。',
        link: 'https://www.studiobinder.com/blog/how-to-make-a-call-sheet/',
        studyTime: '12 - 24 小時 / 商業布光與複雜製片'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['製片管理','攝影棚實務'],
      image:'assets/images/card-art.png',
      url:'https://www.studiobinder.com/', logo:'studioschedule'
    },
    {
      id:'storyboarding', platform:'分鏡設計',
      title:'影像敘事與品牌廣告分鏡設計與剪輯實務',
      description:'用鏡頭語言說故事。初階以天仁茗茶 5 秒短片練習分鏡與構圖，進階學習真實商業短片敘事剪輯心法。',
      extendedDesc:'鏡頭是故事的眼睛。本指引透過經典的品牌廣告案例（如天仁茗茶、誠品等），教導自學者如何利用鏡頭大小、運鏡速度與蒙太奇剪輯，在極短時間內建立強烈的品牌故事感。',
      whyRecommend:'理論與實戰案例完美結合。將抽象的「電影鏡頭學」拆解為易於上手的實戰分鏡卡設計，能快速提升短影音創作者的畫面張力。',
      whoIsItFor:'適合想經營短影音的創作者、廣告企劃、多媒體學生，以及對影像美學有興趣的自主學習者。',
      studyTime:'8 - 20 小時 / 鏡頭設計至商業剪輯邏輯',
      beginnerPath: {
        desc: '初階 (天仁茗茶 5 秒短片分鏡)：以經典的「天仁茗茶」5 秒茶湯倒入與茶葉展開為例，學習如何繪製簡單的 3 格分鏡，設定特寫、運鏡箭頭，規劃極短影片的視覺起承轉合。',
        link: 'https://www.storyboardthat.com/zh-tw/articles/e/%E4%BB%80%E9%BA%BC%E6%98%AF%E5%88%86%E9%8F%A1%E8%85%B腳%E6%9C%AC',
        studyTime: '8 - 10 小時 / 基礎分鏡結構'
      },
      advancedPath: {
        desc: '進階 (真實商業短片敘事剪輯心法)：探討無縫剪輯（J-cuts/L-cuts）、節奏感混音（Sound design cues）、動態調色（LUTs 套用）以及如何運用蒙太奇剪輯手法，建構一分鐘具備強烈情感共鳴的品牌廣告。',
        link: 'https://www.premiumbeat.com/blog/cinematic-storytelling-guide/',
        studyTime: '10 - 20 小時 / 高級影像剪輯心法'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['影像敘事','分鏡剪輯'],
      image:'assets/images/card-design.png',
      url:'https://www.storyboardthat.com/', logo:'storyboarding'
    },
    {
      id:'photoinvoice', platform:'接案實務',
      title:'特約平面攝影商業接案合約與報價策略引導',
      description:'自由攝影師的商業生存法則。初階學習著作權歸屬與基礎報價單，進階掌握授權費談判與法律合約保護機制。',
      extendedDesc:'攝影接案不只考驗美感，更考驗商業與法律思維。本引導完整整理了特約平面攝影師常用的接案合約範本、報價單結構（版權費、執行費、後製費拆解），以及保障自身著作權的法律防衛武器。',
      whyRecommend:'自由工作者不可或缺的生存護身符。提供完全真實、可修改的合約範本與報價公式，幫助學生與自由攝影師避開無底限修改、收不到款等接案陷阱。',
      whoIsItFor:'適合開始承接平面攝影案件的學生、準備轉為全職自由攝影師的自學者，以及需要與客戶簽訂合約的視覺創作者。',
      studyTime:'5 - 12 小時 / 報價結構至合約法律防衛',
      beginnerPath: {
        desc: '初階 (著作權歸屬與基礎報價單)：學習著作權法中關於「受雇人與受託人」的核心概念，掌握報價單的三大支柱（工時、器材折舊、後製調整），編寫出第一份規範的報價單。',
        link: 'https://www.aiga.org/sites/default/files/2021-03/standard-form-of-agreement_0.pdf',
        studyTime: '5 - 6 小時 / 接案基本功與報價'
      },
      advancedPath: {
        desc: '進階 (授權費談判與法律合約保護)：深入學習「使用權限制」條款、排他性談判策略、違約金設計、以及如何利用預付款與分期付款機制保障自身財務安全。',
        link: 'https://www.format.com/magazine/resources/photography/photography-contract-template-guide',
        studyTime: '6 - 12 小時 / 合約法律與版權談判'
      },
      category:'photography', categoryLabel:'📸 攝影',
      tags:['接案合約','商業報價'],
      image:'assets/images/card-exam.png',
      url:'https://www.format.com/', logo:'photoinvoice'
    },

    // 🎵 8. 音樂創作類 (music)
    {
      id:'music-garageband', platform:'GarageBand',
      title:'GarageBand 數位音樂編曲入門',
      description:'零經費數位音樂工作站。初階使用預製 Loops 循環樂句堆疊，進階解鎖多軌音訊錄製與混音。',
      extendedDesc:'GarageBand 將你的 Apple 裝置變成一間功能齊備的錄音室。本教學教你如何運用虛擬智慧樂器、現成 Loops 音效與多軌混音，即使看不懂樂譜也能輕鬆創作出第一首歌。',
      whyRecommend:'零經費編曲神作。內建大量的高品質虛擬樂器與預製循環 Loops 庫，支援多聲部軌道錄音與混音，是快速學寫原創歌的捷徑。',
      whoIsItFor:'適合想為自己設計的動畫或短片配樂的創作者、音樂愛好者，以及想零門檻嘗試寫第一首歌的學習者。',
      studyTime:'6 - 10 小時 / 音樂編曲輕鬆入門',
      beginnerPath: {
        desc: '初階 (循環樂句 Loop 堆疊)：用觸控樂器錄製簡單旋律，教您如何剪輯音軌、調整音量大小，並使用現成的 Loop 循環庫拼湊出第一首輕快背景音樂。',
        link: 'https://support.apple.com/zh-tw/guide/garageband-ipad/welcome/ipados',
        studyTime: '6 - 10 小時 / 數位編曲輕鬆入門'
      },
      advancedPath: {
        desc: '進階 (虛擬樂器多軌混音與自動化曲線)：教您如何使用智慧樂器進行多聲部錄音，調整等化器（EQ）、加入混響與延遲音效，並利用自動化控制線（Automation）控制音軌動態。',
        link: 'https://support.apple.com/zh-tw/guide/garageband/welcome/mac',
        studyTime: '10 - 15 小時 / 多軌混音與編曲進階'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['數位音樂','編曲入門'],
      image:'assets/images/card-language.png',
      url:'https://www.apple.com/tw/mac/garageband/', logo:'garageband'
    },
    {
      id:'musescore', platform:'MuseScore',
      title:'MuseScore 免費開源製譜軟體',
      description:'開源的專業樂譜編輯軟體，免費使用所有核心功能。適合音樂創作者、學生與教師。',
      extendedDesc:'MuseScore 是一套完全免費且開源的專業樂譜編輯軟體，功能足以媲美付費商業軟體。你可以用它記譜、編曲、移調，並即時播放聆聽效果。它支援匯出 PDF、MIDI、MusicXML 等多種格式。',
      whyRecommend:'開源且功能完整的專業打譜軟體。介面友善，功能足以媲美昂貴的商業記譜軟體，並有龐大的全球社群提供百萬首免費樂譜下載交流。',
      whoIsItFor:'適合音樂系學生、合唱團或樂團編曲者、獨立音樂創作人，以及需要快速產出教學簡譜的音樂教師。',
      studyTime:'10 - 15 小時 / 記譜與編曲入門',
      beginnerPath: {
        desc: '初階 (簡譜與基礎五線譜輸入)：樂譜編輯與基礎記譜入門。教您如何建立單旋律五線譜，使用鍵盤與滑鼠手動輸入音符，並進行基礎的移調與記譜。',
        link: 'https://musescore.org/zh-hant/handbook/tutorial-layout',
        studyTime: '5 - 8 小時 / 基礎排版記譜'
      },
      advancedPath: {
        desc: '進階 (交響樂多聲部配器與總譜導出)：複雜多聲部與交響樂編曲。引導自學者如何使用多聲部編輯系統、管弦樂配器編制、動態總譜（Linked Parts）製作，以及匯出高品質的 MIDI 檔案。',
        link: 'https://musescore.org/zh-hant/handbook/3/basics',
        studyTime: '8 - 12 小時 / 多軌交響配器'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['打譜軟體','開源音樂'],
      image:'assets/images/card-art.png',
      url:'https://musescore.org/', logo:'musescore'
    },
    {
      id:'freelicks', platform:'樂理工作坊',
      title:'FreeLicks 線上樂理工作坊與即興思維',
      description:'解開聽覺與和弦的奧秘。初階學習基礎音程與大小調三和弦，進階分析爵士即興與離調代理和弦。',
      extendedDesc:'FreeLicks 致力於將深奧的古典與流行樂理視覺化。透過動態鍵盤、吉他指板展示，教導自學者如何快速在樂器上找到調性、理解和弦進行，並踏入音樂即興創作的大門。',
      whyRecommend:'極佳的流行與爵士樂理自學平台。將冰冷的音符轉為直覺的指板幾何圖案，能徹底打通自學者的樂理基礎，是擺脫死記硬背的利器。',
      whoIsItFor:'適合想看懂流行歌簡譜/吉他譜、想在鍵盤上彈出自己旋律的音樂自學者，以及想學習流行樂即興的琴手與吉他手。',
      studyTime:'10 - 20 小時 / 基礎和弦至流行爵士即興',
      beginnerPath: {
        desc: '初階 (基礎音程與大小調和弦)：掌握半音與全音概念，學習如何在鍵盤與指板上建構大三和弦與小三和弦，並理解經典的 I-V-vi-IV 流行歌和弦進行公式。',
        link: 'https://www.musictheory.net/lessons',
        studyTime: '10 - 12 小時 / 基礎音程與三和弦'
      },
      advancedPath: {
        desc: '進階 (爵士樂即興與離調和弦代理分析)：深入探討七和弦、延伸音（Tensions 9, 11, 13）、副屬和弦，以及如何運用調式音階進行爵士即興演奏。',
        link: 'https://www.jazzadvice.com/lessons/jazz-theory/',
        studyTime: '12 - 20 小時 / 爵士樂理與即興實作'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['樂理學會','爵士即興'],
      image:'assets/images/card-exam.png',
      url:'https://www.musictheory.net/', logo:'freelicks'
    },
    {
      id:'audacity', platform:'Audacity',
      title:'Audacity 開源音訊編輯與聲音後製實務',
      description:'完全免費的專業聲音處理器。初階學會基礎人聲錄音去噪，進階解鎖聲音特效濾鏡與 Podcast 商業母帶處理。',
      extendedDesc:'Audacity 是一款免費、開源且跨平台的多軌音訊編輯軟體。雖然介面古樸，但功能強大且資源消耗極低。它提供完整的頻譜分析、波形編輯、噪聲門去噪、壓限器與多種音效插件，是聲音創作者的隨身武器。',
      whyRecommend:'完全免費、體積輕量且功能卓越的開源音軌編輯器。擁有極為龐大的社群開發插件，是處理錄音去雜音、人聲剪輯、Podcast 製作的最佳良伴。',
      whoIsItFor:'適合需要剪輯訪談錄音的學生、Podcast 播客創作者、獨立音樂人，以及需要對音檔進行快速修剪去噪的自主學習者。',
      studyTime:'6 - 15 小時 / 音訊修剪至 Podcast 商業母帶',
      beginnerPath: {
        desc: '初階 (基礎人聲錄音去噪)：學習 Audacity 基礎錄音設置、波形修剪，掌握「噪聲抑制（Noise Reduction）」功能，一鍵濾除麥克風電流雜音與環境風噪。',
        link: 'https://manual.audacityteam.org/man/tutorial_copying_tapes_lps_or_minidiscs_to_cd.html',
        studyTime: '6 - 8 小時 / 基礎錄音去噪'
      },
      advancedPath: {
        desc: '進階 (聲音特效濾鏡與 Podcast 商業母帶處理)：深入學習多軌混音、使用等化器（EQ）微調人聲溫暖度、套用壓限器平衡音量動態，並進行符合廣播標準的 LOUDNESS 響度輸出。',
        link: 'https://manual.audacityteam.org/man/tutorial_mixing_a_narration_with_background_music.html',
        studyTime: '8 - 15 小時 / 多軌混音與母帶處理'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['音訊剪輯','音訊去噪'],
      image:'assets/images/card-language.png',
      url:'https://www.audacityteam.org/', logo:'audacity'
    },
    {
      id:'ableton', platform:'Ableton',
      title:'Ableton Live — 現代電子音樂編曲與 Live 演出啟蒙',
      description:'現代電音製作人必修課。初階在網頁互動沙盒中理解節拍與貝斯線，進階掌握 Ableton Live 的 Session 視窗即興。',
      extendedDesc:'Ableton 官方推出的線上互動網頁「Learning Music」，讓自學者直接在瀏覽器中敲擊節奏、調整貝斯線、編寫合成器旋律。課程用極具視覺美感與直覺的格線介面，解密電子音樂的結構與律動。',
      whyRecommend:'官方推出的無痛電音啟蒙網頁。直接在瀏覽器用網格點擊即可發聲、嘗試複節奏與和弦，是踏入電子音樂製作最具前瞻性的免費課程。',
      whoIsItFor:'適合對電子音樂、嘻哈 Beat 製作、Lo-Fi 配樂感興趣的自學者，以及想嘗試現代 DAW 創作邏輯的音樂愛好者。',
      studyTime:'8 - 18 小時 / 電音概念至實體 DAW 編曲',
      beginnerPath: {
        desc: '初階 (互動網格節奏與貝斯線)：利用 Ableton 官方的網頁互動沙盒，學習什麼是 4/4 拍、如何編排大鼓、小鼓、Hi-hat 的律動，並親手拼湊出第一個 Lo-Fi 電子循環節奏。',
        link: 'https://learningmusic.ableton.com/',
        studyTime: '8 - 10 小時 / 網頁互動電音啟蒙'
      },
      advancedPath: {
        desc: '進階 (Ableton Live Session 視窗即興)：深入理解 Ableton Live 的雙視窗架構。學習 Session 視窗的 Clip 觸發機制、如何錄製 MIDI、套用合成器濾鏡自動化曲線，完成第一首電音作品。',
        link: 'https://learningmusic.ableton.com/synths/play-with-synths.html',
        studyTime: '10 - 18 小時 / 合成器與實體 DAW 編寫'
      },
      category:'music', categoryLabel:'🎵 音樂',
      tags:['電子音樂','即興創作'],
      image:'assets/images/card-programming.png',
      url:'https://learningmusic.ableton.com/', logo:'ableton'
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
