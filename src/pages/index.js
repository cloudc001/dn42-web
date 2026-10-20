import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import NetworkGlobe from '../components/NetworkGlobe';
import networkNodes from '../data/networkNodes';
import styles from './index.module.css';

const routeCommunities = [
  {value: '64511:34', label: 'Encrypted with PFS', detail: 'Secure VPN tunnel with Perfect Forward Secrecy.'},
  {value: '64511:83', label: 'Tunnel transport', detail: 'Connection carried over a tunnel, such as WireGuard.'},
];

function SectionHeading({eyebrow, title, children}) {
  return <div className={styles.sectionHeading}>
    <p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2>
    {children && <p className={styles.sectionDescription}>{children}</p>}
  </div>;
}

export default function Home() {
  return <Layout title="CloudC DN42 Network" description="CloudC DN42 network information, peer policy, and global nodes. AS4242423777.">
    <main className={styles.page}>
      <header className={styles.hero}><div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>CLOUDC ED-LAB NETWORK / DN42</p>
          <h1>CloudC DN42 Network</h1>
          <p className={styles.lede}>Experimental overlay routing across a small, globally distributed network. Open peering for useful, well-maintained sessions.</p>
          <div className={styles.actions}>
            <a className={styles.primaryAction} href="https://t.me/cloudc001bot">Auto peer <span aria-hidden="true">↗</span></a>

            <Link className={styles.secondaryAction} to="/docs/peer">Peering details <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <aside className={styles.identity} aria-label="Network identity">
          <div className={styles.identityTop}><span>NETWORK IDENTITY</span><span className={styles.status}><i /> Experimental</span></div>
          <div className={styles.asn}>AS<span>4242423777</span></div>
          <div className={styles.identityRow}><span>IPv4 allocation</span><code>172.22.107.0/27</code></div>
          <div className={styles.identityRow}><span>IPv6 allocation</span><code>fdbb:aee:d9bd::/48</code></div>
          <div className={styles.identityRow}><span>Tunnel</span><strong>WireGuard</strong></div>
        </aside>
      </div></header>

      <section className={styles.section} id="nodes"><div className="container">
        <SectionHeading eyebrow="GLOBAL PRESENCE" title="Connected across regions"></SectionHeading>
        <div className={styles.globeLayout}>
          <NetworkGlobe nodes={networkNodes} />
          <aside className={styles.communityPanel} aria-labelledby="communities-title">
            <p className={styles.eyebrow}>DN42 BGP</p>
            <h3 id="communities-title">Route communities</h3>
            <p className={styles.communityIntro}>DN42 uses AS64511 communities to describe link latency, bandwidth, encryption, topology and packet loss. These standard tags describe tunnel type, not a custom CloudC route policy.</p>
            <div className={styles.communityList}>{routeCommunities.map((community) => <div className={styles.communityRow} key={community.value}>
              <code>{community.value}</code>
              <div><strong>{community.label}</strong><p>{community.detail}</p></div>
            </div>)}</div>
            <p className={styles.communityNote}>Latency, bandwidth and packet-loss tags are peer-specific and depend on measured link values.</p>
            <a className={styles.textLink} href="https://dn42.dev/howto/BGP-communities/">DN42 community specification <span aria-hidden="true">↗</span></a>
          </aside>
        </div>
        <div className={styles.globeLink}><Link className={styles.textLink} to="/docs/peer">Node endpoints, addresses and public keys <span aria-hidden="true">→</span></Link></div>
      </div></section>

      <section className={styles.sectionAlt} id="peering"><div className={`container ${styles.peeringGrid}`}>
        <div><SectionHeading eyebrow="PEERING" title="Open policy, by request" />
          <p className={styles.bodyCopy}>Multiprotocol BGP with extended next hop and IPv6 link-local addressing is preferred. Other configurations can be discussed.</p>
          <Link className={styles.textLink} to="/docs/peer">View peer requirements and node keys <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.policyList}>
          <div><span>01</span><p><strong>WireGuard only</strong><br />One tunnel per peering session.</p></div>
          <div><span>02</span><p><strong>Long-term reachability</strong><br />Sessions may be removed after extended downtime.</p></div>
          <div><span>03</span><p><strong>Port convention</strong><br />Prefix the last four digits of your ASN with 2 (e.g. 1816 → 21816).</p></div>
        </div>
      </div></section>

      <section className={styles.section} id="operations"><div className={`container ${styles.toolsRow}`}>
        <div><SectionHeading eyebrow="OPERATIONS" title="Network tools" /><p className={styles.bodyCopy}>HK and US provide the route-reflector core. Check Looking Glass for current BGP sessions and Grafana for traffic, reachability and peer stability. Best-effort experimental network; no commercial SLA.</p></div>
        <div className={styles.toolLinks}>
          <a href="https://lg.dn42.cloudc.dev"><span>DN42 Looking Glass</span><b aria-hidden="true">↗</b></a>
          <a href="https://grafana.dn42.cloudc.dev/d/dn42-unified-observatory/dn42-unified-observatory"><span>Grafana monitoring</span><b aria-hidden="true">↗</b></a>
          <a href="https://t.me/cloudc001bot"><span>Auto peer</span><b aria-hidden="true">↗</b></a>
        </div>
      </div></section>

      <section className={styles.contact} id="contact"><div className={`container ${styles.contactInner}`}>
        <div><p className={styles.eyebrow}>PEERING &amp; OPERATIONS</p><h2>Get in touch</h2><p>Telegram is preferred. Email replies are usually sent within 24 hours.</p></div>
        <div className={styles.contactLinks}><a href="https://cloudc001.t.me">Telegram <span aria-hidden="true">↗</span></a><a href="mailto:cloud001@outlook.com">cloud001@outlook.com <span aria-hidden="true">↗</span></a></div>
      </div></section>
    </main>
  </Layout>;
}
