document.addEventListener('DOMContentLoaded', () => {

    // ヘッダーのスクロール時のスタイル変更
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // モバイル用ハンバーガーメニューの実装
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('nav-mobile');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // メニューの開閉
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMobile.classList.toggle('active');

        // メニューが開いているときは背面のスクロールを無効化
        if (navMobile.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // リンククリック時にメニューを閉じる
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // スムーススクロールの実装 (aタグのハッシュリンク)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // ヘッダーの高さを考慮してスクロール位置を調整
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // スクロール時のフェードインアニメーション (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 要素が15%表示されたら発火
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // クラスを追加してアニメーションを実行
                entry.target.classList.add('is-visible');
                // 一度発火したら監視を解除
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // =========================================
    // Q&A AIチャットボット (Gemini API)
    // =========================================
    const GEMINI_API_KEY = "AIzaSyCytyUjNZ3fuPXjNO0qGDOUmK32f9FWXj4"; // User provided key
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatHistory = document.getElementById('chatHistory');

    // 会話履歴を保持（コンテキスト用）
    let conversationHistory = [
        {
            "role": "model",
            "parts": [{ "text": "あなたは新宮高校弓道部の現役部員です。見学に来た新入生に話しかけるような、親しみやすい先輩としてのフランクな言葉遣い（タメ口や軽い敬語）で話してね。\n返信はLINEのチャットのように「短く」「簡潔に」すること。長い文章は読みにくいので絶対に使わないで。\n\n以下の質問が来たら、指示通りに回答してね：\n・弓は買う必要ある？ → ない。部活のを使う。\n・いつから弓引ける？ → 早くて8月ごろ。\n・経験者は何人くらい？ → 数人程度(2人とか)\n・勉強と両立できる？ → できる。精神力も身につく。\n・上下関係は厳しい？ → ほぼない。めっちゃあったかい空気感。\n・男女比は？ → ほぼ1対1。\n・コンタクトじゃないとダメ？(メガネはダメ？) → メガネでもコンタクトでもOK。\n・日焼けする？ → 1年生の前半は筋トレが中心だからするかも。\n・専門用語とかは覚えられますか？ → 入部してしばらくしてからテストをする可能性があります。\n・朝練はある？ → 土曜日の部活の日に自由にできる。部活開始1時間前くらいから。\n・剣道などの袴はそのまま使えますか？ → 使えます。\n\nそれ以外の質問で、部費などうまく答えられない質問が来たら「詳しくは道場で顧問の先生や先輩に直接聞いてみてね！」と優しく案内してください。" }]
        }
    ];

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', handleChatSubmit);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });
    }

    async function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (!text) return;

        // ユーザーのメッセージを表示
        appendMessage(text, 'user');
        chatInput.value = '';
        chatSendBtn.disabled = true;

        // APIリクエスト用の履歴に追加
        conversationHistory.push({
            "role": "user",
            "parts": [{ "text": text }]
        });

        // ローディングインジケーターを表示
        const loadingId = appendLoadingIndicator();

        try {
            const responseText = await fetchGeminiResponse(conversationHistory);

            // ローディングを消して、AIの回答を表示
            removeLoadingIndicator(loadingId);
            appendMessage(responseText, 'bot');

            // 履歴に追加
            conversationHistory.push({
                "role": "model",
                "parts": [{ "text": responseText }]
            });

        } catch (error) {
            console.error("Gemini API Error:", error);
            removeLoadingIndicator(loadingId);
            appendMessage("すみません、現在エラーが発生しておりお答えできません。後ほどもう一度お試しください。", 'bot');

            // エラー時は最後のユーザー入力を履歴から消す（リトライしやすくするため）
            conversationHistory.pop();
        } finally {
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        // 改行を<br>に変換
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');

        messageDiv.appendChild(contentDiv);
        chatHistory.appendChild(messageDiv);

        // 最新のメッセージまでスクロール
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot loading';
        messageDiv.id = id;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

        messageDiv.appendChild(contentDiv);
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return id;
    }

    function removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function fetchGeminiResponse(history) {
        // v1beta の gemini-2.5-flash エンドポイント
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const payload = {
            "contents": history,
            "generationConfig": {
                "temperature": 0.5,
                "maxOutputTokens": 800,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // レスポンスのパース（安全確認）
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response format from Gemini API");
        }
    }
});
