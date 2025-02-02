const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const WavesModule = buildModule("WavesModule", (m) => {
  const waves = m.contract("Waves");

  return { waves };
});

module.exports = WavesModule;