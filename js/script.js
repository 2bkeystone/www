// ==========================================================================
// 🏆 [최상단 관리 영역] 2B KEYSTONE 포트폴리오 데이터 리스트
// ==========================================================================
// imageCount: 상세 이미지 총 개수 (설정하신 숫자만큼 001부터 자동으로 생성됩니다)
// ext: 확장자 명 (대소문자 구분 필수, 입력하지 않으면 기본 'jpg'로 처리됩니다)
const portfolioData = [
    { folderName: '01', title: '메탈릭 무드 카페', desc: '선과 면으로 설계한 프리미엄 카페 아키텍처, 메탈릭 무드로 구현한 정돈된 모던 스페이스', category: 'commercial', imageCount: 14, ext: 'jpg' },
    { folderName: '02', title: '빛을 담은 구조의 미학', desc: '스틸 H빔의 선과 글래스 파사드의 면으로 설계한 복합 상업 아키텍처', category: 'commercial', imageCount: 13, ext: 'jpg' },
    { folderName: '03', title: '공간이 사람을 모으는 샐러드 카페', desc: '라운지형 커뮤니티 정돈된 모던 스페이스', category: 'commercial', imageCount: 12, ext: 'jpg' },
    { folderName: '04', title: '빛과 여백이 만드는 반려견과 함께 사는집', desc: '불필요한 장식을 덜어내고, 화이트 톤의 절제된 디자인으로 완성된 미니멀 인테리어', category: 'residential', imageCount: 46, ext: 'jpg' },
    { folderName: '05', title: '성공한 남자의 시크릿 룸', desc: '바쁜 일정 속의 휴식처', category: 'residential', imageCount: 12, ext: 'JPG' }, // 대문자 JPG 대응
    { folderName: '06', title: '프리미엄 셀프스튜디오', desc: '스스로 주인공이되는 촬영공간', category: 'commercial', imageCount: 23, ext: 'jpg' }
];


