---
sidebar_position: 1
---

# Peering

AS4242423777 · Open peering policy · WireGuard

For a new session, contact me on [Telegram](https://cloudc001.t.me) or by email at [cloud001@outlook.com](mailto:cloud001@outlook.com). Telegram is preferred; email replies are usually sent within 24 hours.

## Network

| ASN | DN42 IPv4 | DN42 IPv6 | Link-local |
| --- | --- | --- | --- |
| `4242423777` | `172.22.107.0/27` | `fdbb:aee:d9bd::/48` | `fe80::3777` |

## Peering policy

- WireGuard tunnels only.
- Multiprotocol BGP with Extended Next Hop and IPv6 link-local addressing is preferred. Other configurations are supported by request.
- The default WireGuard port is `2` followed by the last four digits of your ASN. Contact me for other port requirements.
- To use an address-family-specific endpoint, prefix the hostname with `4.` or `6.` (for example, `4.us.cloudc.dev`).
- A session may be removed after an extended period of unreachable downtime.
- Please keep latency below 50 ms where possible.

:::warning Mainland China node policy
CN nodes do not peer with nodes outside mainland China. Do not use them for unlawful cross-border traffic. Connections are monitored; violations will be blocked.
:::

## Nodes

| Node | Location | Provider | Endpoint | DN42 IPv4 | DN42 IPv6 |
| --- | --- | --- | --- | --- | --- |
| US-WEST | Los Angeles, US | IT7 Network | `us.cloudc.dev` | `172.22.107.4` | `fdbb:aee:d9bd::4` |
| JP | Osaka, Japan | IT7 Network | `jp.cloudc.dev` | `172.22.107.2` | `fdbb:aee:d9bd::2` |
| SG | Singapore | LegendVPS | `sg.cloudc.dev` | `172.22.107.5` | `fdbb:aee:d9bd::5` |
| HK | Hong Kong | WAWO.WIKI | `hk.cloudc.dev` | `172.22.107.6` | `fdbb:aee:d9bd::6` |
| DE | Falkenstein, Germany | c-servers / 44net | `de.cloudc.dev` | `172.22.107.7` | `fdbb:aee:d9bd::7` |
| CN | Mainland China | By request | By request | `172.22.107.3` | `fdbb:aee:d9bd::3` |

All nodes use ASN `4242423777` and link-local address `fe80::3777`.

## WireGuard public keys

| Node | Public key |
| --- | --- |
| US-WEST | `H7LRdH2HlvsKM/ftF7CEHIja8AnFV5c5tYJ1OSyrlnQ=` |
| JP | `TRsJBPvVUXBCDuiBDwte+YCbkjkIglfVm+M5NxOFfwk=` |
| SG | `EPgqX4UDrzirYgPbDf3t6+6XBWozuUEg4L2zWcPO5Xk=` |
| HK | `ZynDjBdOWAS1YjZzwdiSI4kbthisE2xgPiOHopdfIxQ=` |
| DE | `yJy4AxORf1c2VNvmVCzM9HYd6+xru17rc/N+946PODQ=` |
| CN | Contact me for connection details. |

## Network tools

- [DN42 Looking Glass](https://lg.dn42.cloudc.dev)
- [Service status](https://status.cloudc.dev)
