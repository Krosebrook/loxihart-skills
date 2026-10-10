# Network & VLAN

Everything needed at Gates 2 and 8. Source: *Computer Imaging & Deployment Reference Guide v3.1* §2.2, §4, §9.

## VLAN map

| VLAN | Ports | Purpose |
|---|---|---|
| Departmental | 1–24 | Imaging only. Sub-ranges: RAI 1–8, [CLIENT] 9–16, Loxihart 17–24 |
| Internet | 25–48 | Production, post-imaging |

Imaging **must** start on 1–24. The deployment share is not reachable from the production VLAN.

Record both port numbers. The "from" port at Gate 2 and the "to" port at Gate 8 both go in the ticket. This is the only record of where the device was physically patched, and it is what a future technician uses when the user says "it worked at my old desk."

## Published addresses

| Item | Value | Confidence |
|---|---|---|
| MDT / deployment server (name) | `[HOSTNAME]` | Documented, corroborated by Loxihart environment constants |
| MDT server (literal IP) | `[SUBNET]` | **Unverified — see discrepancy below** |
| Domain controller | `[HOSTNAME]` | Documented |
| Domain DNS servers | `[SUBNET]`, `[SUBNET]` | Documented |
| WinPE lease on Departmental VLAN | `[SUBNET]` | Documented |
| Host address on Internet VLAN | `[SUBNET]` | Documented |

### Discrepancy worth knowing about

The source document says MDT is reachable only from the Departmental VLAN, but publishes the MDT address inside `[SUBNET]`, which it also calls the production range — while WinPE on the Departmental VLAN gets `[SUBNET]`. Those cannot all be literally true as an isolation statement.

The workable reading: the Departmental VLAN routes to `[SUBNET]`, and access to the deployment share is restricted by ACL rather than by lack of a route. That also explains why the domain controller and DNS servers on `[SUBNET]x` are reachable during domain join.

Practical consequence: **resolve by name, not by the literal IP.** Use `ping [HOSTNAME]`. If name resolution is the thing that is broken, fall back to the literal and flag it — if the literal works when the name does not, that is a DNS problem for L2, not a you problem.

## Adapters

WinPE driver coverage, not throughput, is what matters here.

| Preferred (Intel) | Acceptable | Avoid (Realtek) |
|---|---|---|
| StarTech USB31000S | Anker USB-C Hub | Generic RTL8153 |
| Dell DA300 | Lenovo ThinkPad USB-C | TP-Link UE300 |
| Intel I210-T1 | HP USB-C Dock G5 | UGREEN USB 3.0 Ethernet |

Realtek-based adapters frequently lack WinPE drivers. The failure presents as a PXE timeout — visually identical to a dead port, a dead cable, or a down PXE server. Swapping to a known-good Intel adapter is a thirty-second test that eliminates the most common cause; do it before you open a ticket against the server.

Cable: Cat5e or Cat6, six feet or longer. Confirm a green link light before assuming anything about software.

## WinPE verification

```cmd
ipconfig /all
ping [HOSTNAME]
```

Expect a lease in the imaging range and a reply from the server.

If there is no address:

```cmd
wpeutil InitializeNetwork
ipconfig /renew
```

`wpeutil InitializeNetwork` starts the WinPE networking stack. It is idempotent and safe to run more than once.

Escalation order for no connectivity, cheapest first:
1. Reseat the adapter, confirm the link light.
2. Swap to a known-good Intel adapter.
3. Try a different Departmental port, 1–24.
4. Test the server from a known-good domain-joined workstation. If that also fails, it is server-side → L3.

## Post-migration verification

After moving to a port in 25–48:

```powershell
ipconfig                      # address in production range
ping 8.8.8.8                  # external reachability
nslookup google.com           # external DNS
ping [HOSTNAME]           # internal reachability, still required
```

All four. Internet-but-no-DC means the device will fail GPO refresh, logon script execution, and eventually cached-credential expiry. It looks fine on the bench and breaks in week two.

## Pre-flight from a workstation

Before walking to the bench, confirm the deployment infrastructure is actually up:

```powershell
ping [HOSTNAME]
Test-NetConnection -ComputerName [HOSTNAME] -Port 445
```

`TcpTestSucceeded : True` on 445 means the deployment share is answering. A successful ping with a failed 445 means the host is up but the share or its service is not — that is L3, and knowing it before you unbox the laptop saves an hour.
