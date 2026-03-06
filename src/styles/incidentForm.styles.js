import {StyleSheet} from 'react-native';
import {COLORS, SPACING} from '../constants/incidentForm.constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xlarge,
  },
  contentContainer: {
    paddingHorizontal: SPACING.medium,
  },
  contentLandscape: {
    paddingHorizontal: SPACING.xlarge,
  },

  // Stepper
  stepperContainer: {
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.medium,
  },
  stepperTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  stepperTextContainer: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  pulseOuter: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.stepActive,
    opacity: 0.3,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  indicatorCompleted: {
    backgroundColor: COLORS.stepCompleted,
  },
  indicatorActive: {
    backgroundColor: COLORS.stepActive,
  },
  indicatorInactive: {
    backgroundColor: COLORS.stepInactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  checkIcon: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  // Section Card
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  cardHeader: {
    backgroundColor: COLORS.headerBg,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.headerText,
  },
  cardBody: {
    padding: SPACING.large,
  },

  // Consent
  consentContainer: {
    marginTop: SPACING.small,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: SPACING.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: SPACING.small,
    marginLeft: 40,
  },

  // Footer Buttons
  footerButtons: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.large,
    gap: SPACING.medium,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
