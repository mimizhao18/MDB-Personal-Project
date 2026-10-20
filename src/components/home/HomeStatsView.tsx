import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import type { HomeStatsId } from '../../storage/homeStats';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  // strip
  strip: { flexDirection: 'row', borderTopWidth: t.border.hairline, borderBottomWidth: t.border.hairline, borderColor: t.colors.border, paddingVertical: t.spacing.sm },
  stripCell: { flex: 1, alignItems: 'center', gap: 1 },
  stripCellDivided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
  value: { fontSize: 18, fontWeight: '800', color: t.colors.text },
  label: { ...t.type.label, fontSize: 10, color: t.colors.textMuted },
  // line
  line: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
  lineStrong: { color: t.colors.text, fontWeight: '700' },
  // pills
  pills: { flexDirection: 'row', justifyContent: 'center', gap: t.spacing.xs + 2 },
  pill: { flexDirection: 'row', alignItems: 'baseline', gap: 4, paddingHorizontal: t.spacing.sm + 2, paddingVertical: 5, borderRadius: t.radius.pill, borderWidth: t.border.hairline, borderColor: t.colors.borderStrong },
  pillValue: { fontSize: 14, fontWeight: '800', color: t.colors.text },
  pillLabel: { ...t.type.caption, fontSize: 11, color: t.colors.textMuted },
  // table
  table: { flexDirection: 'row', gap: t.spacing.xl },
  tableColumn: { flex: 1, gap: 4 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  tableLabel: { ...t.type.caption, color: t.colors.textMuted },
  tableValue: { fontSize: 14, fontWeight: '700', color: t.colors.text },
  // highlight
  highlight: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  highlightBig: { alignItems: 'center', minWidth: 64 },
  highlightNumber: { fontSize: 34, fontWeight: '900', color: t.colors.text, lineHeight: 38 },
  highlightSide: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border, paddingLeft: t.spacing.md },
  highlightCell: { alignItems: 'center', gap: 1 },
}));

/** The four figures every style shows, as [label, value] pairs. */
export function statFigures(data: HomeData) {
  const { stats, streak } = data;
  return [
    { label: 'Streak', short: 'day streak', value: String(streak), unit: 'days' },
    { label: 'Races', short: 'races', value: String(stats.races), unit: '' },
    { label: 'Laps', short: 'laps', value: String(stats.laps), unit: '' },
    { label: 'Distance', short: 'km', value: stats.distanceKm.toFixed(0), unit: 'km' },
  ];
}

/** The lifetime stats on Home, in whichever compact style is chosen in Settings > Home stats. */
export function HomeStatsView({ data, style }: { data: HomeData; style: HomeStatsId }) {
  const styles = useStyles();
  const f = statFigures(data);

  switch (style) {
    case 'line':
      return (
        <Text style={styles.line}>
          <Text style={styles.lineStrong}>{f[0].value}</Text> day streak · <Text style={styles.lineStrong}>{f[1].value}</Text> races · <Text style={styles.lineStrong}>{f[2].value}</Text> laps ·{' '}
          <Text style={styles.lineStrong}>{f[3].value}</Text> km
        </Text>
      );
    case 'pills':
      return (
        <View style={styles.pills}>
          {f.map((s) => (
            <View key={s.label} style={styles.pill}>
              <Text style={styles.pillValue}>{s.value}</Text>
              <Text style={styles.pillLabel}>{s.short}</Text>
            </View>
          ))}
        </View>
      );
    case 'table':
      return (
        <View style={styles.table}>
          {[f.slice(0, 2), f.slice(2)].map((column, i) => (
            <View key={i} style={styles.tableColumn}>
              {column.map((s) => (
                <View key={s.label} style={styles.tableRow}>
                  <Text style={styles.tableLabel}>{s.label}</Text>
                  <Text style={styles.tableValue}>
                    {s.value}
                    {s.unit && s.label !== 'Streak' ? ` ${s.unit}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    case 'highlight':
      return (
        <View style={styles.highlight}>
          <View style={styles.highlightBig}>
            <Text style={styles.highlightNumber}>{f[0].value}</Text>
            <Text style={styles.label}>{f[0].short}</Text>
          </View>
          <View style={styles.highlightSide}>
            {f.slice(1).map((s) => (
              <View key={s.label} style={styles.highlightCell}>
                <Text style={styles.value}>{s.value}</Text>
                <Text style={styles.label}>{s.short}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    default:
      return (
        <View style={styles.strip}>
          {f.map((s, i) => (
            <View key={s.label} style={[styles.stripCell, i > 0 && styles.stripCellDivided]}>
              <Text style={styles.value}>{s.value}</Text>
              <Text style={styles.label}>{s.short}</Text>
            </View>
          ))}
        </View>
      );
  }
}
