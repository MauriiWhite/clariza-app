# Clariza — Casos de uso

Casos curados que cubren los **4 perfiles oficiales del Impact Lab Chile 2026** y los **5 reguladores posibles** del sistema financiero chileno. Sirven para:

- Guion del video demo (M4 — 15%)
- Validación anti-alucinación durante desarrollo (M2 — 20%)
- Material de pitch en vivo (M5 — 15%)

> Las normativas citadas son reales y verificables. Los casos son sintéticos pero modelados sobre patrones reales de reclamación reportados a CMF y SERNAC.

---

## Caso 1 — María Rojas (👴 Jubilado invisible)

**67 años · Jubilada · Maipú, Santiago · Pensión modalidad retiro programado en AFP Habitat**

### El problema

María recibió su liquidación de pensión y nota un descuento de **$14.200 mensuales** que no recordaba haber autorizado. Lleva 3 meses pasando. Total perdido: **$42.600**.

### Recorrido sin Clariza

| Día | Qué hace María | Qué pasa |
|---|---|---|
| 1 | Llama al call center de la AFP | Le piden reclamar por web. No tiene clave. |
| 3 | Va a la sucursal | "Es una comisión, está en el contrato." Se va sin certificado. |
| 7 | Su sobrina le dice "reclamá al banco" | Pierde el rastro — no es banco, es AFP. |
| 14 | Sube reclamo a SERNAC | A los 20 días le responden: *"competencia de SUPEN, diríjase allá"* |
| 35 | Intenta reclamar a SUPEN | **Plazo legal vencido.** Pierde el derecho a restitución. |

### Recorrido con Clariza

| Minuto | Acción | Resultado |
|---|---|---|
| 0 | Abre clariza.cl en celular | UI con letra grande: *"Contame qué te pasó."* |
| 1 | Escribe relato + sube foto liquidación | Vision extrae: AFP Habitat · $14.200 mensual · "comisión adicional" · enero 2026 |
| 2 | — | Agente cita: **DL 3.500 Art. 29** + **Circular SUPEN 1.998** |
| 2 | — | Clasifica: ente = **SUPEN** · procedente · gravedad media |
| 2 | Ve diagnóstico | *"Tenés **18 días hábiles**. Plazo vence 30-may-2026."* |
| 4 | Toca "Generar reclamo" | PDF formal listo con citas y petición de restitución |
| 5 | Activa recordatorios email | Alertas a 7 / 3 / 1 días del vencimiento |

### Mapeo regulatorio

- **Ente competente:** SUPEN (Superintendencia de Pensiones)
- **Norma invocada:** DL 3.500 Art. 29 + Circular SUPEN sobre comisiones
- **Plazo legal:** 18 días hábiles desde último cobro indebido
- **Petición concreta:** restitución de $42.600 + cese del cobro

---

## Caso 2 — Camila Soto (👩‍💼 Emprendedora a ciegas)

**34 años · Dueña de almacén · Renca, Santiago · Crédito de consumo en retail Hites**

### El problema

Camila tomó un crédito de **$1.500.000** en Hites para comprar mercadería. Al primer pago descubre que la cuota es **$15.800 más alta** que lo pactado verbalmente: la TAE real es 38% anual, no el 28% que le dijeron en caja.

### Recorrido sin Clariza

| Día | Qué hace Camila | Qué pasa |
|---|---|---|
| 1 | Llama al servicio al cliente | "Está en el contrato que firmó." |
| 5 | Pide copia del contrato firmado | Tarda 12 días en llegar |
| 20 | Lee la letra chica | No entiende términos como "CAE", "interés moratorio compuesto" |
| 30 | Posterga reclamo, paga la cuota | Se naturaliza el cobro |
| 90 | Le cobran intereses moratorios por atraso de 1 día | Total perdido acumulado: ~$94.800 |

### Recorrido con Clariza

| Minuto | Acción | Resultado |
|---|---|---|
| 0 | Sube foto del contrato + cartola | Vision extrae: Hites · CAE 38% · cuota declarada vs cobrada |
| 2 | — | Agente cita: **Ley 19.496 Art. 17** + **Ley 20.555 Art. 17B** + **Ley 21.398** sobre transparencia |
| 2 | — | Clasifica: ente = **SERNAC** · procedente · gravedad alta (eventual incumplimiento Pro Consumidor) |
| 3 | Ve diagnóstico | *"Tenés **derecho a información clara antes de firmar**. Esto puede ser publicidad engañosa."* |
| 4 | Genera reclamo a SERNAC | PDF formal pidiendo recálculo de la deuda al CAE pactado verbalmente |
| 5 | Plazo: 30 días hábiles desde último cobro | Recordatorio activado |

### Mapeo regulatorio

- **Ente competente:** SERNAC Financiero
- **Normas invocadas:** Ley 19.496 (Derechos del consumidor) + Ley 20.555 (SERNAC Financiero) + Ley 21.398 (Pro Consumidor)
- **Plazo legal:** 30 días hábiles
- **Petición concreta:** recálculo a CAE 28% pactado + devolución de cobros excedentes

---

## Caso 3 — Patricio Núñez (💸 Víctima del fraude)

**58 años · Contador independiente · La Florida, Santiago · Cliente Banco BICE**

### El problema

A Patricio le clonaron la tarjeta. Hubo **3 transacciones fraudulentas por $480.000** un domingo a las 4 AM. Apenas vio el SMS llamó al banco y bloqueó la tarjeta. El banco se niega a devolver el dinero "porque las transacciones fueron autenticadas con clave dinámica".

### Recorrido sin Clariza

