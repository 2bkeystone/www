// ==========================================================================
// 🏆 [최상단 관리 영역] 2B KEYSTONE 포트폴리오 데이터 리스트
// ==========================================================================
const portfolioData = [
    { folderName: '01', title: '메탈릭 무드 카페', desc: '선과 면으로 설계한 프리미엄 카페 아키텍처, 메탈릭 무드로 구현한 정돈된 모던 스페이스', category: 'commercial', imageCount: 14, ext: 'jpg' },
    { folderName: '02', title: '빛을 담은 구조의 미학', desc: '스틸 H빔의 선과 글래스 파사드의 면으로 설계한 복합 상업 아키텍처', category: 'commercial', imageCount: 13, ext: 'jpg' },
    { folderName: '03', title: '공간이 사람을 모으는 샐러드 카페', desc: '라운지형 커뮤니티 정돈된 모던 스페이스', category: 'commercial', imageCount: 12, ext: 'jpg' },
    { folderName: '04', title: '빛과 여백이 만드는 반려견과 함께 사는집', desc: '불필요한 장식을 덜어내고, 화이트 톤의 절제된 디자인으로 완성된 미니멀 인테리어', category: 'residential', imageCount: 46, ext: 'jpg' },
    { folderName: '05', title: '성공한 남자의 시크릿 룸', desc: '바쁜 일정 속의 휴식처', category: 'residential', imageCount: 11, ext: 'JPG' }, 
    { folderName: '06', title: '프리미엄 셀프스튜디오', desc: '스스로 주인공이되는 촬영공간', category: 'commercial', imageCount: 23, ext: 'jpg' }
];


// ==========================================================================
// ⚙️ 홈페이지 구동을 위한 최적화 엔진 시스템
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

    // 2. [최적화 수정] 포트폴리오 그리드 렌더링 - 001 대표 이미지 딱 1장만 다운로드
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioGrid.innerHTML = portfolioData.map((item, projIndex) => {
            const fileExt = item.ext || 'jpg';
            // 첫 화면 로드 효율 극대화를 위한 단일 대표 커버 경로
            const coverPath = `portfolio/${item.folderName}/detail/001.${fileExt}`;

            return `
                <div class="portfolio-item ${item.category}">
                    <div class="item-inner">
                        <div class="cover-container" data-proj="${projIndex}">
                            <div class="cover-img" style="background-image: url('${coverPath}');"></div>
                            <div class="zoom-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i> 크게 보기
                            </div>
                        </div>
                        <div class="item-info">
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 무거운 메인 슬라이더 로직은 완전 폐기하고 라이트박스 딥링크 모듈만 초기화
        initLightboxSystem();
    }

    // 3. 🚀 [지연 로드 탑재] 크게 보기 라이트박스 모달 제어 시스템
    let activeProjIndex = 0;
    let activeImgIndex = 0;

    function initLightboxSystem() {
        // 동적 라이트박스 마크업 주입 (중복 방지 안전 가드 장착)
        if (!document.getElementById('lightboxModal')) {
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
        }

        const modal = document.getElementById('lightboxModal');
        const track = modal.querySelector('.lightbox-track');
        const indicator = modal.querySelector('.lightbox-indicator');
        const closeBtn = modal.querySelector('.lightbox-close');
        const prevBtn = modal.querySelector('.lightbox-prev');
        const nextBtn = modal.querySelector('.lightbox-next');

        // 카드 클릭 시 팝업 가동
        document.querySelectorAll('.cover-container').forEach(container => {
            container.addEventListener('click', (e) => {
                const targetContainer = e.target.closest('.cover-container');
                activeProjIndex = parseInt(targetContainer.getAttribute('data-proj'), 10);
                activeImgIndex = 0; // 모달이 켜질 땐 항상 첫 번째 이미지부터 배치
                openLightbox();
            });
        });

        function openLightbox() {
            const project = portfolioData[activeProjIndex];
            const fileExt = project.ext || 'jpg';
            
            // 🚀 핵심 포인트: 사용자가 클릭한 "바로 그 순간"에만 해당 프로젝트 전체 이미지 기차 트랙을 실시간 빌드!
            let trackHtml = '';
            for (let i = 1; i <= project.imageCount; i++) {
                const imgNum = String(i).padStart(3, '0');
                const imgPath = `portfolio/${project.folderName}/detail/${imgNum}.${fileExt}`;
                trackHtml += `<div class="lightbox-slide" style="background-image: url('${imgPath}');"></div>`;
            }
            track.innerHTML = trackHtml;

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // 부모 스크롤 완벽 잠금
            
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
            document.body.style.overflow = ''; // 스크롤 잠금 해제
            track.innerHTML = ''; // 🌟 메모리 과부하 및 트래픽 점유 방지를 위한 HTML 강제 반환 자원 청소
        }

        // 제어 이벤트 바인딩
        nextBtn.addEventListener('click', nextLightbox);
        prevBtn.addEventListener('click', prevLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeLightbox(); });

        // 스마트 키보드 단축키 제어 엔진
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'flex') {
                if (e.key === 'ArrowRight') nextLightbox();
                if (e.key === 'ArrowLeft') prevLightbox();
                if (e.key === 'Escape') closeLightbox();
            }
        });
    }

    // 4. 포트폴리오 주거공간/상업시설 분류 탭 필터링 시스템
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

    // 5. GNB 메뉴바 및 로고 연동 - 스르륵 부드러운 스크롤 커스텀 물리 엔진
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