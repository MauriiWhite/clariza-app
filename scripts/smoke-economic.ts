import {
  convertAmount,
  getEconomicIndicators,
  interpretAmount,
} from "../src/modules/regulations/lib/economicIndicators";

async function main() {
  const ind = await getEconomicIndicators();
  console.log("Indicadores del dia:", ind);

  console.log("\n=== Caso 1 (María): $14.200/mes ===");
  console.log(convertAmount(14200, ind));
  console.log(interpretAmount(14200, ind.uf));

  console.log("\n=== Caso 3 (Patricio): $480.000 ===");
  console.log(convertAmount(480000, ind));
  console.log(interpretAmount(480000, ind.uf));

  console.log("\n=== Caso 4 (Javiera): $320.000 ===");
  console.log(convertAmount(320000, ind));
  console.log(interpretAmount(320000, ind.uf));
}

main().catch((e) => { console.error(e); process.exit(1); });
