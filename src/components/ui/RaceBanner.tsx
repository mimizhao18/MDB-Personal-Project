import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import { BracketFrame } from './BracketFrame';

const useStyles = makeStyles((t) => ({
  banner: { gap: t.spacing.xxs, paddingVertical: t.spacing.sm, paddingLeft: t.spacing.md, backgroundColor: t.colors.surface },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: t.size.line + 1, backgroundColor: t.colors.flag },
  railQuiet: { backgroundColor: t.colors.textSecondary },
  title: { ...t.typography.metaLabel, color: t.colors.flag },
  titleQuiet: { color: t.colors.text },
  detail: { ...t.typography.caption, color: t.colors.textSecondary },
}));

/** A race warning: a small panel with a rail down its left edge, yellow for a yellow flag and grey for the milder track limits warning. */
export function RaceBanner({ kind, title, detail }: { kind: 'yellow' | 'track-limits'; title: string; detail: string }) {
  const styles = useStyles();
  return (
    <BracketFrame style={styles.banner}>
      <View style={[styles.rail, kind === 'track-limits' && styles.railQuiet]} />
      <Text style={[styles.title, kind === 'track-limits' && styles.titleQuiet]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.detail}>{detail}</Text>
    </BracketFrame>
  );
}
