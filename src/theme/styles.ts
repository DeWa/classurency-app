import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { font } from './typography';
import { radius } from './radius';

export const layout = StyleSheet.create({
  flex1: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.deepScholastic,
  },
  screenPad: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.deepScholastic,
  },
  scrollGrow: { flexGrow: 1, backgroundColor: colors.deepScholastic },
});

export const type = StyleSheet.create({
  title: {
    fontFamily: font.bodyBold,
    fontSize: 22,
    color: colors.paperWhite,
    marginBottom: 8,
  },
  headline: {
    fontFamily: font.bodyBold,
    fontSize: 20,
    color: colors.paperWhite,
    marginBottom: 16,
  },
  section: {
    fontFamily: font.bodySemi,
    fontSize: 16,
    color: colors.paperWhite,
    marginTop: 16,
    marginBottom: 8,
  },
  body: {
    fontFamily: font.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  muted: {
    fontFamily: font.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  subtle: {
    fontFamily: font.body,
    fontSize: 14,
    color: colors.textSubtle,
  },
  label: {
    fontFamily: font.bodySemi,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 6,
  },
  formLabel: {
    fontFamily: font.bodySemi,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
  },
  error: {
    fontFamily: font.body,
    fontSize: 14,
    color: colors.error,
    marginBottom: 12,
  },
});

export const form = StyleSheet.create({
  input: {
    fontFamily: font.body,
    fontSize: 16,
    color: colors.paperWhite,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.glass,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
});

export const list = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32, backgroundColor: colors.deepScholastic },
  empty: {
    fontFamily: font.body,
    textAlign: 'center',
    color: colors.textSubtle,
    marginTop: 24,
  },
});
