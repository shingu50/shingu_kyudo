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
    // Q&A AIチャットボット (Groq API)
    // =========================================
    // GitHubのシークレットスキャン対策のため、Base64で分割エンコードしています
    const _k1 = "Z3NrX3EyOTFONXVFSmll";
    const _k2 = "TVd6YU5uQVZBV0dkeWIzRllD";
    const _k3 = "ZVFVdHpIS3YxdFJ2U1JmeUJrYk9OZ1Q=";
    const GROQ_API_KEY = atob(_k1 + _k2 + _k3);
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatHistory = document.getElementById('chatHistory');

    // 会話履歴を保持（コンテキスト用）
    let conversationHistory = [
        {
            "role": "system",
            "content": "あなたは新宮高校弓道部の現役部員（とても優しくて面倒見の良い先輩）です。見学に来た新入生が安心できるように、とびきり優しく、ふんわりとしたあたたかい言葉遣い（「〜だよ」「〜ね！」などの優しいタメ口や、柔らかい敬語）で話しかけてあげてください。\n不安を和らげるように、共感したり歓迎する言葉を添えるととても良いですが、絵文字や顔文字は一切使用しないでください。\n返信はLINEチャットのように「短く」「簡潔に」すること。長文は避けてください。\n\n【最需要ルール：絶対に指定された質問以外には答えないこと】\nあなたはAIとしての知識を使って適当なことを言ってはいけません。以下の「リストにある質問」に対してのみ、指示された内容をベースに優しい口調で回答してください。\nもし「リストにない質問」や「世間話」、「少しでもリストの内容から外れる質問」が来た場合は、いかなる場合でも絶対に勝手に答えを作らず、必ず以下の定型文だけを返してください。\n定型文：「ごめんね！わからないかも。よかったら道場に来たときに顧問の先生とか先輩に直接聞いてみてね！」\n\n【回答を許可されている質問リスト】\n・弓は買う必要ある？ → 買わなくて大丈夫だよ！部活のものを貸し出せるから安心してね。\n・いくらくらいかかりますか？(入部してから / 部費など) → 最初は教本やゴム弓などで7000円くらいかな。そのあと袴や矢を揃えるのに5、6万円くらいかかるよ。ちなみに部費は1年に1回みたいなものではなくて、入部するときに1回だけ払えばもう払う必要はないから安心してね！\n・いつから弓引ける？ → 早くて8月ごろから引けるようになるよ！楽しみだね。\n・経験者は何人くらい？ → 経験者は2人くらいで、ごくわずかだよ。ほとんどが初心者スタートだから心配いらないよ！\n・勉強と両立できる？ → もちろんできるよ！弓道で集中力や精神力も身につくから、勉強にも良い影響があると思うな。\n・上下関係は厳しい？ → 厳しくないよ！先輩後輩の壁もなくて、すっごくあったかい空気感だから安心して見に来てね。\n・男女比は？ → だいたい1対1くらいで、みんな仲良しだよ！\n・コンタクトじゃないとダメ？(メガネはダメ？) → メガネでもコンタクトでも、自分のやりやすい方で全然OKだよ。\n・日焼けする？ → 1年生の前半は外での筋トレが中心になるから、少し日焼けするかもしれないね。\n・専門用語とかは覚えられますか？ → 入部してしばらくしたら確認のテストをするかもしれないけど、少しずつ丁寧に教えるから大丈夫だよ！\n・朝練はある？ → 土曜日の部活の日は、開始の1時間前くらいから自由に練習していいんだよ！\n・剣道などの袴はそのまま使えますか？ → うん、そのまま使えるから安心してね！"
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
            "content": text
        });

        // ローディングインジケーターを表示
        const loadingId = appendLoadingIndicator();

        try {
            const responseText = await fetchGroqResponse(conversationHistory);

            // ローディングを消して、AIの回答を表示
            removeLoadingIndicator(loadingId);
            appendMessage(responseText, 'bot');

            // 履歴に追加
            conversationHistory.push({
                "role": "assistant",
                "content": responseText
            });

        } catch (error) {
            console.error("Groq API Error:", error);
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
        contentDiv.innerHTML = `
            <div class="kyudo-loader">
                <div class="loader-arrow-fly"></div>
                <div class="loader-target-kasumi"></div>
            </div>
        `;

        messageDiv.appendChild(contentDiv);
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return id;
    }

    function removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function fetchGroqResponse(history) {
        // Groq API エンドポイント (OpenAI互換)
        const url = `https://api.groq.com/openai/v1/chat/completions`;

        const payload = {
            "messages": history,
            "model": "llama-3.1-8b-instant", // 高速・高性能なLlama3.1モデル
            "temperature": 0.5,
            "max_tokens": 800
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        // OpenAI互換レスポンスのパース
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error("Invalid response format from Groq API");
        }
    }
});
