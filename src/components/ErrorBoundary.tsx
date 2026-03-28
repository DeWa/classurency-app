import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { font } from '../theme/typography';

type Props = { children: ReactNode };

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.warn('ErrorBoundary', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>Something went wrong</Text>
          {this.state.message ? <Text style={styles.msg}>{this.state.message}</Text> : null}
          <Pressable onPress={this.handleReset} style={styles.btn}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.deepScholastic,
  },
  title: {
    fontFamily: font.bodyBold,
    fontSize: 20,
    color: colors.paperWhite,
    marginBottom: 8,
  },
  msg: {
    fontFamily: font.body,
    color: colors.textMuted,
    marginBottom: 20,
  },
  btn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.electricIndigo,
    borderRadius: radius.control,
  },
  btnText: {
    fontFamily: font.bodySemi,
    color: colors.onIndigo,
    fontSize: 16,
  },
});
