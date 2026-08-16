#!/usr/bin/env bash
# workflow 자동 업로드 (macOS / Linux)
#   1) 이 파일을 로컬 저장소 폴더(workflow) 안에 둡니다.
#   2) 프로젝트 압축본을 풀어 같은 폴더에 덮어씁니다.
#   3) 터미널에서  ./push.sh  ("커밋 메시지" 는 선택)
set -e
cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[오류] 이 폴더는 git 저장소가 아닙니다."
  echo "       git clone https://github.com/seum8660/workflow.git"
  exit 1
fi

echo "[1/4] 원격 변경사항 받는 중..."
git pull --rebase

echo "[2/4] 변경 파일 확인..."
git add -A
if git diff --cached --quiet; then
  echo "       변경된 파일이 없습니다."
  exit 0
fi
git diff --cached --name-status

MSG="${1:-update $(date '+%Y-%m-%d %H:%M')}"
echo "[3/4] 커밋: $MSG"
git commit -m "$MSG"

echo "[4/4] 업로드 중..."
git push

echo "완료 — https://github.com/seum8660/workflow"