// ==========================================================================
// ⚙️ 하단 영역은 홈페이지 구동을 위한 핵심 엔진 시스템입니다.
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

    // 2. 포트폴리오 데이터 그리드 & 좌우 로테이트 이미지 슬라이더 동적 렌더링
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioGrid.innerHTML = portfolioData.map((item, projIndex) => {
            let slidesHtml = '';
            const fileExt = item.ext || 'jpg';
            
            for (let i = 1; i <= item.imageCount; i++) {
                const imgNum = String(i).padStart(3, '0');
                const imgPath = `portfolio/${item.folderName}/detail/${imgNum}.${fileExt}`;
                // 대형 보기 연동을 위해 프로젝트 인덱스와 이미지 인덱스를 데이터 속성으로 주입
                slidesHtml += `<div class="slide-img" data-proj="${projIndex}" data-img="${i - 1}" style="background-image: url('${imgPath}');"></div>`;
            }

            return `
                <div class="portfolio-item ${item.category}" data-max="${item.imageCount}">
                    <div class="item-inner">
                        <div class="slider-container">
                            <div class="slider-track">
                                ${slidesHtml}
                            </div>
                            <button class="slider-btn prev-btn" aria-label="이전 이미지"><i class="fa-solid fa-chevron-left"></i></button>
                            <button class="slider-btn next-btn" aria-label="다음 이미지"><i class="fa-solid fa-chevron-right"></i></button>
                            <div class="slider-indicator">1 / ${item.imageCount}</div>
                        </div>
                        <div class="item-info">
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 슬라이더 및 라이트박스 시스템 초기화
        initPortfolioSliders();
        initLightboxSystem();
    }

    // 2-1. 포트폴리오 각각의 카드 슬라이더 동작 제어 함수
    function initPortfolioSliders() {
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            const track = item.querySelector('.slider-track');
            const prevBtn = item.querySelector('.prev-btn');
            const nextBtn = item.querySelector('.next-btn');
            const indicator = item.querySelector('.slider-indicator');
            const max = parseInt(item.getAttribute('data-max'), 10);
            let current = 0;

            function updateSlider() {
                track.style.transform = `translateX(-${current * 100}%)`;
                if (indicator) {
                    indicator.textContent = `${current + 1} / ${max}`;
                }
            }

            // stopPropagation으로 버튼 클릭 시 대형보기 모달이 열리는 버그 방지
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                current = (current === 0) ? max - 1 : current - 1;
                updateSlider();
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                current = (current === max - 1) ? 0 : current + 1;
                updateSlider();
            });
        });
    }

    // 2-2. 🚀 [신규 엔진] 크게 보기 라이트박스 모달 제어 시스템
    let activeProjIndex = 0;
    let activeImgIndex = 0;

    function initLightboxSystem() {
        // 동적 라이트박스 HTML 구조를 body 끝에 자동 주입
        const modalHtml = `
            <div id="lightboxModal" class="lightbox-modal">
                <span class="lightbox-close" aria-label="닫기">&times;</span>
                <button class="lightbox-control lightbox-prev" aria-label="이전 이미지"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="lightbox-control lightbox-next" aria-label="다음 이미지"><i class="fa-solid fa-chevron-right"></i></button>
                <div class="lightbox-content">
                    <div class="lightbox-track"></div>
                </div>
                <div class="lightbox-indicator"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('lightboxModal');
        const track = modal.querySelector('.lightbox-track');
        const indicator = modal.querySelector('.lightbox-indicator');
        const closeBtn = modal.querySelector('.lightbox-close');
        const prevBtn = modal.querySelector('.lightbox-prev');
        const nextBtn = modal.querySelector('.lightbox-next');

        // 카드 안의 이미지를 클릭하면 대형 보기 작동
        document.querySelectorAll('.slide-img').forEach(img => {
            img.addEventListener('click', (e) => {
                activeProjIndex = parseInt(e.target.getAttribute('data-proj'), 10);
                activeImgIndex = parseInt(e.target.getAttribute('data-img'), 10);
                openLightbox();
            });
        });

        function openLightbox() {
            const project = portfolioData[activeProjIndex];
            const fileExt = project.ext || 'jpg';
            
            // 모달 전용 전체 이미지 가로 기차트랙 빌드
            let trackHtml = '';
            for (let i = 1; i <= project.imageCount; i++) {
                const imgNum = String(i).padStart(3, '0');
                const imgPath = `portfolio/${project.folderName}/detail/${imgNum}.${fileExt}`;
                trackHtml += `<div class="lightbox-slide" style="background-image: url('${imgPath}');"></div>`;
            }
            track.innerHTML = trackHtml;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // 뒤쪽 본문 스크롤 잠금
            
            updateLightbox();
        }

        function updateLightbox() {
            const project = portfolioData[activeProjIndex];
            track.style.transform = `translateX(-${activeImgIndex * 100}%)`;
            indicator.textContent = `${activeImgIndex + 1} / ${project.imageCount}`;
        }

        function nextLightbox() {
            const project = portfolioData[activeProjIndex];
            activeImgIndex = (activeImgIndex === project.imageCount - 1) ? 0 : activeImgIndex + 1;
            updateLightbox();
        }

        function prevLightbox() {
            const project = portfolioData[activeProjIndex];
            activeImgIndex = (activeImgIndex === 0) ? project.imageCount - 1 : activeImgIndex - 1;
            updateLightbox();
        }

        function closeLightbox() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // 본문 스크롤 해제
            track.innerHTML = ''; // 메모리 반환
        }

        // 제어 이벤트 바인딩
        nextBtn.addEventListener('click', nextLightbox);
        prevBtn.addEventListener('click', prevLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeLightbox(); });

        // ⌨️ 스마트 키보드 단축키 제어 엔진 추가
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'flex') {
                if (e.key === 'ArrowRight') nextLightbox();
                if (e.key === 'ArrowLeft') prevLightbox();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    // 3. 포트폴리오 주거공간/상업시설 분류 탭 필터링 시스템
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            
            const portfolioItems = document.querySelectorAll('.portfolio-item');
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