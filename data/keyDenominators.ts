export const indicatorsDenominators: {
  keys: string[];
  denominators: string[];
}[] = [
  {
    keys: [
      "ald_u_5",
      "ald_6_12",
      "ald_13_15",
      "ald_16_18",
      "ald_19_23",
      "ald_24_34",
      "ald_35_44",
      "ald_45_54",
      "ald_55_64",
      "ald_65_74",
      "ald_75_84",
      "ald_85_o",
      "ald_snitt",
    ],
    denominators: ["ald_totalt"],
  },
  {
    keys: [
      "epr_under_500",
      "epr_500_1000",
      "epr_1000_1500",
      "epr_1500_2000",
      "epr_2000_2500",
      "epr_2500_3000",
      "epr_3000_4000",
      "epr_4000_5000",
      "epr_5000_6000",
      "epr_6000_over",
    ],
    denominators: ["epr_omsetninger"],
  },
  {
    keys: [
      "bar_u_50",
      "bar_50_59",
      "bar_60_79",
      "bar_80_99",
      "bar_100_119",
      "bar_120_139",
      "bar_140_159",
      "bar_160_199",
      "bar_200_249",
      "bar_250_o",
    ],
    denominators: [
      "bar_u_50",
      "bar_50_59",
      "bar_60_79",
      "bar_80_99",
      "bar_100_119",
      "bar_120_139",
      "bar_140_159",
      "bar_160_199",
      "bar_200_249",
      "bar_250_o",
    ],
  },
  {
    keys: [
      "fam_enslig_uten_barn",
      "fam_enslig_med_barn",
      "fam_par_uten_barn",
      "fam_par_med_barn",
      "fam_enfamilie_med_voksne_barn",
      "fam_flerfamilie",
    ],
    denominators: ["fam_totalt"],
  },
  {
    keys: [
      "for_0",
      "for_0_50",
      "for_50_200",
      "for_200_400",
      "for_400_700",
      "for_700_1000",
      "for_1000_2000",
      "for_2000_3000",
      "for_3000_4000",
      "for_4000_over",
      "for_snitt",
    ],
    denominators: ["for_personer"],
  },
  {
    keys: [
      "int_0",
      "int_0_100",
      "int_100_200",
      "int_200_300",
      "int_300_400",
      "int_400_500",
      "int_500_600",
      "int_600_700",
      "int_700_800",
      "int_800_1000",
      "int_1000_1500",
      "int_1500_over",
      "int_totalt",
      "int_snitt",
    ],
    denominators: ["int_personer"],
  },
  {
    keys: ["alk_totalt", "alm_totalt"],
    denominators: ["alk_totalt", "alm_totalt"],
  },
  {
    keys: [
      "siv_ugift_mann",
      "siv_ugift_kvinne",
      "siv_gift",
      "siv_enke_eller_enkemann",
      "siv_separert_eller_skilt",
    ],
    denominators: ["siv_totalt"],
  },
  {
    keys: [
      "utn_ingen_eller_uoppgitt",
      "utn_grunnskole",
      "utn_videregaende",
      "utn_hogskole_universitet_lavt",
      "utn_hogskole_universitet_hoyt",
    ],
    denominators: ["utn_totalt"],
  },
  {
    keys: [
      "bot_enebolig",
      "bot_tomannsbolig",
      "bot_rekkehus",
      "bot_blokk",
      "bot_annen_bolig",
    ],
    denominators: ["bot_totalt"],
  },
  {
    keys: ["eif_selveier", "eif_eier_borettslagsbolig", "eif_leier"],
    denominators: ["eif_totalt"],
  },
  {
    keys: [
      "bal_1_aar",
      "bal_2_aar",
      "bal_2_5_aar",
      "bal_5_10_aar",
      "bal_10_20_aar",
      "bal_20_30_aar",
      "bal_30_40_aar",
      "bal_40_50_aar",
      "bal_over_50_aar",
    ],
    denominators: [
      "bal_1_aar",
      "bal_2_aar",
      "bal_2_5_aar",
      "bal_5_10_aar",
      "bal_10_20_aar",
      "bal_20_30_aar",
      "bal_30_40_aar",
      "bal_40_50_aar",
      "bal_over_50_aar",
    ],
  },
  {
    keys: ["ans_sysselsatte", "ans_ansatte"],
    denominators: ["ans_totalt"],
  },

  { keys: ["barn_teller"], denominators: ["barn_nevner"] },
  { keys: ["innvandrere_teller"], denominators: ["innvandrere_nevner"] },
  {
    keys: ["barneutflyttinger_teller"],
    denominators: ["barneutflyttinger_nevner"],
  },
  { keys: ["utflyttinger_teller"], denominators: ["utflyttinger_nevner"] },
  {
    keys: ["barn_enslige_foreldre_teller"],
    denominators: ["barn_enslige_foreldre_nevner"],
  },
  { keys: ["aleneboende_teller"], denominators: ["aleneboende_nevner"] },
  {
    keys: ["lav_utdanning_30_39_teller"],
    denominators: ["lav_utdanning_30_39_nevner"],
  },
  {
    keys: ["lav_utdanning_16_teller"],
    denominators: ["lav_utdanning_16_nevner"],
  },
  {
    keys: ["hoy_utdanning_30_39_teller"],
    denominators: ["hoy_utdanning_30_39_nevner"],
  },
  {
    keys: ["hoy_utdanning_16_teller"],
    denominators: ["hoy_utdanning_16_nevner"],
  },
  {
    keys: ["ikke_kompetanse_teller"],
    denominators: ["ikke_kompetanse_nevner"],
  },
  {
    keys: ["personer_lavinntekt_eu50_teller"],
    denominators: ["personer_lavinntekt_eu50_nevner"],
  },
  {
    keys: ["personer_lavinntekt_eu60_teller"],
    denominators: ["personer_lavinntekt_eu60_nevner"],
  },
  {
    keys: ["barn_lavinntekt_eu50_teller"],
    denominators: ["barn_lavinntekt_eu50_nevner"],
  },
  {
    keys: ["barn_lavinntekt_eu60_teller"],
    denominators: ["barn_lavinntekt_eu60_nevner"],
  },
  { keys: ["gjeld_teller"], denominators: ["gjeld_nevner"] },
  { keys: ["AAP_teller"], denominators: ["AAP_nevner"] },
  {
    keys: ["arbeidsledighet_teller"],
    denominators: ["arbeidsledighet_nevner"],
  },
  {
    keys: ["ungdomsledighet_teller"],
    denominators: ["ungdomsledighet_nevner"],
  },
  { keys: ["sosialhjelp_teller"], denominators: ["sosialhjelp_nevner"] },
  { keys: ["unge_ufore_teller"], denominators: ["unge_ufore_nevner"] },
  {
    keys: ["overgangsstonad_teller"],
    denominators: ["overgangsstonad_nevner"],
  },
  { keys: ["barnevern_teller"], denominators: ["barnevern_nevner"] },
  { keys: ["leide_boliger_teller"], denominators: ["leide_boliger_nevner"] },
  {
    keys: ["bar_snittareal"],
    denominators: [
      "bar_u_50",
      "bar_50_59",
      "bar_60_79",
      "bar_80_99",
      "bar_100_119",
      "bar_120_139",
      "bar_140_159",
      "bar_160_199",
      "bar_200_249",
      "bar_250_o",
    ],
  },
  {
    keys: ["bal_snittalder"],
    denominators: [
      "bal_1_aar",
      "bal_2_aar",
      "bal_2_5_aar",
      "bal_5_10_aar",
      "bal_10_20_aar",
      "bal_20_30_aar",
      "bal_30_40_aar",
      "bal_40_50_aar",
      "bal_over_50_aar",
    ],
  },
  {
    keys: ["epr_snittpris"],
    denominators: ["epr_omsetninger"],
  },
] as const;

const uniq = <T>(arr: readonly T[]) => Array.from(new Set(arr));

export const denominatorKeys = indicatorsDenominators.reduce(
  (map, { keys, denominators }) => {
    for (const d of denominators) {
      const prev = map.get(d) ?? [];
      map.set(d, uniq([...prev, ...keys]));
    }
    return map;
  },
  new Map<string, string[]>(),
);

export const keysDenominators = indicatorsDenominators.reduce(
  (map, { keys, denominators }) => {
    for (const k of keys) {
      const prev = map.get(k) ?? [];
      map.set(k, uniq([...prev, ...denominators]));
    }
    return map;
  },
  new Map<string, string[]>(),
);
