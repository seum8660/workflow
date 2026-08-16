@echo off
chcp 65001 > nul
setlocal

REM ============================================================
REM  school_bible 자동 업로드
REM  1) 이 파일을 로컬 저장소 폴더(school_bible) 안에 둡니다.
REM  2) 프로젝트 압축본을 풀어 같은 폴더에 덮어씁니다.
REM  3) 이 파일을 더블클릭합니다.
REM ============================================================

cd /d "%~dp0"

git rev-parse --is-inside-work-tree > nul 2>&1
if errorlevel 1 (
  echo [오류] 이 폴더는 git 저장소가 아닙니다.
  echo        먼저 아래 명령으로 저장소를 내려받으세요:
  echo.
  echo        git clone https://github.com/seum8660/school_bible.git
  echo.
  pause
  exit /b 1
)

echo [1/4] 원격 변경사항 받는 중...
git pull --rebase
if errorlevel 1 (
  echo [오류] pull 실패. 충돌이 있는지 확인하세요.
  pause
  exit /b 1
)

echo [2/4] 변경 파일 확인...
git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo        변경된 파일이 없습니다. 종료합니다.
  pause
  exit /b 0
)
git diff --cached --name-status

echo.
set "MSG=%~1"
if "%MSG%"=="" set /p MSG=커밋 메시지 (엔터=자동): 
if "%MSG%"=="" for /f "tokens=*" %%d in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm\""') do set "MSG=update %%d"

echo [3/4] 커밋: %MSG%
git commit -m "%MSG%"

echo [4/4] 업로드 중...
git push
if errorlevel 1 (
  echo [오류] push 실패. 로그인 정보나 권한을 확인하세요.
  pause
  exit /b 1
)

echo.
echo 완료. https://github.com/seum8660/school_bible
pause
