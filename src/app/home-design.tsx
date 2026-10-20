import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../design/styles';
import { DEFAULT_HOME_DESIGN, HOME_DESIGNS, getHomeDesign, saveHomeDesign } from '../storage/homeDesign';
import type { HomeDesignId } from '../storage/homeDesign';
import { colors } from '../theme';

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.sm },
  intro: { ...t.type.caption, color: t.colors.textMuted, marginBottom: t.spacing.xs },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.md,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  optionSelected: { borderColor: t.colors.accent, borderWidth: t.border.selected },
  text: { flex: 1, gap: 4 },
  name: { ...t.type.heading, color: t.colors.text },
  description: { ...t.type.caption, color: t.colors.textMuted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: t.colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: t.colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: t.colors.accent },
  // a tiny phone with the layout drawn as grey blocks
  phone: { width: 54, height: 96, padding: 5, gap: 3, backgroundColor: t.colors.background, borderRadius: 6, borderWidth: t.border.hairline, borderColor: t.colors.borderStrong },
  row: { flexDirection: 'row', gap: 3 },
  block: { backgroundColor: t.colors.border, borderRadius: 1 },
  blockLight: { backgroundColor: t.colors.borderStrong, borderRadius: 1 },
  blockAccent: { backgroundColor: t.colors.accent, borderRadius: 1 },
}));

/** The layout of one Home design drawn as a handful of blocks. */
function Wireframe({ id }: { id: HomeDesignId }) {
  const s = useStyles();
  const bar = (w: number | string, h = 3, style: ViewStyle = s.block) => <View style={[style, { width: w as number, height: h }]} />;
  const button = <View style={[s.blockAccent, { height: 8, marginTop: 'auto' }]} />;
  const car = (flex = 1) => <View style={[s.blockLight, { flex, borderRadius: 3 }]} />;
  switch (id) {
    case 'ring':
      return (
        <View style={s.phone}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.accent }} />
          </View>
          {car()}
          {bar('100%', 2)}
          {button}
        </View>
      );
    case 'cards':
      return (
        <View style={s.phone}>
          {car(1.4)}
          <View style={s.row}>
            <View style={[s.block, { flex: 1, height: 14 }]} />
            <View style={[s.block, { flex: 1, height: 14 }]} />
          </View>
          <View style={[s.block, { height: 9 }]} />
          {button}
        </View>
      );
    case 'poster':
      return (
        <View style={s.phone}>
          <View style={[s.blockLight, { width: 22, height: 22 }]} />
          {bar(30, 2, s.blockAccent)}
          {car()}
          <View style={s.row}>
            {bar(8, 3)}
            {bar(8, 3)}
            {bar(8, 3)}
          </View>
          {button}
        </View>
      );
    case 'telemetry':
      return (
        <View style={s.phone}>
          <View style={s.row}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={[i < 4 ? s.blockAccent : s.block, { flex: 1, height: 3 }]} />
            ))}
          </View>
          {car()}
          <View style={s.row}>
            <View style={[s.block, { flex: 1, height: 8 }]} />
            <View style={[s.block, { flex: 1, height: 8 }]} />
          </View>
          <View style={s.row}>
            <View style={[s.block, { flex: 1, height: 8 }]} />
            <View style={[s.block, { flex: 1, height: 8 }]} />
          </View>
          {button}
        </View>
      );
    default:
      return (
        <View style={s.phone}>
          <View style={s.row}>
            {bar(22, 5, s.blockLight)}
            {bar(8, 5)}
          </View>
          {car()}
          <View style={[s.block, { height: 10 }]} />
          {button}
        </View>
      );
  }
}

/** Settings > Home design: choose how the Home screen is laid out. The choice is saved on this phone. */
export default function HomeDesignScreen() {
  const styles = useStyles();
  const [selected, setSelected] = useState<HomeDesignId>(DEFAULT_HOME_DESIGN);

  useEffect(() => {
    getHomeDesign().then(setSelected);
  }, []);

  const choose = (id: HomeDesignId) => {
    setSelected(id);
    void saveHomeDesign(id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Pick the layout you like. Home updates as soon as you choose.</Text>
        {HOME_DESIGNS.map((design) => {
          const on = design.id === selected;
          return (
            <Pressable
              key={design.id}
              style={[styles.option, on && styles.optionSelected]}
              onPress={() => choose(design.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${design.name} home layout. ${design.description}`}
            >
              <Wireframe id={design.id} />
              <View style={styles.text}>
                <Text style={styles.name}>{design.name}</Text>
                <Text style={styles.description}>{design.description}</Text>
              </View>
              <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
