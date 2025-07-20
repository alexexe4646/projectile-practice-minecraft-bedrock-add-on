@echo off
echo Copying Target Mod behavior pack and resource pack to Minecraft UWP...

REM Source and destination paths for behavior pack
set MINECRAFT_PATH=%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang
set BEHAVIOR_PACK_SOURCE=src\behavior_packs\target_block
set BEHAVIOR_PACK_TARGET=%MINECRAFT_PATH%\behavior_packs\TargetBloc
set RESOURCE_PACK_TARGET=%MINECRAFT_PATH%\resource_packs\TargetBloc
set RESOURCE_PACK_SOURCE=src\resource_packs\target_block

REM Check if behavior pack source directory exists
if not exist "%BEHAVIOR_PACK_SOURCE%" (
    echo ERROR: Behavior pack source directory does not exist: %BEHAVIOR_PACK_SOURCE%
    pause
    exit /b 1
)

REM Check if resource pack source directory exists
if not exist "%RESOURCE_PACK_SOURCE%" (
    echo ERROR: Resource pack source directory does not exist: %RESOURCE_PACK_SOURCE%
    pause
    exit /b 1
)

echo Removing existing target_block folders...
if exist "%BEHAVIOR_PACK_TARGET%" (
    echo Removing %BEHAVIOR_PACK_TARGET%
    rmdir /s /q "%BEHAVIOR_PACK_TARGET%"
)

if exist "%RESOURCE_PACK_TARGET%" (
    echo Removing %RESOURCE_PACK_TARGET%
    rmdir /s /q "%RESOURCE_PACK_TARGET%"
)

REM Create behavior pack destination directory if it doesn't exist
if not exist "%BEHAVIOR_PACK_TARGET%" (
    echo Creating behavior pack destination directory...
    mkdir "%BEHAVIOR_PACK_TARGET%"
)

REM Create resource pack destination directory if it doesn't exist
if not exist "%RESOURCE_PACK_TARGET%" (
    echo Creating resource pack destination directory...
    mkdir "%RESOURCE_PACK_TARGET%"
)

REM Copy behavior pack files, replacing existing ones
echo Copying behavior pack files...
robocopy "%BEHAVIOR_PACK_SOURCE%" "%BEHAVIOR_PACK_TARGET%" /E /IS /IT /IM /R:3 /W:5

if %ERRORLEVEL% LSS 8 (
    echo SUCCESS: Behavior pack files copied successfully!
) else (
    echo ERROR: Behavior pack copy operation failed with error level %ERRORLEVEL%
    pause
    exit /b 1
)

REM Copy resource pack files, replacing existing ones
echo Copying resource pack files...
robocopy "%RESOURCE_PACK_SOURCE%" "%RESOURCE_PACK_TARGET%" /E /IS /IT /IM /R:3 /W:5

if %ERRORLEVEL% LSS 8 (
    echo SUCCESS: Resource pack files copied successfully!
) else (
    echo ERROR: Resource pack copy operation failed with error level %ERRORLEVEL%
)

echo.
