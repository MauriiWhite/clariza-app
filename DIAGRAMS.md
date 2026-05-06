# Clariza — Diagramas

Diagramas de referencia de los flujos clave del producto. Renderizados con Mermaid (visibles directo en GitHub).

> Para el contexto completo ver [SPEC.md](SPEC.md).

---

## 1. Flujo principal end-to-end

Camino completo del ciudadano desde que describe su problema hasta que recibe recordatorios de plazos.

```mermaid
flowchart TD
    A[Ciudadano describe problema<br/>+ adjunta antecedentes] --> B[Clariza extrae datos<br/>con Claude Vision]
    B --> C[Agente cruza hechos<br/>con normativa vigente]
    C --> D{¿Es procedente<br/>el reclamo?}
    D -->|No| E[Explica improcedencia<br/>en lenguaje ciudadano]
    D -->|Sí| F[Clasifica competencia]
    F --> G{¿Qué regulador?}
    G --> G1[CMF]
    G --> G2[SERNAC]
    G --> G3[SUSESO]
    G --> G4[SUPEN]
    G --> G5[Tribunales]
    G1 & G2 & G3 & G4 & G5 --> H[Calcula plazos hábiles<br/>vía MCP]
    H --> I[Genera reclamo formal PDF<br/>con citas normativas]
    I --> J[Usuario opcional:<br/>activa recordatorios por email]
    J --> K[Cron envía alertas<br/>a 7 / 3 / 1 días del vencimiento]
```

---

## 2. Agent loop con tools (lo que se ve en la consola)

Esto es lo que el jurado verá durante la demo — la consola lateral muestra cada llamada a tool y su resultado en vivo. Cumple sub-check **B3** de la rúbrica (≥3 mensajes visibles) y demuestra arquitectura agéntica (M3, 25%).

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as Claude Sonnet 4.6
    participant T1 as extraer_antecedentes
    participant T2 as buscar_normativa
    participant T3 as clasificar_competencia
    participant T4 as calcular_plazos (MCP)
    participant T5 as generar_reclamo

    U->>C: Relato + cartola.pdf
    C->>T1: extraer_antecedentes(cartola.pdf)
    T1-->>C: {entidad, monto, fecha, producto}
    C->>T2: buscar_normativa("comisión adicional AFP")
    T2-->>C: [DL 3.500 Art.29, Circular SUPEN 1.998]
    C->>T3: clasificar_competencia(hechos)
    T3-->>C: {ente: SUPEN, procedencia: sí, gravedad: media}
    C->>T4: calcular_plazos(SUPEN, "cobro indebido", fecha)
    T4-->>C: {dias_restantes: 18, fecha_limite: 2026-05-30}
    C->>U: Diagnóstico + timeline visible
    U->>C: "Generá el reclamo"
    C->>T5: generar_reclamo("SUPEN", hechos, normativa)
    T5-->>C: PDF estructurado
    C-->>U: Documento descargable
```

---

## 3. Casos demo → regulador competente

Los 3 casos curados para la demo mapean a 3 de los 4 perfiles oficiales del Impact Lab y demuestran que **el agente cambia de regulador según el caso**.

```mermaid
flowchart LR
    subgraph Casos["3 perfiles oficiales del Lab"]
        P1[👴 Jubilado invisible<br/>Comisión adicional AFP<br/>no explicada]
        P2[👩‍💼 Emprendedora a ciegas<br/>Cláusula abusiva<br/>en crédito retail]
        P3[💸 Víctima del fraude<br/>Cobro indebido<br/>tarjeta de banco]
    end

    subgraph Análisis["Clariza"]
        A[Agente analiza<br/>+ cruza normativa]
    end

    subgraph Reguladores["5 destinos posibles"]
        R1[CMF<br/>30 días hábiles]
        R2[SERNAC<br/>10 días hábiles]
        R3[SUPEN<br/>20 días hábiles]
        R4[SUSESO<br/>15 días hábiles]
        R5[Tribunales<br/>n/a]
    end

    P1 --> A
    P2 --> A
    P3 --> A
    A -->|Caso 1| R3
    A -->|Caso 2| R2
    A -->|Caso 3| R1

    style P1 fill:#fef3c7
    style P2 fill:#fef3c7
    style P3 fill:#fef3c7
    style R1 fill:#dbeafe
    style R2 fill:#dbeafe
    style R3 fill:#dbeafe
    style R4 fill:#e5e7eb
    style R5 fill:#e5e7eb
```

> Los plazos por regulador son ilustrativos para el diagrama. Los reales los entrega `calcular_plazos` desde la normativa vigente.

---

## 4. Arquitectura del sistema

```mermaid
flowchart TB
    subgraph Cliente["PWA — Next.js en Vercel"]
        UI[Chat + Consola en vivo<br/>+ Timeline de plazos]
    end

    subgraph Backend["API Routes Next.js"]
        AR[Agent Runner<br/>Anthropic SDK + toolRunner]
        SYS[System Prompt<br/>+ Prompt Caching]
    end

    subgraph Tools["5 Tools del agente"]
        T1[extraer_antecedentes<br/>Claude Vision]
        T2[buscar_normativa<br/>RAG pgvector]
        T3[clasificar_competencia<br/>Claude Sonnet 4.6]
        T4[calcular_plazos<br/>MCP server]
        T5[generar_reclamo<br/>Templates + PDF]
    end

    subgraph Datos["Datos"]
        VDB[(Supabase pgvector<br/>RAN + 9 leyes/NCG)]
        FILES[Files API beta<br/>circulares CMF + citations]
        BCN[BCN API Ley Fácil]
        RPSF[Registro Prestadores<br/>Fintec CMF]
    end

    subgraph Persistencia["Recordatorios"]
        DB[(Supabase Postgres<br/>casos guardados)]
        CRON[Cron Vercel<br/>alertas email 7/3/1 días]
    end

    UI <-->|SSE streaming| AR
    AR <--> SYS
    AR --> T1 & T2 & T3 & T4 & T5
    T1 --> FILES
    T2 --> VDB
    T2 --> BCN
    T3 --> RPSF
    T5 --> DB
    DB --> CRON
    CRON -->|email| UI
```

---

*Diagramas vivos — se ajustan con el SPEC tras feedback del mentor.*
