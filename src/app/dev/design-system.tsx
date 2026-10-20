import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BracketFrame, Button, Chip, Divider, Glass, ListRow, Panel, SectionLabel, SegmentedControl, SegmentedProgress, StartButton, StatBlock } from '../../components/ui';
import { contrastRatio } from '../../design/contrast';
import { makeStyles } from '../../design/styles';
import { colors, theme } from '../../design/tokens';
import { showAlert } from '../../ui/alert';

const NEUTRALS = ['background', 'surface', 'raised', 'border'] as const;
const TEXT_LEVELS = ['text', 'textSecondary', 'textMuted'] as const;
const TYPE_SAMPLES = [
  { name: 'display', sample: '01:24:08' },
  { name: 'statLarge', sample: '1,284 km' },
  { name: 'title', sample: 'Silverstone' },
  { name: 'heading', sample: 'Mercedes-AMG Petronas' },
  { name: 'body', sample: 'Focus for 25 minutes to complete laps.' },
  { name: 'caption', sample: '2022 car · 12 laps · 1 h 04 min' },
  { name: 'stat', sample: '141 / 150 XP' },
  { name: 'statSmall', sample: '5 day streak' },
  { name: 'label', sample: 'Lifetime stats' },
] as const;

const useStyles = makeStyles((t) => ({
  content: { padding: t.spacing.screen, gap: t.spacing.xl, paddingBottom: t.spacing.xxl },
  section: { gap: t.spacing.md },
  intro: { ...t.typography.caption, color: t.colors.textMuted },
  swatchRow: { flexDirection: 'row', gap: t.spacing.sm },
  swatch: { flex: 1, gap: t.spacing.xs },
  swatchColor: { height: 48, borderRadius: t.radius.control, borderWidth: t.border.hairline, borderColor: t.colors.border },
  swatchName: { ...t.typography.caption, color: t.colors.text },
  swatchValue: { ...t.typography.microMono, color: t.colors.textMuted },
  note: { ...t.typography.caption, color: t.colors.textMuted },
  typeRow: { gap: t.spacing.xs },
  typeName: { ...t.typography.microMono, color: t.colors.textMuted },
  typeSample: { color: t.colors.text },
  spaceRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  spaceBar: { height: t.spacing.sm, backgroundColor: t.colors.textMuted },
  radiusRow: { flexDirection: 'row', gap: t.spacing.md, alignItems: 'flex-end' },
  radiusBox: { width: 72, height: 56, backgroundColor: t.colors.raised, borderWidth: t.border.hairline, borderColor: t.colors.border },
  radiusItem: { gap: t.spacing.xs, alignItems: 'flex-start' },
  radiusDot: { width: 12, height: 12, borderRadius: t.radius.dot, backgroundColor: t.colors.accent },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  stripRow: { flexDirection: 'row' },
  stripCell: { flex: 1, paddingHorizontal: t.spacing.md },
  stripCellDivided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
  barLabel: { ...t.typography.caption, color: t.colors.textMuted, marginBottom: t.spacing.xs },
}));

