# Reference: Audio / Headset

<overview>
Covers headset detection failures, audio auto-switch issues, microphone not recognized, Teams/Zoom audio problems, and speaker/output routing. This is the most common category for self-service resolution — L0 fixes roughly 40% of audio issues, L1 fixes another 40%.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Audio service stuck/deadlocked | HIGH | L0 (manual restart) or L1 (script) |
| Default device not set | HIGH | L0 |
| Exclusive mode lock (Teams/Zoom holding device) | MEDIUM | L0 |
| Driver corruption or outdated driver | MEDIUM | L1 |
| USB port power management disabling device | MEDIUM | L1 |
| Hardware fault (cable, port, headset itself) | LOW | L1 (confirm) → procurement |
| Bluetooth pairing conflict | MEDIUM | L0-L1 |
| Windows Update broke audio stack | LOW | L2 (rollback/patch) |
| Group Policy overriding audio settings | LOW | L2 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps (No Admin Required)

Present these one at a time. Confirm result after each.

**1. Check physical connection**
- USB: Firmly plugged in? Try a different USB port.
- 3.5mm: Fully inserted? (Push until click.)
- Bluetooth: Powered on? Paired? (Settings → Bluetooth & Devices → should show "Connected")
- If wireless: batteries charged?

**2. Close and reopen the audio application**
- Close Teams/Zoom/browser completely (check system tray — right-click → Quit, not just X)
- Reopen the application
- Test audio

**3. Set headset as default device**
- Right-click speaker icon in taskbar (bottom-right corner)
- Click "Sound settings"
- Under Output: select headset from dropdown
- Under Input: select headset microphone from dropdown
- Play a test sound (click "Test" button or play any audio)

**4. Disable exclusive mode**
- Press Windows + R → type `control` → Enter
- Click "Sound" → "Playback" tab
- Click headset → "Properties" → "Advanced" tab
- Uncheck "Allow applications to take exclusive control of this device"
- Click Apply → OK
- Test audio

**5. Restart Windows Audio services (no reboot)**
- Press Windows + R → type `services.msc` → Enter
- Find "Windows Audio" → right-click → Restart
- Find "Windows Audio Endpoint Builder" → right-click → Restart
- Unplug and replug headset
- Check Sound settings — headset should appear

**6. Restart the computer**
- Start → Power → Restart (not Shutdown — Restart clears more state)
- After restart, plug in headset and test

</l0_steps>

<l1_steps>

## L1 Tech Steps (Admin Required)

Continue after L0 steps exhausted.

**7. Run audio service restart script**
Execute `scripts/audio-service-restart.ps1` on the endpoint (via remote tools or elevated PowerShell).
- Captures: service stop/start, endpoint builder restart, device rescan
- After script: ask user to replug headset and test

**8. Update/reinstall audio driver**
- Open Device Manager → expand "Sound, video and game controllers"
- Right-click headset device → "Update driver" → "Search automatically"
- If no update found: right-click → "Uninstall device" → check "Delete driver software" → OK
- Restart the endpoint — Windows will reinstall the driver on boot
- Test audio after restart

**9. Check USB power management**
- Device Manager → expand "Universal Serial Bus controllers"
- For each USB Root Hub: right-click → Properties → Power Management
- Uncheck "Allow the computer to turn off this device to save power"
- Test headset in the same USB port

**10. Check for Windows Audio service dependency issues**
- In services.msc, check Windows Audio properties → Dependencies tab
- Verify all dependent services are running (RPC, Multimedia Class Scheduler)
- If any dependency is stopped, start it, then restart Windows Audio

**11. Bluetooth-specific (if applicable)**
- Remove the headset from Bluetooth devices
- Restart Bluetooth service (services.msc → "Bluetooth Support Service" → Restart)
- Re-pair the headset from scratch
- Test audio

**12. Check Event Viewer for audio errors**
- Event Viewer → Windows Logs → System
- Filter for Source: "Audiosrv" or "AudioEndpointBuilder"
- Look for errors in the last 24 hours
- Document any error codes for escalation

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Audio service returns specific error codes on restart (0x80070005, 0x80004005)
- Driver reinstall fails or driver cannot be found by Windows
- Issue recurs within hours of L1 fix (indicates persistent root cause)
- Event Viewer shows repeated AudioEndpointBuilder crashes
- Windows Update suspected of breaking audio (requires rollback analysis)
- Group Policy may be overriding local audio settings
- Multiple users reporting same audio issue (possible fleet-wide driver problem)

</l2_indicators>

<teams_zoom_specific>

## Teams/Zoom Audio Troubleshooting Add-On

If the issue is specifically with Teams or Zoom audio (headset works in other apps):

**L0:**
- In Teams: Settings → Devices → verify correct speaker and microphone selected
- In Zoom: Settings → Audio → verify correct speaker and microphone selected
- Make a test call (Teams: "Test call" button in Settings → Devices)

**L1:**
- Clear Teams cache: close Teams → delete contents of `%appdata%\Microsoft\Teams`
- Reinstall Teams if cache clear does not help
- Check if Teams is set to use "Default" device vs. specific device name

</teams_zoom_specific>
