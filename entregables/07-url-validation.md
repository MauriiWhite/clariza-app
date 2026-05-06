# 07 · Validación de URLs regulatorias

> Verificación final pre-submit del 7-may 10:00 AM.
> Status check del 6-may noche.

---

## URLs principales — Check pre-submit

| URL | HTTP en browser | Contenido |
|---|---|---|
| https://www.bcn.cl/leychile/navegar?idNorma=1187323 | ✅ 200 | Ley 21.521 Fintec |
| https://www.bcn.cl/leychile/navegar?idNorma=61438 | ✅ 200 | Ley 19.496 Consumidor |
| https://www.bcn.cl/leychile/navegar?idNorma=1024266 | ✅ 200 | Ley 20.555 SERNAC Financiero |
| https://www.bcn.cl/leychile/navegar?idNorma=1170464 | ✅ 200 | Ley 21.398 Pro Consumidor |
| https://www.bcn.cl/leychile/navegar?idNorma=1147562 | ✅ 200 | Ley 21.234 Fraudes con tarjetas |
| https://www.bcn.cl/leychile/navegar?idNorma=7147 | ✅ 200 | DL 3.500 Pensiones |
| https://www.bcn.cl/leychile/navegar?idNorma=1209293 | ✅ 200 | Ley 21.680 REDEC |
| https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43589.html | ✅ 200 | Portal Reclamos CMF |
| https://www.sernac.cl/portal/619/w3-propertyvalue-7993.html | ✅ 200 | Reclamos SERNAC |
| https://www.spensiones.cl/portal/orientacion/580/w3-channel.html | ✅ 200 (302→) | Portal SUPEN |

**Todas verificadas el 5-may. ✅**

> Nota técnica: BCN bloquea curl sin User-Agent (devuelve 401), pero responde 200 a navegadores reales. No es un problema para el ciudadano.

---

## URLs APIs públicas (las que usa el agente)

| URL | Status | Función |
|---|---|---|
| https://date.nager.at/api/v3/PublicHolidays/2026/CL | ✅ 200 | Feriados oficiales |
| https://mindicador.cl/api | ✅ 200 | UF, USD, UTM, IPC |

---

## Acción Sebastián la mañana del 7-may

Antes de submit a las 10:00:

1. Abrir cada URL de la lista en una pestaña.
2. Verificar que carga el contenido esperado (no 404, no redirección a página de error).
3. Si alguna falla:
   - **Plan A**: buscar la URL canónica nueva en bcn.cl y reemplazar.
   - **Plan B**: omitir esa URL del formulario (mantenemos 9 de 10, sigue cumpliendo el mínimo de 2).
4. Hacer click en al menos 3 URLs para confirmar que el contenido sigue siendo el ley/circular esperada.

---

## Checklist final pre-submit ficha cívica

- [ ] Las 10 URLs abren correctamente desde browser
- [ ] Problema ≤ 300 caracteres
- [ ] Segmento incluye edad + ubicación + condición
- [ ] Canal nombra mecanismo concreto (PWA / B2G / B2NGO)
- [ ] Impacto tiene 4 datos numéricos
- [ ] Normativa base con artículos específicos
- [ ] Submit antes de las 10:00 AM
