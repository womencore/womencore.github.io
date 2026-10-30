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
