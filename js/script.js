// ==========================================================================
// 🏆 [최상단 관리 영역] 2B KEYSTONE 포트폴리오 데이터 리스트
// ==========================================================================
// 새로운 프로젝트 인테리어를 오픈할 때는 아래 리스트의 맨 밑에 '형식 규칙'을 맞춰서 한 줄만 추가해 주시면 됩니다.
// 디렉토리 구조 매칭 가이드: portfolio/[folderName]/00.jpg (썸네일), 01.pdf (다운로드 PDF 파일)
const portfolioData = [
    { folderName: '01', title: '메탈릭 무드 카페', desc: '선과 면으로 설계한 프리미엄 카페 아키텍처, 메탈릭 무드로 구현한 정돈된 모던 스페이스', category: 'commercial' },
    { folderName: '02', title: '빛을 담은 구조의 미학', desc: '스틸 H빔의 선과 글래스 파사드의 면으로 설계한 복합 상업 아키텍처', category: 'commercial' },
    { folderName: '03', title: '공간이 사람을 모으는 샐러드 카페', desc: '라운지형 커뮤니티 정돈된 모던 스페이스', category: 'commercial' },
    { folderName: '04', title: '빛과 여백이 만드는 반려견과 함께 사는집', desc: ' 불필요한 장식을 덜어내고, 화이트 톤의 절제된 디자인으로 완성된 미니멀 인테리어', category: 'residential' },
    { folderName: '05', title: '성공한 남자의 시크릿 룸', desc: '바쁜 일정 속의 휴식처', category: 'residential' },
];


// ==========================================================================
// ⚙️ 하단 영역은 홈페이지 구동을 위한 핵심 엔진 시스템입니다. (수정 불필요)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 메인 히어로 슬라이더 구동 모듈
    const slides = document.querySelectorAll('.hero-slides .slide');
    let currentSlideIndex = 0;
    
    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }
    if (slides.length > 0) setInterval(nextSlide, 4000);

    // 2. 포트폴리오 데이터 그리드 썸네일 매칭 및 PDF 다운로드 앵커 자동 렌더링
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioGrid.innerHTML = portfolioData.map(item => `
            <a href="portfolio/${item.folderName}/00.pdf" download="${item.title}.pdf" class="portfolio-item ${item.category}">
                <div class="item-inner">
                    <div class="item-img" style="background-image: url('portfolio/${item.folderName}/00.jpg');"></div>
                    <div class="item-info">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </div>
            </a>
        `).join('');
    }

    // 3. 포트폴리오 주거공간/상업시설 분류 탭 필터링 시스템
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 4. GNB 메뉴바 및 로고 연동 - 스르륵 부드러운 스크롤 커스텀 물리 엔진
    const scrollLinks = document.querySelectorAll('nav a, .logo a');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); 
                    
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 90;
                    
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    customSmoothScroll(offsetPosition, 600); 
                }
            }
        });
    });

    // 가속도(Ease-In-Out) 기반 정밀 스크롤 연산 함수
    function customSmoothScroll(targetY, duration) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        function animationLoop(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            
            const nextScrollY = easeInOutQuad(timeElapsed, startY, distance, duration);
            
            window.scrollTo(0, nextScrollY);

            if (timeElapsed < duration) {
                requestAnimationFrame(animationLoop);
            } else {
                window.scrollTo(0, targetY);
            }
        }

        requestAnimationFrame(animationLoop);
    }
});