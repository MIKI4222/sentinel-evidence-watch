# Netlify deployment

Set build command `npm run build` and publish directory `dist`; `netlify.toml` includes an SPA rewrite. Use Node 20 or later. Public optional settings are listed in `.env.example`. No private keys are allowed in frontend variables. The chain and RPC are fixed to the compatible SDK's Studio Dev preset. The defaults refer to the audited deployment; if the environment changes, repeat contract identity, schema, and live-read verification.

No Netlify deployment has been performed or verified. After deployment, test direct navigation, origin-to-RPC connectivity, wallet connection/chain switching, fee estimates, and full transaction lifecycle in a funded test wallet before considering release.
