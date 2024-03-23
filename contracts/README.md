# Foundry Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Github Actions][gha-badge]][gha] [![Foundry][foundry-badge]][foundry] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/OnchainGame/demo-non-field-rpg
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod
[gha]: https://github.com/OnchainGame/demo-non-field-rpg/actions
[gha-badge]: https://github.com/OnchainGame/demo-non-field-rpg/actions/workflows/ci.yml/badge.svg
[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

## Getting Started

```
forge script script/Deploy.s.sol:Deploy --rpc-url syndicate --broadcast --verify --verifier-url https://explorer-frame.syndicate.io/api --verifier blockscout --legacy --ffi
```

```
forge script script/Setting.s.sol:Setting --rpc-url syndicate --broadcast --verify --verifier-url https://explorer-frame.syndicate.io/api --verifier blockscout --legacy --ffi
```

```
forge script script/DeployAndSetting.s.sol:DeployAndSetting --rpc-url base  --broadcast --verify --legacy --ffi
```

## License

This project is licensed under MIT.