| Día | Qué hace Patricio | Qué pasa |
|---|---|---|
| 1 | Llama al banco, bloquea tarjeta | Le dicen "abrimos el caso, en 30 días resolvemos" |
| 30 | Banco resuelve: rechaza la devolución | "Las transacciones tenían 3DSecure" |
| 31 | Va a la sucursal a reclamar | Le entregan formulario de mediación interna |
| 60 | Mediación interna lo rechaza | Le dicen "vaya a CMF si quiere" |
| 75 | Llega a CMF | Hay un detalle: bajo Ley 21.234 tenía 90 días desde el desconocimiento. Apenas alcanza. |

### Recorrido con Clariza

| Minuto | Acción | Resultado |
|---|---|---|
| 0 | Sube cartola con cargos + SMS de bloqueo | Vision extrae: 3 movimientos · timestamps · monto |
| 2 | — | Agente cita: **Ley 21.234 Art. 5** (responsabilidad emisor en operaciones desconocidas) |
| 2 | — | Verifica BICE en RPSF/CMF: ✅ entidad fiscalizada |
| 2 | — | Clasifica: ente = **CMF** · procedente · gravedad **alta** |
| 3 | Ve diagnóstico | *"Bajo Ley 21.234, el banco debe **devolver lo no reconocido salvo que pruebe dolo o culpa grave tuya**. La autenticación 3DSecure no los exime."* |
| 4 | Genera reclamo a CMF | PDF formal con cita literal Art. 5 + cronología + petición de restitución |
| 5 | Plazo: tiene 90 días desde desconocimiento | Recordatorio activado |

### Mapeo regulatorio

- **Ente competente:** CMF (entidad bancaria fiscalizada)
- **Normas invocadas:** Ley 21.234 (Fraudes con tarjetas) Art. 5 + Ley 19.496 + circulares CMF aplicables a bancos
- **Plazo legal:** 90 días corridos desde desconocimiento
- **Petición concreta:** restitución de $480.000 + intereses por mora del banco

---

## Caso 4 — Javiera Mella (🎓 Universitaria perdida)

**22 años · Estudiante de pedagogía · Concepción · Usuaria de fintech "PayDay" (no autorizada)**

### El problema

Javiera transfirió **$320.000** de sus ahorros a una "cuenta digital" promocionada en TikTok que prometía "rentabilidad diaria". Cuando intenta retirar, la app le pide pagar un "impuesto de salida" de $48.000 antes de liberar fondos. La supuesta fintech no responde mensajes hace 5 días.

### Recorrido sin Clariza

| Día | Qué hace Javiera | Qué pasa |
|---|---|---|
| 1 | Investiga en Google "PayDay Chile estafa" | Encuentra reportes pero no sabe a quién acudir |
| 3 | Pregunta en redes sociales | Comentarios contradictorios: "es CMF", "es SERNAC", "es PDI" |
| 7 | Va al banco a anular la transferencia | "Ya pasaron las 24h, no se puede" |
| 14 | Llena formulario en SERNAC | Le redireccionan a CMF |
| 30 | CMF le confirma que la fintech NO está registrada | Caso pasa a fiscalía. Probabilidad de recuperación: <10% |

### Recorrido con Clariza

| Minuto | Acción | Resultado |
|---|---|---|
| 0 | Cuenta el caso + sube screenshot de la app | Vision extrae: nombre fintech, montos, comunicaciones |
| 1 | — | Agente verifica RPSF/CMF: ❌ **PayDay NO está autorizada** |
| 2 | — | Clasifica: caso **mixto** — denuncia administrativa + posible delito |
| 2 | Ve diagnóstico | *"PayDay **no está autorizada por la CMF**. Esto excede un reclamo administrativo: estamos ante una probable **estafa (Ley 21.459 + Art. 467 Código Penal)**."* |
| 3 | Recibe **dos rutas paralelas** | (1) **Alerta CMF** sobre entidad no autorizada · (2) **Denuncia ante PDI Cibercrimen** |
| 4 | Genera ambos documentos | PDF alerta CMF + PDF denuncia PDI con evidencia |
| 5 | Plazos diferenciados | CMF: 30 días · Denuncia penal: sin plazo pero urgente |

### Mapeo regulatorio

- **Entes competentes:** CMF (alerta) + Ministerio Público / PDI (denuncia penal)
- **Normas invocadas:** Ley 21.521 (Fintec — registro obligatorio) + Ley 21.459 (Delitos informáticos) + Art. 467 Código Penal (estafa)
- **Plazos legales:** alerta CMF 30 días · denuncia penal sin plazo
- **Petición concreta:** alerta pública + congelamiento de cuentas si se identifican + denuncia formal por estafa

---

## Resumen de cobertura

| Caso | Perfil oficial | Regulador | Norma principal | Plazo |
|---|---|---|---|---|
| 1. María | Jubilado invisible | **SUPEN** | DL 3.500 | 18 días hábiles |
| 2. Camila | Emprendedora a ciegas | **SERNAC** | Ley 19.496 + 20.555 + 21.398 | 30 días hábiles |
| 3. Patricio | Víctima del fraude | **CMF** | Ley 21.234 | 90 días corridos |
| 4. Javiera | Universitaria perdida | **CMF + PDI** | Ley 21.521 + 21.459 | 30 días + sin plazo |

**Lo que el conjunto demuestra al jurado:**
- Mismo flujo, **4 reguladores distintos** (clave del diferenciador multi-regulador).
- Casos procedentes y casos mixtos (administrativo + penal).
- Variedad de evidencia: foto, cartola, screenshot.
- Variedad de plazos: días hábiles, días corridos, sin plazo.
- Cobertura de los 4 perfiles oficiales del Lab.

---

*Casos vivos — Sebastián los valida con normativa vigente durante el día 6.*
