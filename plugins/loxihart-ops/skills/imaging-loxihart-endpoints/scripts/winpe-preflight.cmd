@echo off
REM ============================================================================
REM  winpe-preflight.cmd
REM  Gate 2 pre-flight check, run from the WinPE command prompt (Shift+F10).
REM
REM  Read-only except for wpeutil InitializeNetwork and ipconfig /renew, both of
REM  which are idempotent and safe to re-run.
REM
REM  Usage:  winpe-preflight.cmd [MDT_HOST]
REM  Default MDT_HOST: [HOSTNAME]
REM
REM  Exit codes: 0 ready to PXE  |  1 no address  |  2 no MDT reachability
REM ============================================================================

setlocal enabledelayedexpansion

set "MDT_HOST=%~1"
if "%MDT_HOST%"=="" set "MDT_HOST=[HOSTNAME]"

echo.
echo ============================================
echo  WinPE PRE-FLIGHT - Gate 2
echo  Target MDT host: %MDT_HOST%
echo ============================================
echo.

echo [1/4] Initializing WinPE network stack...
wpeutil InitializeNetwork >nul 2>&1
if errorlevel 1 (
    echo       wpeutil returned an error. Continuing - it may already be up.
) else (
    echo       OK
)

echo.
echo [2/4] Requesting DHCP lease...
ipconfig /renew >nul 2>&1
echo       Done. Current configuration:
echo.
ipconfig | findstr /C:"IPv4 Address" /C:"Default Gateway"
echo.

echo [3/4] Verifying an address was assigned...
set "HAS_IP="
for /f "tokens=*" %%A in ('ipconfig ^| findstr /C:"IPv4 Address"') do set "HAS_IP=1"
if not defined HAS_IP (
    echo.
    echo   FAIL: no IPv4 address.
    echo   Next steps, in order:
    echo     1. Reseat the USB-to-Ethernet adapter, confirm the green link light.
    echo     2. If the adapter is Realtek, swap to a known-good Intel adapter.
    echo     3. Try a different Departmental VLAN port ^(1-24^).
    echo     4. Escalate to L2.
    echo.
    endlocal & exit /b 1
)
echo       OK - address present.

echo.
echo [4/4] Testing MDT reachability: %MDT_HOST%
ping -n 3 %MDT_HOST% >nul 2>&1
if errorlevel 1 (
    echo.
    echo   FAIL: no reply from %MDT_HOST%.
    echo   Resolve by name first. If name resolution is the problem, the literal
    echo   address may still answer - if it does, that is a DNS issue for L2.
    echo   If the server is also unreachable from a known-good workstation, L3.
    echo.
    endlocal & exit /b 2
)
echo       OK - MDT server replied.

echo.
echo ============================================
echo  PRE-FLIGHT PASS - ready to select IPv4 PXE
echo.
echo  Reminders before you continue:
echo   - Boot entry must be IPv4. The IPv6 entry fails silently.
echo   - Cable must be in a Departmental VLAN port, 1-24.
echo   - Record the port number now; you need it again at Gate 8.
echo   - NEVER select a KillDisk / Wipe / Erase task sequence.
echo ============================================
echo.

endlocal & exit /b 0
