import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import { BracketFrame } from './BracketFrame';

const useStyles = makeStyles((t) => ({
  banner: { gap: t.spacing.xxs, paddingVertical: t.spacing.sm, paddingLeft: t.spacing.md, backgroundColor: t.colors.surface },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: t.size.line + 1, backgroundColor: t.colors.flag },
  title: { ...t.typography.metaLabel, color: t.colors.flag },
  detail: { ...t.typography.caption, color: t.colors.textSecondary },
}));

/** A race warning (yellow flag, safety car): a small panel with a yellow rail down its left edge. */
export function RaceBanner({ title, detail }: { title: string; detail: string }) {
  const styles = useStyles();
  return (
    <BracketFrame style={styles.banner}>
      <View style={styles.rail} />
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.detail}>{detail}</Text>
    </BracketFrame>
  );
}
