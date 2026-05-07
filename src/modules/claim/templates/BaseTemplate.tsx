import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ClaimDocument } from "@/modules/tools/draftClaim/types";

// Register standard fonts (Helvetica is built-in, but we can use standard styles)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#333",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#555",
    textAlign: "center",
  },
  metadata: {
    marginBottom: 20,
  },
  metadataRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  metadataLabel: {
    width: 120,
    fontFamily: "Helvetica-Bold",
  },
  metadataValue: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    marginTop: 10,
    textDecoration: "underline",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 20,
  },
  itemText: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

interface BaseTemplateProps {
  claim: ClaimDocument;
  regulatorFullName: string;
}

export const BaseTemplate = ({ claim, regulatorFullName }: BaseTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>RECLAMO FORMAL</Text>
        <Text style={styles.subtitle}>ANTE {regulatorFullName}</Text>
      </View>

      <View style={styles.metadata}>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Fecha:</Text>
          <Text style={styles.metadataValue}>{claim.generatedAt}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Reclamante:</Text>
          <Text style={styles.metadataValue}>
            {claim.claimant.fullName} {claim.claimant.rut ? `(RUT: ${claim.claimant.rut})` : ""}
          </Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Entidad Reclamada:</Text>
          <Text style={styles.metadataValue}>
            {claim.respondent.entity} {claim.respondent.rut ? `(RUT: ${claim.respondent.rut})` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I. HECHOS</Text>
        {claim.facts.map((fact, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>{i + 1}.</Text>
            <Text style={styles.itemText}>{fact}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>II. NORMATIVA INVOCADA</Text>
        {claim.invokedRegulations.map((reg, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{reg}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>III. PETICIÓN CONCRETA</Text>
        <Text style={styles.paragraph}>{claim.petition}</Text>
      </View>

      <View style={styles.footer}>
        <Text>
          Documento generado por Clariza (ID: {claim.id}). La información ha sido compilada con asistencia de IA y normativa oficial vigente.
        </Text>
      </View>
    </Page>
  </Document>
);

export default BaseTemplate;