/** Dev only: every design token and shared component on one page, for approving the look before screens are changed. */
export default function DesignSystemScreen() {
  const styles = useStyles();
  const [chip, setChip] = useState('2022');
  const [mode, setMode] = useState<'laps' | 'minutes'>('laps');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Timing screen, refined. Dark and precise, one red accent, 4 px corners, hairline dividers, mono numerals.</Text>

      <View style={styles.section}>
        <SectionLabel>Color</SectionLabel>
        <View style={styles.swatchRow}>
          {NEUTRALS.map((name) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.swatchColor, { backgroundColor: colors[name] }]} />
              <Text style={styles.swatchName}>{name}</Text>
              <Text style={styles.swatchValue}>{colors[name]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.swatchRow}>
          {TEXT_LEVELS.map((name) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.swatchColor, { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ ...theme.typography.stat, color: colors[name] }}>Aa 12</Text>
              </View>
              <Text style={styles.swatchName}>{name}</Text>
              <Text style={styles.swatchValue}>
                {colors[name]} · {contrastRatio(colors[name], colors.surface).toFixed(1)}:1
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.swatchRow}>
          {(['accent', 'accentOnDark', 'positive'] as const).map((name) => (
            <View key={name} style={styles.swatch}>
              <View style={[styles.swatchColor, { backgroundColor: colors[name] }]} />
              <Text style={styles.swatchName}>{name}</Text>
              <Text style={styles.swatchValue}>
                {colors[name]} · {contrastRatio(colors[name], colors.surface).toFixed(1)}:1
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>Ratios are against the surface color. Text needs 4.5:1 (AA). Red text on dark would not pass, so small red text and icons use accentOnDark; white on the accent is {contrastRatio(colors.accentText, colors.accent).toFixed(1)}:1.</Text>
      </View>

      <View style={styles.section}>
        <SectionLabel>Type</SectionLabel>
        {TYPE_SAMPLES.map(({ name, sample }) => (
          <View key={name} style={styles.typeRow}>
            <Text style={styles.typeName}>
              {name} · {theme.typography[name].fontFamily.replace('_', ' ')} · {theme.typography[name].fontSize}
            </Text>
            <Text style={[theme.typography[name], styles.typeSample]}>{sample}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionLabel>Spacing and shape</SectionLabel>
        {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).map((key) => (
          <View key={key} style={styles.spaceRow}>
            <Text style={[styles.swatchValue, { width: 64 }]}>
              {key} {theme.spacing[key]}
            </Text>
            <View style={[styles.spaceBar, { width: theme.spacing[key] * 4 }]} />
          </View>
        ))}
        <View style={styles.radiusRow}>
          <View style={styles.radiusItem}>
            <View style={[styles.radiusBox, { borderRadius: theme.radius.control }]} />
            <Text style={styles.swatchValue}>control 4</Text>
          </View>
          <View style={styles.radiusItem}>
            <View style={[styles.radiusBox, { borderRadius: theme.radius.panel }]} />
            <Text style={styles.swatchValue}>panel 6</Text>
          </View>
          <View style={styles.radiusItem}>
            <View style={styles.radiusDot} />
            <Text style={styles.swatchValue}>dot</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel>Buttons</SectionLabel>
        <Button label="Start Race" onPress={() => {}} />
        <Button label="Buy for 450" variant="secondary" icon="cart-outline" onPress={() => {}} />
        <Button label="Equip" variant="soft" onPress={() => {}} />
        <Button label="Cancel" variant="ghost" onPress={() => {}} />
        <Button label="Disabled" onPress={() => {}} disabled />
      </View>

      <View style={styles.section}>
        <SectionLabel>Start button</SectionLabel>
        <StartButton label="Start Race" frame onPress={() => {}} />
        <StartButton label="Race again" onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <SectionLabel>Corner ticks and glass</SectionLabel>
        <BracketFrame>
          <StatBlock label="Distance" value="679" unit="km" />
        </BracketFrame>
        <Glass>
          <StatBlock label="Streak" value="5" unit="days" />
        </Glass>
        <Glass corner="flat">
          <StatBlock label="Flat glass strip" value="Tab bar" size="small" />
        </Glass>
      </View>

      <View style={styles.section}>
        <SectionLabel>Segmented control and dialog</SectionLabel>
        <SegmentedControl options={['laps', 'minutes'] as const} value={mode} onChange={setMode} labelFor={(m) => (m === 'laps' ? 'Laps' : 'Minutes')} />
        <Button
          label="Show a dialog"
          variant="secondary"
          onPress={() =>
            showAlert('End race early?', 'You keep the laps and focus time you have done so far.', [
              { text: 'Keep racing', style: 'cancel' },
              { text: 'End race', style: 'destructive' },
            ])
          }
        />
      </View>

      <View style={styles.section}>
        <SectionLabel>Panel and stat blocks</SectionLabel>
        <Panel>
          <View style={styles.stripRow}>
            <View style={styles.stripCell}>
              <StatBlock label="Streak" value="5" unit="days" />
            </View>
            <View style={[styles.stripCell, styles.stripCellDivided]}>
              <StatBlock label="Races" value="7" />
            </View>
            <View style={[styles.stripCell, styles.stripCellDivided]}>
              <StatBlock label="Distance" value="679" unit="km" />
            </View>
          </View>
        </Panel>
        <Panel large>
          <StatBlock label="Next level" value="9" unit="XP to go" size="large" />
          <Divider style={{ marginVertical: theme.spacing.md }} />
          <StatBlock label="Credits" value="1,284" size="small" />
        </Panel>
        <Panel selected raised>
          <Text style={{ ...theme.typography.body, color: colors.text }}>Selected, raised panel (accent outline).</Text>
        </Panel>
      </View>

      <View style={styles.section}>
        <SectionLabel trailing="141 / 150">Progress</SectionLabel>
        <View>
          <Text style={styles.barLabel}>Continuous</Text>
          <SegmentedProgress fraction={0.94} accessibilityLabel="XP to the next level" />
        </View>
        <View>
          <Text style={styles.barLabel}>Segmented (10)</Text>
          <SegmentedProgress fraction={0.94} segments={10} />
        </View>
        <View>
          <Text style={styles.barLabel}>Segmented (10), 35%</Text>
          <SegmentedProgress fraction={0.35} segments={10} />
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel>Chips</SectionLabel>
        <View style={styles.chipRow}>
          {['All', '2026', '2022', '2014'].map((label) => (
            <Chip key={label} label={label} count={label === 'All' ? 42 : undefined} selected={chip === label} onPress={() => setChip(label)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel>List rows</SectionLabel>
        <View>
          <ListRow title="Compare generations" subtitle="Any two generations side by side." icon="git-compare-outline" onPress={() => {}} />
          <ListRow title="Total focus time" value="3 h 18 min" icon="timer-outline" />
          <ListRow title="Reset all data" destructive icon="trash-outline" onPress={() => {}} last />
        </View>
      </View>
    </ScrollView>
  );
}
