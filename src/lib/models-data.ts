
export interface ImageView {
  src: string;
  alt: string;
  hint: string;
  viewName: string;
}

export interface ModelData {
  id: string;
  name: string;
  description: string;
  baseVehicle: string;
  basePrice: number;
  images: ImageView[];
  imageObjectClass?: string;
  features: {
    peinture: string;
    finition: string;
    jantes: string;
    sellerie: string;
    audio: string;
    edition?: string;
    bodykit?: string;
    echappement?: string;
  };
}

export const MODELS_DATA: ModelData[] = [
  {
    id: 'silenzia',
    name: 'RAWRK Silenzia – Édition Limitée',
    description: 'Un silence de guerre. Une carrosserie blanche comme la glace, taillée par des griffes bleues électriques. Le Silenzia n’est pas un véhicule, c’est une déclaration.',
    baseVehicle: 'Mercedes-AMG CLE 53 4MATIC+ Coupé',
    basePrice: 185000,
    images: [
      { src: '/images/RAWRK-White-Silenzia-Édition.png', alt: 'RAWRK Silenzia – Vue Avant', hint: 'white car coupe front', viewName: 'Avant' },
      { src: '/images/RAWRK-White-Silenzia-Édition.png', alt: 'RAWRK Silenzia – Vue Arrière', hint: 'white car coupe rear', viewName: 'Arrière' },
      { src: '/images/RAWRK-White-Silenzia-Édition.png', alt: 'RAWRK Silenzia – Vue Intérieur', hint: 'white car coupe interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Blanc Competition Perlé',
      finition: 'Pack Silenzia – Liserés bleus, badge RAWRK, diffuseur carbone satiné',
      jantes: '21’’ Forgées Noires Profondes, étriers bleus RAWRK',
      sellerie: 'Alcantara noir, surpiqûres bleues électriques, appuie-têtes embossés RAWRK',
      audio: 'RAWRK Sound System v1.3 – calme chirurgical, puissance en pression.',
      edition: '#014 / 100',
    },
  },
  {
    id: 'phantom-blackout',
    name: 'RAWRK Phantom Blackout Édition – Série Brute',
    description: 'Un félin noir dans la nuit. Le Phantom Blackout est le manifeste du conducteur sans visage, du style sans compromis. Ultra-noir, ultra-réactif, ultra-différent.',
    baseVehicle: 'Mercedes-AMG GT 63 S 4MATIC+ 4 portes',
    basePrice: 225000,
    images: [
        { src: '/images/RAWRK-Alpha-Strÿk-Edition.png', alt: 'RAWRK Phantom Blackout – Vue Avant', hint: 'black car wagon front', viewName: 'Avant' },
        { src: '/images/RAWRK-Alpha-Strÿk-Edition.png', alt: 'RAWRK Phantom Blackout – Vue Arrière', hint: 'black car wagon rear', viewName: 'Arrière' },
        { src: '/images/RAWRK-Alpha-Strÿk-Edition.png', alt: 'RAWRK Phantom Blackout – Vue Intérieur', hint: 'black car wagon interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Noir Obsidienne Mat + Finition anti-reflet Phantom',
      finition: 'Ligne Shadow RAWRK, logos noirs satinés, grilles retravaillées',
      jantes: '22’’ ShadowForged – finition brutale',
      sellerie: 'Full Black Cuir & Alcantara, inserts carbone obscurci',
      audio: 'RAWRK GhostSound v2.0 – grave profond, isolation absolue.',
      edition: 'Disponible à la demande, personnalisable',
    },
  },
  {
    id: 'dominator-gt',
    name: 'RAWRK Dominator GT Édition – Performance Prestige',
    description: 'Quand RAWRK pousse la ligne GT jusqu’à la domination. Le Dominator GT est l’équilibre ultime entre prestige, bestialité, et perfection aérodynamique.',
    baseVehicle: 'Mercedes-AMG CLA 53 4MATIC+',
    basePrice: 165000,
    images: [
        { src: '/images/RAWRK-Royal-Shadow-Edition.png', alt: 'RAWRK Dominator GT – Vue Avant', hint: 'black sports car front', viewName: 'Avant' },
        { src: '/images/RAWRK-Royal-Shadow-Edition.png', alt: 'RAWRK Dominator GT – Vue Arrière', hint: 'black sports car rear', viewName: 'Arrière' },
        { src: '/images/RAWRK-Royal-Shadow-Edition.png', alt: 'RAWRK Dominator GT – Vue Intérieur', hint: 'black sports car interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Gris Montagne Satin + Liseré RAWRK Red',
      finition: 'Inserts RAWRK rouge foncé, ambiance full LED',
      jantes: 'RAWRK CarbonForged 21’’ finition noir chromé',
      sellerie: 'Cuir perforé sur mesure',
      audio: 'RAWRK Sound System',
      bodykit: 'Élargissement Dominator v2 + becquet carbone actif',
      echappement: 'RAWRK BrutalFlow – valve adaptative',
      edition: 'Signature | Custom sur commande',
    },
  },
   {
    id: 'velocità-pro',
    name: 'RAWRK Velocità Édition – Agent Pro',
    description: 'Version spéciale personnalisée sur base AMG. Un concentré de performance et de style, signé RAWRK.',
    baseVehicle: 'Mercedes-AMG A 45 S 4MATIC+',
    basePrice: 155000,
    images: [
        { src: '/images/RAWRK-Velocita-Édition.png', alt: 'RAWRK Velocità Édition – Vue Avant', hint: 'silver sports hatchback front', viewName: 'Avant' },
        { src: '/images/RAWRK-Velocita-Édition.png', alt: 'RAWRK Velocità Édition – Vue Arrière', hint: 'silver sports hatchback rear', viewName: 'Arrière' },
        { src: '/images/RAWRK-Velocita-Édition.png', alt: 'RAWRK Velocità Édition – Vue Intérieur', hint: 'silver sports hatchback interior', viewName: 'Intérieur' },
    ],
    imageObjectClass: 'object-center',
    features: {
      peinture: 'Argent High-Tech métallisé',
      finition: 'Détails noir mat & rouge profond, logo RAWRK noir',
      jantes: 'Jantes forgées AMG 19" Y Noir Mat, étriers rouges RAWRK',
      sellerie: 'Sièges Performance AMG cuir/alcantara noir, surpiqûres rouges',
      audio: 'Burmester® Surround Sound System',
      bodykit: 'Pack Aérodynamique AMG, bequet exclusif RAWRK, diffuseur carbone satiné',
    },
  },
  {
    id: 'emeraude-nocturne',
    name: 'RAWRK Émeraude Nocturne Édition',
    description: 'Le côté sauvage et électrisant du luxe. Une fusion audacieuse de performance électrique et de style affirmé, basée sur le Mercedes-AMG EQE SUV 53 4MATIC+.',
    baseVehicle: 'Mercedes-AMG EQE SUV 53 4MATIC+',
    basePrice: 195000,
    images: [
      { src: '/images/RAWRK-Émeraude-Nocturne-Édition.png', alt: 'RAWRK Émeraude Nocturne – Vue Avant', hint: 'green suv front', viewName: 'Avant' },
      { src: '/images/RAWRK-Émeraude-Nocturne-Édition.png', alt: 'RAWRK Émeraude Nocturne – Vue Arrière', hint: 'green suv rear', viewName: 'Arrière' },
      { src: '/images/RAWRK-Émeraude-Nocturne-Édition.png', alt: 'RAWRK Émeraude Nocturne – Vue Intérieur', hint: 'green suv interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Vert Émeraude Métallisé',
      finition: 'Pack Sport Black I & II, Marchepieds lumineux',
      jantes: '22" Multibranches AMG',
      sellerie: 'Inserts carbone et finitions MICROCUT',
      audio: 'Burmester® 3D Surround Sound System',
      bodykit: 'Kit carrosserie AMG revisité façon RAWRK',
    },
  },
  {
    id: 'titan-f1',
    name: 'RAWRK Titàn F1 Édition',
    description: '“Titàn” évoque la puissance colossale, le poids majestueux du SUV et la performance brute de l’AMG. Le nom sonne à la fois prestige, brutalité et modernité, comme un joyau électrifié prêt à faire trembler l’asphalte.',
    baseVehicle: 'Mercedes-AMG EQE 53 4MATIC+ SUV',
    basePrice: 171870,
    images: [
      { src: '/images/RAWRK-Titàn-F1-Édition.png', alt: 'RAWRK Titàn F1 Édition – Vue Avant', hint: 'futuristic suv front', viewName: 'Avant' },
      { src: '/images/RAWRK-Titàn-F1-Édition.png', alt: 'RAWRK Titàn F1 Édition – Vue Arrière', hint: 'futuristic suv rear', viewName: 'Arrière' },
      { src: '/images/RAWRK-Titàn-F1-Édition.png', alt: 'RAWRK Titàn F1 Édition – Vue Intérieur', hint: 'futuristic suv interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Gris Sélénite métallisé',
      finition: 'Pack Sport Black I & II (grille noire, logos sombres)',
      jantes: 'Jantes 22" multibranches AMG',
      sellerie: 'Inserts carbone et finitions MICROCUT',
      audio: 'Système de sonorisation Surround Burmester®',
      bodykit: 'Kit carrosserie AMG revisité façon RAWRK',
      edition: 'Édition F1',
    },
  },
    {
    id: 'velocita-pub-spec',
    name: 'RAWRK Velocità Édition – Pub Spec',
    description: 'Une version encore plus agressive et optimisée pour la performance pure. Prête pour la piste, homologuée pour la route.',
    baseVehicle: 'Mercedes-AMG A 45 S 4MATIC+',
    basePrice: 175000,
    imageObjectClass: 'object-center',
    images: [
      { src: '/images/RAWRK-Velocità-Édition-pub.png', alt: 'RAWRK Velocità Pub Spec – Vue Avant', hint: 'racing hatchback front', viewName: 'Avant' },
      { src: '/images/RAWRK-Velocità-Édition-pub.png', alt: 'RAWRK Velocità Pub Spec – Vue Arrière', hint: 'racing hatchback rear', viewName: 'Arrière' },
      { src: '/images/RAWRK-Velocità-Édition-pub.png', alt: 'RAWRK Velocità Pub Spec – Vue Intérieur', hint: 'racing hatchback interior', viewName: 'Intérieur' },
    ],
    features: {
      peinture: 'Argent High-Tech métallisé avec livrée course RAWRK',
      finition: 'Détails en carbone forgé, logo RAWRK rouge compétition',
      jantes: 'Jantes forgées AMG 19" Aero-Disc, pneus semi-slick',
      sellerie: 'Sièges baquets Recaro x RAWRK en Alcantara, harnais 4 points',
      audio: 'Système audio allégé, focus sur la sonorité moteur',
      bodykit: 'Pack Aérodynamique AMG Pro, aileron arrière en col de cygne, lame avant étendue',
      echappement: 'Ligne complète titane RAWRK Performance',
    },
  },
];

export const DEFAULT_MODEL = MODELS_DATA[0];
