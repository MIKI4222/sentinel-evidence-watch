# Security and evidence boundaries

No private key is used or stored by the application. Wallet authorization is delegated to an EIP-1193 provider; chain and ownership are checked before signing and enforced by the contract. All public page content is untrusted. GenLayer validator agreement is an assessment of observed information, not proof of the source's authenticity or a cryptographic proof of historical website content. Summaries and extracted values are model outputs, and confidence is not a probability. Contract behavior and prompt defenses are described in the audited source and README.

This code has not received a security audit. Wallet integration and transaction recovery across browser tabs have not been verified end to end. Review the contract and frontend before using meaningful funds. Avoid putting secrets in source names, descriptions, URLs, instructions, environment variables, or watch items: these may be public on-chain.
