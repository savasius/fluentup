export type KidStorySentence = {
  en: string;
  tr: string;
};

export type KidStory = {
  id: string;
  title: string;
  titleTr: string;
  level: "A1" | "A2";
  sentences: KidStorySentence[];
};

export const KID_STORIES: KidStory[] = [
  {
    id: "cat-milk",
    title: "The cat and the milk",
    titleTr: "Kedi ve süt",
    level: "A1",
    sentences: [
      { en: "I have a small cat.", tr: "Küçük bir kedim var." },
      { en: "The cat is white.", tr: "Kedi beyaz." },
      { en: "The cat likes milk.", tr: "Kedi sütü sever." },
      { en: "Every morning I give milk.", tr: "Her sabah süt veririm." },
      { en: "My cat is happy.", tr: "Kedim mutlu." },
    ],
  },
  {
    id: "birthday",
    title: "My birthday",
    titleTr: "Doğum günüm",
    level: "A1",
    sentences: [
      { en: "Today is my birthday.", tr: "Bugün benim doğum günüm." },
      { en: "I am ten years old.", tr: "On yaşındayım." },
      { en: "My mother makes a cake.", tr: "Annem pasta yapıyor." },
      { en: "My friends come to my house.", tr: "Arkadaşlarım eve geliyor." },
      { en: "We sing and play games.", tr: "Şarkı söylüyoruz ve oyun oynuyoruz." },
    ],
  },
  {
    id: "school-day",
    title: "A day at school",
    titleTr: "Okulda bir gün",
    level: "A2",
    sentences: [
      { en: "I walk to school with my bag.", tr: "Çantamla okula yürüyorum." },
      { en: "My teacher says hello.", tr: "Öğretmenim merhaba der." },
      { en: "We read a story in English.", tr: "İngilizce bir hikaye okuyoruz." },
      { en: "At lunch I eat an apple.", tr: "Öğle arasında elma yerim." },
      { en: "After school I play football.", tr: "Okuldan sonra futbol oynarım." },
    ],
  },
  {
    id: "rainy-day",
    title: "Rainy day",
    titleTr: "Yağmurlu gün",
    level: "A1",
    sentences: [
      { en: "The sky is gray today.", tr: "Bugün gökyüzü gri." },
      { en: "It is raining outside.", tr: "Dışarıda yağmur yağıyor." },
      { en: "I wear my yellow boots.", tr: "Sarı çizmelerimi giyerim." },
      { en: "I jump in small puddles.", tr: "Küçük su birikintilerine zıplarım." },
      { en: "Then we drink hot tea.", tr: "Sonra sıcak çay içeriz." },
    ],
  },
  {
    id: "zoo-trip",
    title: "At the zoo",
    titleTr: "Hayvanat bahçesinde",
    level: "A2",
    sentences: [
      { en: "We see many animals today.", tr: "Bugün birçok hayvan görüyoruz." },
      { en: "The elephant is very big.", tr: "Fil çok büyük." },
      { en: "The monkey is funny.", tr: "Maymun komik." },
      { en: "Do not feed the animals.", tr: "Hayvanları beslemeyin." },
      { en: "I take a photo with my father.", tr: "Babamla fotoğraf çekiyorum." },
    ],
  },
];
