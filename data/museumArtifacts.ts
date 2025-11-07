
import { MuseumArtifact } from '../types';

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
    imageUrl: 'https://picsum.photos/seed/tutmask/800/600'
  },
  {
    id: 'rosetta_stone',
    name: {
      en: "Rosetta Stone",
      ar: "حجر رشيد"
    },
    description: {
      en: "A stele inscribed with three versions of a decree issued at Memphis, Egypt in 196 BC. The top and middle texts are in Ancient Egyptian using hieroglyphic and Demotic scripts respectively, while the bottom is in Ancient Greek, which was key to deciphering Egyptian hieroglyphs.",
      ar: "لوح منقوش بثلاث نسخ من مرسوم صدر في ممفيس، مصر عام 196 قبل الميلاد. النصان العلوي والأوسط باللغة المصرية القديمة باستخدام الكتابة الهيروغليفية والديموطيقية على التوالي، بينما الجزء السفلي باللغة اليونانية القديمة، والذي كان مفتاحًا لفك رموز الهيروغليفية المصرية."
    },
    era: {
      en: "Ptolemaic Period",
      ar: "العصر البطلمي"
    },
    imageUrl: 'https://picsum.photos/seed/rosetta/800/600'
  },
  {
    id: 'great_sphinx',
    name: {
      en: "Model of the Great Sphinx",
      ar: "نموذج لأبو الهول"
    },
    description: {
      en: "A limestone statue of a reclining sphinx, a mythical creature with the body of a lion and the head of a human. It is the oldest known monumental sculpture in Egypt.",
      ar: "تمثال من الحجر الجيري لأسد رابض، وهو مخلوق أسطوري بجسم أسد ورأس إنسان. وهو أقدم تمثال ضخم معروف في مصر."
    },
    era: {
      en: "Old Kingdom, 4th Dynasty",
      ar: "الدولة القديمة، الأسرة الرابعة"
    },
    imageUrl: 'https://picsum.photos/seed/sphinx/800/600'
  },
  {
    id: 'narmer_palette',
    name: {
      en: "Narmer Palette",
      ar: "صلاية نعرمر"
    },
    description: {
      en: "A significant Egyptian archaeological find, dating from about the 31st century BC. It contains some of the earliest hieroglyphic inscriptions ever found and is thought to depict the unification of Upper and Lower Egypt under King Narmer.",
      ar: "اكتشاف أثري مصري مهم، يرجع تاريخه إلى حوالي القرن الحادي والثلاثين قبل الميلاد. يحتوي على بعض من أقدم النقوش الهيروغليفية التي تم العثور عليها ويعتقد أنه يصور توحيد مصر العليا والسفلى تحت حكم الملك نعرمر."
    },
    era: {
      en: "Early Dynastic Period",
      ar: "عصر الأسرات المبكر"
    },
    imageUrl: 'https://picsum.photos/seed/narmer/800/600'
  }
];
