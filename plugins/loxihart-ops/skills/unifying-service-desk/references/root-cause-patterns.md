# Reference: Root Cause Patterns

<overview>
This reference catalogs known failure patterns that appear across multiple categories. When troubleshooting at L1+, check this list to see if the current issue matches a known pattern. Known patterns have documented fixes — applying them saves significant diagnostic time.

This is a living document. When L2+ resolves a new pattern, it should be added here via the `templates/known-error-entry.md` template.
</overview>

<patterns>

## Pattern 1: Windows Update Side Effects
**Signature:** Multiple tickets of different categories (audio, network, display, performance) all starting within 24-48 hours of a Windows Update deployment.
**Root cause:** A Windows Update changed drivers, services, or security settings that broke dependent functionality.
**Detection:** Check Windows Update history on affected devices — do they all share a recent update? Filter help desk tickets by creation date to see if volume spiked after a known update window.
**Fix:** Identify the specific KB, test rollback on one device. If rollback resolves, escalate to L3 for fleet-wide rollback or mitigation strategy.
**Prevention:** Staged update deployment with canary group. Monitor ticket volume 48 hours after each update ring.

## Pattern 2: Service Account Password Expiration
**Signature:** Multiple services or integrations fail simultaneously — scan-to-email stops, automated reports stop generating, SSO between apps breaks.
**Root cause:** A shared service account password expired and was not rotated in all dependent systems.
**Detection:** Check if the failed services all use the same service account. Check account's password expiration date in AD.
**Fix:** Update the password in AD, then update it in every system that uses the account. Document all dependent systems.
**Prevention:** Service account inventory with password rotation schedule. Use managed service accounts (gMSA) where possible.

## Pattern 3: DNS Propagation Delay
**Signature:** Some users can access a resource, others cannot. Works on some networks but not others. "It works if I use the IP address directly."
**Root cause:** DNS change has not propagated to all DNS servers or clients have stale cached entries.
**Detection:** nslookup from affected and unaffected machines — compare results. Check TTL on the DNS record.
**Fix:** For individual users: flush DNS cache. For widespread: verify DNS zone replication, check if all DNS servers have the updated record.
**Prevention:** Lower TTL before planned DNS changes. Verify replication after changes.

## Pattern 4: Group Policy Processing Failure
**Signature:** A setting that should be enforced organization-wide is not applying on specific machines. Or: a new policy is causing unexpected behavior on endpoints.
**Root cause:** GPO not linked to the correct OU, WMI filter excluding devices, RSoP showing unexpected policy results, or a new GPO conflicting with an existing one.
**Detection:** Run `gpresult /r` on affected and unaffected machines — compare applied GPOs. Run `rsop.msc` for detailed policy results.
**Fix:** Correct GPO linkage, fix WMI filter, resolve conflicts. `gpupdate /force` on affected endpoints.
**Prevention:** Test GPO changes in a pilot OU before broad deployment. Document GPO dependencies.

## Pattern 5: Certificate Expiration Cascade
**Signature:** Multiple services fail simultaneously — VPN drops, Wi-Fi auth stops working, websites show certificate warnings, email stops flowing.
**Root cause:** A root or intermediate certificate expired, causing all certificates issued by it to become untrusted.
**Detection:** Check certificate expiration dates on the failing services. Check the certificate chain — is a CA cert expired?
**Fix:** Renew the expired certificate and redeploy. For CA certificates, this requires L3 involvement.
**Prevention:** Certificate expiration monitoring with 30/14/7 day alerts. Inventory all certificates with expiration dates.

## Pattern 6: Profile Corruption (Roaming or Local)
**Signature:** One specific user has issues across multiple applications — Outlook crashes, Teams cache errors, application settings lost. Other users on the same machine are fine.
**Root cause:** The user's Windows profile (or roaming profile) is corrupted. Individual app caches may be corrupted within the profile.
**Detection:** Test with a fresh user profile on the same machine. If the issue disappears, the profile is the problem.
**Fix:** Rebuild the user profile. For roaming profiles: delete the server-side copy and let it recreate. Warn the user they may lose personalized settings.
**Prevention:** Regular profile health monitoring. Avoid storing large files in profile paths.

## Pattern 7: Dock Firmware Mismatch
**Signature:** USB peripherals disconnect randomly, display flickers, network drops intermittently — all through a docking station. Direct connection to laptop works fine.
**Root cause:** Dock firmware is outdated or incompatible with the laptop's current BIOS/driver version.
**Detection:** Check dock firmware version against manufacturer's latest. Compare with known-good dock of same model.
**Fix:** Update dock firmware using manufacturer's update tool. May require a specific sequence (dock disconnected, update via USB, reconnect).
**Prevention:** Include dock firmware in regular device update cycle.

## Pattern 8: Licensing Pool Exhaustion
**Signature:** New users or newly provisioned accounts cannot access applications. Existing users are fine. Error messages reference "no available licenses" or "license limit reached."
**Root cause:** All available licenses for a product are assigned. No free licenses in the pool.
**Detection:** Check license utilization in the admin portal (M365, application-specific). Are any licenses assigned to disabled or departed users?
**Fix:** Reclaim licenses from disabled accounts, departed employees, or unused assignments. If legitimately at capacity: procurement request.
**Prevention:** Monthly license utilization audit. Auto-reclaim licenses from accounts disabled > 30 days. Include license check in offboarding checklist.

## Pattern 9: Antivirus False Positive
**Signature:** A specific application or script suddenly stops working. "Access denied" or "file not found" errors when the file clearly exists. May affect all users running the same application.
**Root cause:** Antivirus quarantined or blocked a legitimate file, often after a signature update.
**Detection:** Check AV quarantine log for the affected file. Check if the AV signature database was recently updated.
**Fix:** Restore from quarantine, add exclusion for the legitimate file/path. Coordinate with security team to verify the file is indeed safe.
**Prevention:** Test AV signature updates in a pilot group. Maintain an approved exclusion list for known LOB applications.

## Pattern 10: DHCP Scope Exhaustion
**Signature:** New devices cannot get IP addresses. Existing connected devices are fine. New connections get 169.254.x.x (APIPA) addresses.
**Root cause:** DHCP scope has no available addresses. All IPs in the range are leased (or reserved but unused).
**Detection:** Check DHCP server console for scope utilization. Are there stale leases from devices no longer on the network?
**Fix:** Clean up stale leases, extend scope range, or reduce lease duration. May need to add a new scope if the subnet is genuinely at capacity.
**Prevention:** Monitor DHCP utilization with alerts at 80% and 90% capacity. Regular lease cleanup.

</patterns>

<adding_new_patterns>

## Adding New Patterns

When L2+ discovers a new recurring pattern, document it using `templates/known-error-entry.md` and add it to this file. A pattern qualifies for inclusion when it has occurred 3+ times and has a documented resolution.

</adding_new_patterns>
