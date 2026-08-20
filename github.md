repo: seum8660/school_bible
branch: main
path: manuals/
role: source (학교시설치트키 요약문서 원본)

## Last sync
date: 2026-08-20T13:32:18Z
reference: hosungseo/korea100studio (main) — SKILL.md, references/authoring.md, references/composition-quality.md, references/profiles.md, schemas/board-v1.schema.json

### Updated in this project
- 해체계획서 검토 사례집 보드(demolrev) 신설 — 5레인·6단계·19노드, 보드 35개로 확장
- 요약문서 31번(건축물 해체계획서 검토 사례집) 추가, data/wf_docs.js·wf_tags.js 매핑 갱신
- 연결선 거터 라우팅 도입(korea100studio 참조) — 레인·단계 사이 빈 통로로 후보 경로 생성 후 무관 카드 관통(nodePiercings) 0건 경로 자동 선택

## Sync history
### 2026-08-19T00:00:00Z — seum8660/school_bible (manuals/) · hosungseo/korea100 (reference)
- 34개 보드 전체 흐름 구조 교정 — 15개 보드의 직렬 체인을 병렬 분기·합류·무지적 경로로 재배선(프로세스·사전기획·설계공모·설계입찰·설계용역발주·일상감사·기술자문·DfS·DfS수행·설계용역평가·감리방식·인허가·안전사고·예비준공·해체계획·시설물유지관리)
- 고립 노드 3건 연결(엔지니어링평가 N10, 시설물유지관리 F11, 품질관리 T12)
- 설계변경 보드 15개 노드에 기한·산출물·근거 해설·병목 서술 보강
- 연결선 렌더링 교체: 고정 9px 화살촉, 라운드 코너(r=9), 노드 변별 진출·진입점 분산, 수직 관통 회피, 회귀선 황동 점선
- 보드별 「한 장 요약」 블록 신설(data/wf_canvas.js) — 돈의 흐름 · 문서·데이터 흐름 · 개선 포인트 · 관련 보드 이동

### 2026-08-17T02:20:00Z — seum8660/school_bible (manuals/)
- 워크플로우 보드 34개로 확장 — 품질관리·사후정산·사후평가·엔지니어링 발주·CEMS·BF 인증·일요일 휴무제 신설
- 요약문서 25건(25~30번 추가), data/wf_docs.js 보드 매핑 갱신
- 연결선 라우팅 개선(겹침 분산·회귀선 황동색), 「전주기」 표기 PROCESS로 변경
- 인트로·전자책 지표 34개 보드 / 25개 요약문서로 갱신

## Screen map
| 화면 | 파일 |
| --- | --- |
| 인트로 표지 | 학교시설 워크플로우 인트로.dc.html |
| 워크플로우 보드 | 학교시설 워크플로우 보드.dc.html |
| 요약문서 보드 | 학교시설 요약문서 보드.dc.html |
| 전자책 | 학교시설 워크플로우 전자책.dc.html |
| 보드 데이터 | data/wf_boards.js, data/wf_tags.js, data/wf_docs.js, data/wf_canvas.js |
| 요약문서 원본 | manuals/*.html |

### 2026-08-16T07:13:12Z — seum8660/school_bible (manuals/)
- 요약문서 17·18번 최신본 재동기화(국토부고시 제2025-105호 · 내진보강 기술감리 2026.02판)
- data/wf_docs.js의 17·18번 발행정보·근거법령 갱신

### 2026-08-16T06:09:52Z — seum8660/school_bible (manuals/)
- manuals/ 요약문서 18건 복사, 첨부 DFS 요약을 24번으로 추가(총 19건)
- data/wf_docs.js 신설 — 문서 ↔ 워크플로우 보드 매핑
- 「학교시설 요약문서 보드」 페이지 추가, 보드 헤더에 바로보기 버튼 연결
### 2026-08-09 — hosungseo/korea100워크플로우차트 (reference)
- 워크플로우 차트 구성을 참고해 26개 보드를 레인×단계 격자로 재구성
