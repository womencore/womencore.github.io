# womencore 홈페이지 파일

- index.html — 한글 메인 (복직근이개 설명, 1분 자가진단, 프로그램, 후기, 코치, FAQ)
- en/index.html — 영문 페이지
- husband/index.html — 남편용 페이지
- assets/ — 스타일, 스크립트, 사진 (수업 사진 속 참가자 얼굴은 모자이크 처리)

## 오픈 전에 채울 것 (assets/site.js 맨 위)
1. kakao: 카카오톡 채널 주소 (입력 완료)
2. leadForm: 자가진단 연락처를 받을 구글폼
   - 구글폼에 단답형 4개(이름, 연락처, 출산 시기, 결과)를 만들기
   - 폼 미리보기 → 페이지 소스에서 entry.숫자 4개와 주소를 찾아 넣기
   - action은 .../formResponse 로 끝나는 주소

## 검색 노출
1. 도메인 연결 후 index.html·en/index.html의 canonical·hreflang 주석, sitemap.xml의 DOMAIN, robots.txt의 Sitemap 줄을 실제 주소로 바꾸기
2. 네이버 서치어드바이저·구글 서치콘솔에 사이트 등록 → 받은 확인 코드를 index.html의 meta 주석 자리에 넣기 → sitemap.xml 제출
3. 네이버는 블로그·카페 결과가 위쪽을 차지해요. 네이버 블로그 글에서 홈페이지로 링크를 꾸준히 걸어 주세요.

## SNS 최근 소식 (홈페이지 하단, 날짜 자동 표시)
GitHub Actions가 매일 아침 인스타그램·유튜브(·네이버 블로그) 최신 게시물을 가져와 assets/feed.json에 저장하고, 홈페이지가 날짜와 함께 보여 줘요. 게시물이 없으면 이 칸은 숨겨지고 채널 링크만 보여요.

1. 유튜브: 채널 ID가 이미 들어 있어요. 따로 할 일 없음.
2. 인스타그램: behold.so 무료 가입 → 인스타 계정 연결 → Add feed → JSON 선택 → 나오는 주소(https://feeds.behold.so/...)를
   .github/workflows/update-feed.yml 의 BEHOLD_URL: "" 따옴표 안에 붙여 넣기 (무료: 최근 6개, 하루 1번 갱신)
3. 네이버 블로그를 쓰면 같은 파일 NAVER_BLOG_ID에 블로그 아이디 넣기
4. GitHub 저장소 Actions 탭 → 'SNS 피드 업데이트' → Run workflow 로 바로 한 번 실행
※ .github 폴더가 업로드되지 않았다면: Add file → Create new file → 이름에 .github/workflows/update-feed.yml 입력 후 내용 붙여 넣기
