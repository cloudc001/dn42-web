---
sidebar_position: 1
---

import CopyPublicKey from '@site/src/components/CopyPublicKey';

# Peering

AS4242423777 · Open peering policy · WireGuard

For a new session, contact me on [Telegram](https://cloudc001.t.me) or by email at [cloud001@outlook.com](mailto:cloud001@outlook.com). Telegram is preferred; email replies are usually sent within 24 hours.

For self-service peering, use the [CloudC001 Telegram bot](https://t.me/cloudc001bot).

## Network

| ASN | DN42 IPv4 | DN42 IPv6 | Link-local |
| --- | --- | --- | --- |
| `4242423777` | `172.22.107.0/27` | `fdbb:aee:d9bd::/48` | `fe80::3777` |

## Peering policy

- WireGuard tunnels only.
- Multiprotocol BGP with Extended Next Hop and IPv6 link-local addressing is preferred. Other configurations are available on request.
- The default WireGuard port number consists of the digit 2 followed by the last four digits of your ASN. For example, ASN 4242421816 uses port 21816. Contact me if you need a different port.
- Use the endpoint listed below. IPv4-only or IPv6-only aliases are available only where configured; confirm them before use. AU currently uses `au.dn42.cloudc.dev`.
- A session may be removed if it remains unreachable for an extended period.
- Please keep latency below 50 ms where possible.

:::warning Mainland China node policy
CN nodes do not peer with nodes outside mainland China. Do not use them for unlawful cross-border traffic. Connections are monitored; violations will be blocked.
:::

## Nodes

| Node | Location | Endpoint | IPv4 / IPv6 | DN42 IPv4 | DN42 IPv6 | WireGuard key |
| --- | --- | --- | --- | --- | --- | --- |
| HK | Hong Kong | `hk.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/○</span> | `172.22.107.1` | `fdbb:aee:d9bd::1` | <CopyPublicKey node="HK" value="ZynDjBdOWAS1YjZzwdiSI4kbthisE2xgPiOHopdfIxQ=" /> |
| JP | Tokyo, Japan | `jp.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/○</span> | `172.22.107.2` | `fdbb:aee:d9bd::2` | <CopyPublicKey node="JP" value="TRsJBPvVUXBCDuiBDwte+YCbkjkIglfVm+M5NxOFfwk=" /> |
| SG | Singapore | `sg.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/○</span> | `172.22.107.3` | `fdbb:aee:d9bd::3` | <CopyPublicKey node="SG" value="EPgqX4UDrzirYgPbDf3t6+6XBWozuUEg4L2zWcPO5Xk=" /> |
| AU | Australia | `au.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/×</span> | `172.22.107.4` | `fdbb:aee:d9bd::4` | <CopyPublicKey node="AU" value="dWOQkOyFT7VeHzh/8DNnlMIwqLPBh0/Daj6MdOdR9BQ=" /> |
| US | Fremont, California | `us.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/○</span> | `172.22.107.5` | `fdbb:aee:d9bd::5` | <CopyPublicKey node="US" value="H7LRdH2HlvsKM/ftF7CEHIja8AnFV5c5tYJ1OSyrlnQ=" /> |
| UK | Maidenhead, England | `uk.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">○/○</span> | `172.22.107.6` | `fdbb:aee:d9bd::6` | <CopyPublicKey node="UK" value="b9BF2pBj3Uk958jzSUIIPzKN2DLpED/JldkSo4S+VAM=" /> |
| DE(NAT) | Falkenstein, Saxony | `de.dn42.cloudc.dev` | <span className="ip-family-support" title="IPv4 / IPv6 support">×/○</span> | `172.22.107.7` | `fdbb:aee:d9bd::7` | <CopyPublicKey node="DE" value="yJy4AxORf1c2VNvmVCzM9HYd6+xru17rc/N+946PODQ=" /> |
| CN | Mainland China | By request | - | `172.22.107.8` | `fdbb:aee:d9bd::8` | - |

IPv4 / IPv6 refers to the public endpoint address families, not the DN42 addresses: ○ = supported for public peering; × = unavailable for public peering. DNS records alone do not guarantee that an address family is available. CN availability is provided on request. You can force IPv4 or IPv6 by prefixing the domain name with 4. or 6., for example 6.jp.dn42.cloudc.dev. This depends on the corresponding DNS record being published and is not a live reachability test.

All nodes use ASN `4242423777` and link-local address `fe80::3777`.

## Operations and topology

HK and US act as route reflectors. The other listed overseas nodes connect to both route reflectors; WireGuard provides the tunnel transport and OSPF provides internal reachability.

The former TH node has moved to Australia and is now identified as AU. Its internal addresses remain `172.22.107.4` and `fdbb:aee:d9bd::4`. Use `au.dn42.cloudc.dev`, not the retired TH hostname.

Confirm the endpoint, hosting provider, and supported address families when arranging a session. Map markers are regional illustrations, not exact datacenter locations. Live session status is available in Looking Glass and Grafana; this document is not a live availability report.

## Network tools

- [DN42 Looking Glass](https://lg.dn42.cloudc.dev)
- [Network monitoring](https://grafana.dn42.cloudc.dev/d/dn42-unified-observatory/dn42-unified-observatory)
