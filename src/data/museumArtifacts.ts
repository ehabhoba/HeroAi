
import { MuseumArtifact } from '../types';

// Note: 3D Models are placeholders from public sources like Sketchfab, under CC licenses.
export const artifacts: MuseumArtifact[] = [
  {
    id: 'tutankhamun_mask',
    name: {
      en: "Mask of Tutankhamun",
      ar: "قناع توت عنخ آمون"
    },
    description: {
      en: "The golden death mask of the 18th-dynasty Ancient Egyptian Pharaoh Tutankhamun. It is one of the best-known works of art in the world.",
      ar: "قناع الموت الذهبي للفرعون المصري توت عنخ آمون من الأسرة الثامنة عشرة. وهو من أشهر الأعمال الفنية في العالم."
    },
    era: {
      en: "New Kingdom, 18th Dynasty",
      ar: "الدولة الحديثة، الأسرة الثامنة عشرة"
    },
    location: {
      en: "Grand Egyptian Museum, Giza",
      ar: "المتحف المصري الكبير، الجيزة"
    },
    discoveryYear: 1925,
    imageUrl: 'https://images.unsplash.com/photo-1570698773130-1b578d43533e?q=80&w=800',
    modelUrl: 'https://storage.googleapis.com/hiero-ai-3d-models/tutankhamun_mask.glb'
  },
  {
    id: 'rosetta_stone',
    name: {
      en: "Rosetta Stone Replica",
      ar: "نسخة من حجر رشيد"
    },
    description: {
      en: "A replica of the stele inscribed with three versions of a decree issued at Memphis, Egypt in 196 BC. The top and middle texts are in Ancient Egyptian using hieroglyphic and Demotic scripts respectively, while the bottom is in Ancient Greek, which was key to deciphering Egyptian hieroglyphs.",
      ar: "نسخة من لوح منقوش بثلاث نسخ من مرسوم صدر في ممفيس، مصر عام 196 قبل الميلاد. النصان العلوي والأوسط باللغة المصرية القديمة باستخدام الكتابة الهيروغليفية والديموطيقية على التوالي، بينما الجزء السفلي باللغة اليونانية القديمة، والذي كان مفتاحًا لفك رموز الهيروغليفية المصرية."
    },
    era: {
      en: "Ptolemaic Period",
      ar: "العصر البطلمي"
    },
    location: {
        en: "British Museum, London (Original)",
        ar: "المتحف البريطاني، لندن (الأصلي)"
    },
    discoveryYear: 1799,
    imageUrl: 'https://images.unsplash.com/photo-1620027582569-a7c55c01b637?q=80&w=800',
    modelUrl: 'https://storage.googleapis.com/hiero-ai-3d-models/rosetta_stone.glb'
  },
  {
    id: 'great_sphinx',
    name: {
      en: "The Great Sphinx of Giza",
      ar: "أبو الهول بالجيزة"
    },
    description: {
      en: "A limestone statue of a reclining sphinx, a mythical creature with the body of a lion and the head of a human. It is the oldest known monumental sculpture in Egypt.",
      ar: "تمثال من الحجر الجيري لأسد رابض، وهو مخلوق أسطوري بجسم أسد ورأس إنسان. وهو أقدم تمثال ضخم معروف في مصر."
    },
    era: {
      en: "Old Kingdom, 4th Dynasty",
      ar: "الدولة القديمة، الأسرة الرابعة"
    },
     location: {
        en: "Giza Plateau, Giza",
        ar: "هضبة الجيزة، الجيزة"
    },
    discoveryYear: 1817, // Rediscovery by Giovanni Battista Caviglia
    imageUrl: 'https://images.unsplash.com/photo-1593033872439-f3e3a6c1d7a8?q=80&w=800',
    modelUrl: 'https://storage.googleapis.com/hiero-ai-3d-models/great_sphinx.glb'
  },
  {
    id: 'narmer_palette',
    name: {
      en: "Narmer Palette Replica",
      ar: "نسخة من صلاية نعرمر"
    },
    description: {
      en: "A replica of a significant Egyptian archaeological find, dating from about the 31st century BC. It contains some of the earliest hieroglyphic inscriptions ever found and is thought to depict the unification of Upper and Lower Egypt under King Narmer.",
      ar: "نسخة من اكتشاف أثري مصري مهم، يرجع تاريخه إلى حوالي القرن الحادي والثلاثين قبل الميلاد. يحتوي على بعض من أقدم النقوش الهيروغليفية التي تم العثور عليها ويعتقد أنه يصور توحيد مصر العليا والسفلى تحت حكم الملك نعرمر."
    },
    era: {
      en: "Early Dynastic Period",
      ar: "عصر الأسرات المبكر"
    },
     location: {
        en: "Grand Egyptian Museum, Giza (Original)",
        ar: "المتحف المصري الكبير، الجيزة (الأصلي)"
    },
    discoveryYear: 1898,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Narmer_Palette.jpg',
    modelUrl: 'https://storage.googleapis.com/hiero-ai-3d-models/narmer_palette.glb'
  }
];
