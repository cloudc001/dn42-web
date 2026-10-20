import React, {useState} from 'react';

export default function CopyPublicKey({value, node}) {
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState(false);
  async function copy() {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch (_) { /* Fall back for denied permissions and HTTP previews. */ }
    if (!ok) {
      const previous = document.activeElement;
      const input = document.createElement('textarea');
      input.value = value;
      input.readOnly = true;
      input.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(input);
      try {
        input.focus(); input.select(); input.setSelectionRange(0, value.length);
        ok = document.execCommand('copy');
      } catch (_) { ok = false; }
      finally { input.remove(); if (previous && previous.focus) previous.focus(); }
    }
    setStatus(ok ? 'Copied!' : 'Select the key below to copy manually.');
    setManual(!ok);
  }
  return <div className="public-key-action">
    <button type="button" className="copy-public-key" onClick={copy} aria-label={`Copy ${node} WireGuard public key`} title={value}>
      <span aria-hidden="true">⧉</span> {status === 'Copied!' ? 'Copied!' : 'Copy key'}
    </button>
    <span className="public-key-feedback" role="status" aria-live="polite">{status === 'Copied!' ? `${node} key copied` : status}</span>
    {manual && <input className="public-key-manual" aria-label={`${node} public key`} readOnly value={value} onFocus={e => e.target.select()} />}
  </div>;
}
