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
});
