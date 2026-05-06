import { buildDeadlineSchedule } from "../src/modules/tools/calculateDeadlines/services/schedule";

async function main() {
  console.log("=== Caso 1: SUPEN, AFP cobro indebido, hecho 2026-05-02 ===");
  const s1 = await buildDeadlineSchedule({
    regulator: "SUPEN",
    caseType: "cobro indebido AFP",
    factDate: "2026-05-02",
  });
  console.log(JSON.stringify(s1, null, 2));

  console.log("\n=== Caso 3: CMF fraude tarjeta, hecho 2026-02-20 ===");
  const s3 = await buildDeadlineSchedule({
    regulator: "CMF",
    caseType: "fraude tarjeta clonada",
    factDate: "2026-02-20",
  });
  console.log(JSON.stringify(s3, null, 2));

  console.log("\n=== Caso TRIBUNALES sin plazo ===");
  const sT = await buildDeadlineSchedule({
    regulator: "TRIBUNALES",
    caseType: "denuncia penal estafa",
    factDate: "2026-04-15",
  });
  console.log(JSON.stringify(sT, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
