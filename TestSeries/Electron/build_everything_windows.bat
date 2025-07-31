@echo off
setlocal enabledelayedexpansion

REM Set relative paths based on current (electron) directory
set "ELECTRON_PATH=%cd%"
set "TEST_SERIES_PATH=%ELECTRON_PATH%\.."
set "AI_PROCTOR_PATH=%TEST_SERIES_PATH%\..\ai-proctor-engine"
set "DIST_SOURCE=%TEST_SERIES_PATH%\dist"
set "ELECTRON_DIST_PATH=%ELECTRON_PATH%\dist-electron"
set "DIST_TARGET=%ELECTRON_DIST_PATH%\dist"

echo.
echo [1/4] Running CMake build in AI Proctor Engine...
pushd "%AI_PROCTOR_PATH%"
    if exist build (
        rmdir /s /q build
    )
    mkdir build
    cd build
    cmake .. -DCMAKE_TOOLCHAIN_FILE=../vcpkg/scripts/buildsystems/vcpkg.cmake
    cmake --build . --config Release
popd

echo.
echo [2/4] Building TestSeries React app...
pushd "%TEST_SERIES_PATH%"
    call npm run build
popd

echo.
echo [3/4] Ensuring 'dist' and 'dist-electron' folders exist...

REM Create dist folder if missing
if not exist "%DIST_SOURCE%" (
    echo    Creating missing dist folder...
    mkdir "%DIST_SOURCE%"
)

REM Create dist-electron folder if missing
if not exist "%ELECTRON_DIST_PATH%" (
    echo    Creating missing dist-electron folder...
    mkdir "%ELECTRON_DIST_PATH%"
)

REM Delete previous dist folder in dist-electron
if exist "%DIST_TARGET%" (
    echo    Removing old dist in dist-electron...
    rmdir /s /q "%DIST_TARGET%"
)

echo    Copying built files into dist-electron...
xcopy "%DIST_SOURCE%" "%DIST_TARGET%" /e /i /h /y >nul

echo.
echo [4/4] Building Electron Windows app...
cd /d "%ELECTRON_PATH%"
call npm run build:win

echo.
echo ✅ All steps completed successfully!
pause
