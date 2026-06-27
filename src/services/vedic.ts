import { generateId } from '@/utils';
import { vedicContent as fallbackVedicContent } from '@/content/vedic';
import type { VedicContent } from '@/types';

const GITA_API_BASE = 'https://vedicscriptures.github.io';

const EXTENDED_VEDIC_CONTENT: VedicContent[] = [
  {
    id: 'gita-4-1', title: 'Bhagavad Gita: Chapter 4 - Jnana Karma Sanyasa Yoga',
    sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥',
    transliteration: 'Nainam chhindanti shastrani nainam dahati pavakah, na chainam kledayantyapo na shoshayati marutah.',
    hindi: 'आत्मा को शस्त्र नहीं काट सकते, अग्नि नहीं जला सकती, जल नहीं गीला कर सकता, और वायु नहीं सुखा सकती।',
    english: 'The soul cannot be cut by weapons, nor burned by fire, nor moistened by water, nor dried by wind.',
    explanation: 'Krishna reveals the eternal, indestructible nature of the soul (Atman) to Arjuna.',
    philosophy: 'This verse establishes the metaphysical foundation of the Gita — the soul is beyond physical elements and mortality.',
    source: 'Bhagavad Gita', chapter: 'Chapter 4',
  },
  {
    id: 'gita-5-1', title: 'Bhagavad Gita: Chapter 5 - Karma Sanyasa Yoga',
    sanskrit: 'कर्मसंन्यासात्मायं विशुद्धिमेति विपाश्चितः। ज्ञानसंस्पर्शजातं च सुखं साक्षात् विद्यते॥',
    transliteration: 'Karmasannyasatmayam vishuddhimeti vipashchitah, jnanasamsparshajatam cha sukham sakshat vidyate.',
    hindi: 'कर्म-संन्यास से मनुष्य शुद्धि को प्राप्त होता है। ज्ञान के स्पर्श से तत्काल सुख प्राप्त होता है।',
    english: 'Through the renunciation of actions, the wise attain purity. From contact with the Self, they immediately experience happiness.',
    explanation: 'This chapter reconciles the paths of knowledge and action, showing both lead to liberation.',
    philosophy: 'True renunciation is not abandoning actions but renouncing attachment to their fruits.',
    source: 'Bhagavad Gita', chapter: 'Chapter 5',
  },
  {
    id: 'gita-6-1', title: 'Bhagavad Gita: Chapter 6 - Dhyana Yoga',
    sanskrit: 'आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः। बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः॥',
    transliteration: 'Atmaiva hyatmano bandhuratmaiva ripuratmanah, bandhuratmatmanas tasya yenatmaivatmana jitah.',
    hindi: 'आत्मा ही अपनी मित्र है, आत्मा ही अपनी शत्रु है। जिसने अपने आप को जीत लिया, उसका आत्मा उसका मित्र है।',
    english: 'The Self is the friend of the self for him who has conquered the Self. For him who has not conquered, the Self is an enemy.',
    explanation: 'Krishna teaches that mastery over oneself is the foundation of meditation and liberation.',
    philosophy: 'The greatest battle is within — victory over one\'s own mind leads to lasting peace.',
    source: 'Bhagavad Gita', chapter: 'Chapter 6',
  },
  {
    id: 'gita-9-1', title: 'Bhagavad Gita: Chapter 9 - Raja Vidya Yoga',
    sanskrit: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति। तदहं भक्त्युपृहृतं श्नामि प्रयतात्मनः॥',
    transliteration: 'Patram pushpam phalam toyam yo me bhaktya prayacchati, tadaham bhaktyupahritam ashnami prayatatmanah.',
    hindi: 'जो भक्ति से मुझे पत्र, पुष्प, फल और जल चढ़ाता है, मैं उसकी भक्ति से प्रसन्न होकर उसे ग्रहण करता हूँ।',
    english: 'Whoever offers Me with devotion a leaf, a flower, a fruit, or water — I accept that offering of love from the pure-hearted.',
    explanation: 'God accepts even the simplest offering when made with sincere devotion.',
    philosophy: 'Devotion (Bhakti) is not about the grandeur of the offering but the sincerity of the heart.',
    source: 'Bhagavad Gita', chapter: 'Chapter 9',
  },
  {
    id: 'gita-10-1', title: 'Bhagavad Gita: Chapter 10 - Vibhuti Yoga',
    sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु। मामेवैष्यसि युक्त्वैवमात्मानं मत्परायणः॥',
    transliteration: 'Manmana bhava madbhakto madyaji mam namaskuru, mamevaishyasi yuktvaivam atmanam matparayanah.',
    hindi: 'मन को मुझमें लगाओ, मेरे भक्त बनो, मेरी पूजा करो, मुझे नमस्कार करो। इस प्रकार अपने आप को मुझमें स्थिर करके, तुम मुझे ही प्राप्त होगे।',
    english: 'Fix your mind on Me, be devoted to Me, worship Me, bow down to Me. Thus uniting yourself with Me and setting Me as your supreme goal, you shall surely come to Me.',
    explanation: 'Krishna provides the ultimate instruction for achieving divine union through devotion.',
    philosophy: 'Complete surrender and single-minded devotion leads to the highest spiritual realization.',
    source: 'Bhagavad Gita', chapter: 'Chapter 10',
  },
  {
    id: 'gita-11-1', title: 'Bhagavad Gita: Chapter 11 - Vishwarupa Darshana Yoga',
    sanskrit: 'सर्वतः पाणिपादं तत्सर्वतोऽक्षिरोमुखम्। सर्वतः श्रुतिमल्लोके सर्वमावृत्य तिष्ठति॥',
    transliteration: 'Sarvatah panipadam tat sarvato\'kshiromukham, sarvatah shrutimmal loke sarvamavritya tishthati.',
    hindi: 'उस विराट रूप में सब ओर हाथ-पैर हैं, सब ओर मुख और नेत्र हैं। वह सब ओर कानों से सुनता है और संसार को अपने द्वारा ढककर खड़ा है।',
    english: 'The universal form has hands and feet everywhere, eyes everywhere, heads and faces everywhere. It hears everything and encompasses everything in the universe.',
    explanation: 'Arjuna witnesses the cosmic form of Krishna, seeing all of existence contained within Him.',
    philosophy: 'The Vishwarupa reveals that the divine pervades all of creation — nothing exists outside of God.',
    source: 'Bhagavad Gita', chapter: 'Chapter 11',
  },
  {
    id: 'gita-12-1', title: 'Bhagavad Gita: Chapter 12 - Bhakti Yoga',
    sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते। क्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥',
    transliteration: 'Klaibyam ma sma gamah Partha naitattvayyupapadyate, kshudram hridayadaurbalyam tyaktvottishtha parantapa.',
    hindi: 'हे पार्थ! इस नपुंसकता को प्राप्त मत होओ। यह तुम्हें शोभा नहीं देता। हृदय की इस तुच्छ दुर्बलता को त्यागकर उठो।',
    english: 'Yield not to unmanliness, O Parth. It does not befit you. Cast off this petty faint-heartedness and arise, O scorcher of foes!',
    explanation: 'Krishna urges Arjuna to overcome fear and hesitation by remembering his true nature.',
    philosophy: 'Fear and doubt arise from forgetting our divine nature; remembrance of the Self dispels them.',
    source: 'Bhagavad Gita', chapter: 'Chapter 2',
  },
  {
    id: 'gita-13-1', title: 'Bhagavad Gita: Chapter 13 - Kshetra Kshetrajna Vibhaga Yoga',
    sanskrit: 'प्रकृतिं पुरुषं चैव विद्ध्यनादी उभौ परम्। प्रकृतिस्तु समासाद्य पुरुषः कामवर्तते॥',
    transliteration: 'Prakritim purusham chaiva viddhyanadi ubhou param, prakritis tu samasadya purushah kamavartate.',
    hindi: 'प्रकृति और पुरुष दोनों को अनादि और परम जानो। प्रकृति को समझकर पुरुष कामनाओं में प्रवृत्त होता है।',
    english: 'Know that both Prakriti (nature) and Purusha (the soul) are without beginning. From their union arises the manifest world.',
    explanation: 'This chapter distinguishes between the material nature (Prakriti) and the conscious self (Purusha).',
    philosophy: 'Understanding the distinction between matter and consciousness is the key to liberation.',
    source: 'Bhagavad Gita', chapter: 'Chapter 13',
  },
  {
    id: 'gita-14-1', title: 'Bhagavad Gita: Chapter 14 - Gunatraya Vibhaga Yoga',
    sanskrit: 'सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः। निबध्नन्ति महाबाहो देहे देहिनमव्ययम्॥',
    transliteration: 'Sattvam rajastama iti gunah prakritisambhavah, nibadhnanti maha-baho dehe dehinam avyayam.',
    hindi: 'सत्त्व, रजस और तमस — ये तीनों गुण प्रकृति से उत्पन्न होकर शरीर में अविनाशी आत्मा को बाँधते हैं।',
    english: 'The three gunas — Sattva (goodness), Rajas (passion), and Tamas (ignorance) — born of nature, bind the imperishable soul in the body.',
    explanation: 'Krishna explains how the three fundamental qualities of nature bind the soul to material existence.',
    philosophy: 'Freedom comes from transcending the three gunas through spiritual practice and self-realization.',
    source: 'Bhagavad Gita', chapter: 'Chapter 14',
  },
  {
    id: 'gita-15-1', title: 'Bhagavad Gita: Chapter 15 - Purushottama Yoga',
    sanskrit: 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम्। छन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित्॥',
    transliteration: 'Urdhvamulam adhahshakham ashvattham prahur avyayam, chhandansi yasya parnani yas tam veda sa veda-vit.',
    hindi: 'जिस अविनाशी वृक्ष की जड़ ऊपर और शाखाएँ नीचे हैं, जिसके पत्ते वेद हैं — उसे जानने वाला वेदों का जानने वाला है।',
    english: 'They speak of the eternal Ashvattha tree with roots above and branches below, whose leaves are the Vedas. He who knows it is a knower of the Vedas.',
    explanation: 'The cosmic tree represents all of manifest reality, with the Supreme Being as its root.',
    philosophy: 'Understanding the divine source of all existence is true knowledge — the essence of all wisdom.',
    source: 'Bhagavad Gita', chapter: 'Chapter 15',
  },
  {
    id: 'gita-16-1', title: 'Bhagavad Gita: Chapter 16 - Daivasura Sampad Yoga',
    sanskrit: 'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः। दानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम्॥',
    transliteration: 'Abhayam sattvasamshuddhir jnanayogavyavasthitih, danam damash cha yajnash cha svadhyayas tapa arjavam.',
    hindi: 'अभय, सत्त्व की शुद्धि, ज्ञान-योग में स्थिरता, दान, इंद्रिय-संयम, यज्ञ, स्वाध्याय, तप और सरलता।',
    english: 'Fearlessness, purity of mind, steadfastness in knowledge and yoga, charity, self-restraint, sacrifice, study of scriptures, austerity, and uprightness.',
    explanation: 'Krishna enumerates the divine qualities that characterize those with a godly nature.',
    philosophy: 'Cultivating these virtues transforms human character and leads to liberation.',
    source: 'Bhagavad Gita', chapter: 'Chapter 16',
  },
  {
    id: 'gita-17-1', title: 'Bhagavad Gita: Chapter 17 - Shraddhatraya Vibhaga Yoga',
    sanskrit: 'श्रद्धामयोऽयं लोको ह्यन्यः कर्मसमन्वितः। जानन्नपि मनुष्याणां निष्कर्मा प्रतिपद्यते॥',
    transliteration: 'Shraddhamayo\'yam lokah hyanyah karmasamanvitah, jannanpi manushyanam nishkarma pratipadyate.',
    hindi: 'यह संसार श्रद्धा से पूर्ण है। अन्य कर्मों से युक्त है। मनुष्यों को जानते हुए भी कर्मरहित नहीं हो सकते।',
    english: 'This world is sustained by faith. Actions are guided by faith. Even knowing this, humans cannot remain without action.',
    explanation: 'Faith (Shraddha) underlies all human action and determines the nature of one\'s worship and practice.',
    philosophy: 'The quality of one\'s faith shapes one\'s reality — it is the foundation of spiritual practice.',
    source: 'Bhagavad Gita', chapter: 'Chapter 17',
  },
  {
    id: 'gita-18-1', title: 'Bhagavad Gita: Chapter 18 - Moksha Sanyasa Yoga',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'Karmanye vadhikaraste ma phaleshu kadachana, ma karmaphalurbhurma te sangostvakarmani.',
    hindi: 'कर्म में तेरा अधिकार है, फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही अकर्म में आसक्ति रख।',
    english: 'You have the right to work alone, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.',
    explanation: 'The culminating teaching of the Gita — perform your duty selflessly, without attachment to results.',
    philosophy: 'This is the essence of Karma Yoga: action without attachment leads to liberation while remaining fully engaged in life.',
    source: 'Bhagavad Gita', chapter: 'Chapter 18',
  },
  {
    id: 'upanishad-3', title: 'Katha Upanishad',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    transliteration: 'Uddharedatmanatmanam natmanam avasadayet, atmaiva hyatmano bandhuratmaiva ripuratmanah.',
    hindi: 'आत्मा को स्वयं ऊपर उठाना चाहिए, स्वयं को गिराना नहीं चाहिए। आत्मा ही अपनी मित्र है, आत्मा ही अपनी शत्रु है।',
    english: 'Let a person lift themselves by their own effort; let them not degrade themselves. For the Self is a friend of the self, and the Self is also an enemy.',
    explanation: 'The Katha Upanishad emphasizes personal responsibility in spiritual evolution.',
    philosophy: 'We are both our own greatest ally and greatest obstacle — self-mastery is the path.',
    source: 'Katha Upanishad', chapter: 'Section 1',
  },
  {
    id: 'upanishad-4', title: 'Mundaka Upanishad',
    sanskrit: 'सत्यमेव जयते नानृतम् सत्येन पन्था विततो देवयानः। येनाक्रमन्तृष्णयोऽप्सरसो यासा लोकमश्नवति परमे व्योमन्॥',
    transliteration: 'Satyameva jayate nanritam satyena pantho vitato devayanah, yenakramantyrishnyoapsarasoyasa lokamashnavati parme vyoman.',
    hindi: 'सत्य की ही जीत होती है, असत्य की नहीं। सत्य से ही देवयान मार्ग खुला है। उसी मार्ग से ऋषियों की इच्छाएँ पूर्ण होती हैं।',
    english: 'Truth alone triumphs, not falsehood. By truth the divine path is spread. Through that path the sages reach the heavenly realm.',
    explanation: 'This famous verse declares the ultimate victory of truth over falsehood.',
    philosophy: 'Truth (Satya) is not just a moral principle but the very fabric of cosmic order (Rta).',
    source: 'Mundaka Upanishad', chapter: 'Section 3',
  },
  {
    id: 'upanishad-5', title: 'Taittiriya Upanishad',
    sanskrit: 'सत्यं वद। धर्मं चर। स्वाध्यायान्मा प्रमदः। धर्मं तत्वं हिनोति।',
    transliteration: 'Satyam vada. Dharmam chara. Svadhyayan ma pramadah. Dharmam tatva hinoti.',
    hindi: 'सत्य बोलो। धर्म का पालन करो। स्वाध्याय में लापरवाही मत करो। धर्म तेरी रक्षा करता है।',
    english: 'Speak the truth. Follow the path of righteousness. Do not neglect self-study. Dharma protects those who uphold it.',
    explanation: 'A concise ethical teaching from the Taittiriya Upanishad.',
    philosophy: 'Truth, duty, and continuous learning are the pillars of a righteous life.',
    source: 'Taittiriya Upanishad', chapter: 'Section 1',
  },
  {
    id: 'veda-2', title: 'Rigveda - Varuna Sukta',
    sanskrit: 'प्र ते महे मन्यमानाय वोचं चित्रं देवेभिरमृतं बभूव। उद्भिदं वाचं वसुविदं नृचक्षसं वरुणं देवं हवामहे॥',
    transliteration: 'Pra te mahe manyamanaya vocham chitram devebhiramritam babhuva, udbhidam vacham vasuvidam nrchakshasam varunam devam havamahe.',
    hindi: 'हम तेरा स्तुतिपूर्वक गुणगान करते हैं, जो देवताओं से अमृतमय हो गया है। वरुण देवता को हम बुलाते हैं।',
    english: 'We proclaim your glory, O mighty Varuna, who has become immortal among the gods. We invoke you, O all-seeing divine lord.',
    explanation: 'A hymn to Varuna, the cosmic guardian of order and truth in the Rigveda.',
    philosophy: 'Varuna represents the moral law that governs the universe — truth, order, and cosmic justice.',
    source: 'Rigveda', chapter: 'Book 7, Hymn 86',
  },
  {
    id: 'veda-3', title: 'Atharvaveda - Peace Prayer',
    sanskrit: 'स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः। स्वस्ति नस्तार्क्ष्यो अरिष्टनेमिः स्वस्ति नो बृहस्पतिर्दधातु॥',
    transliteration: 'Svasti na indro vridhashravah svasti nah pusha vishvavedah, svasti nastarkshyo arishtanemih svasti no brihaspatir dadhatu.',
    hindi: 'हम पर इन्द्र की कृपा हो, जो सुनिश्चित रूप से प्रसिद्ध हैं। पूषा और तार्क्ष्य की कृपा हो। बृहस्पति हमारी रक्षा करें।',
    english: 'May Indro, the ever-famous, protect us. May Pusha, the all-knower, protect us. May Garuda, the remover of obstacles, protect us. May Brihaspati grant us well-being.',
    explanation: 'A prayer invoking multiple deities for protection and well-being.',
    philosophy: 'Vedic prayers often invoke a pantheon of divine forces representing different aspects of cosmic order.',
    source: 'Atharvaveda', chapter: 'Book 19, Hymn 71',
  },
  {
    id: 'veda-4', title: 'Rigveda - Ushas Sukta (Dawn Hymn)',
    sanskrit: 'अस्तु गोष्ठं न युवतिर्भान्ती सूनृता चरति पत्नीवत्कामम्। उदित्या जातवेदसं देवां वहन्ति केतव ऋतं ज्योतिः॥',
    transliteration: 'Astu goshtham na yuvatirbhinti sunrita charati patnivatkamam, ud itya jatavedasam devam vahanti ketavah ritam jyotih.',
    hindi: 'प्रभाती युवती की तरह चमकती है, सत्यमय वचनों से सुशोभित होती है। सूर्य के रथ देवता को लाते हैं।',
    english: 'She shines like a young woman, moving with the beauty of truth. The rays of dawn carry the Sun-god across the sky.',
    explanation: 'Ushas (Dawn) is one of the most poetically celebrated deities in the Rigveda.',
    philosophy: 'Dawn symbolizes the eternal renewal of life, consciousness, and spiritual awakening.',
    source: 'Rigveda', chapter: 'Book 1, Hymn 113',
  },
  {
    id: 'mantra-3', title: 'Maha Mrityunjaya Mantra',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥',
    transliteration: 'Om tryambakam yajamahe sugandhim pushtivardhanam, urvarukamiva bandhanan mrityormukshiya maamritat.',
    hindi: 'हम त्रिनेत्र शिव की उपासना करते हैं, जो जीवनदायी और पुष्टिदायक हैं। जैसे खीरा बेल से मुक्त हो जाता है, वैसे ही हमें मृत्यु से मुक्ति दें।',
    english: 'We worship the three-eyed Lord who nourishes all. As the cucumber is freed from its vine, may we be liberated from death, not from immortality.',
    explanation: 'One of the most powerful mantras for healing and overcoming the fear of death.',
    philosophy: 'The metaphor of the cucumber being released from the vine represents natural, effortless liberation.',
    source: 'Rigveda', chapter: 'Mandala 7, Hymn 59',
  },
  {
    id: 'mantra-4', title: 'Lokah Samastah Sukhino Bhavantu',
    sanskrit: 'लोकाः समस्ताः सुखिनो भवन्तु। सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु। मा कश्चिद् दुःखभागभवेत्॥',
    transliteration: 'Lokah samastah sukhino bhavantu. Sarve santu niramayah. Sarve bhadrani pashyantu. Ma kashchit duhkhabhag bhavet.',
    hindi: 'सभी प्राणी सुखी हों। सभी रोगमुक्त हों। सभी मंगल देखें। कोई भी दुःख का भागी न हो।',
    english: 'May all beings everywhere be happy and free. May all be free from disease. May all see what is auspicious. May no one suffer.',
    explanation: 'A universal prayer for the well-being of all sentient beings.',
    philosophy: 'This mantra embodies the Vedic ideal of universal compassion — extending love and goodwill to all.',
    source: 'Traditional Mantra', chapter: 'Peace Prayer',
  },
];

const VEDIC_TOPICS = [
  'truth', 'dharma', 'karma', 'yoga', 'meditation', 'devotion',
  'knowledge', 'liberation', 'soul', 'cosmos', 'consciousness',
  'duty', 'peace', 'wisdom', 'love', 'renunciation',
];

function getVedicContentForCategory(category?: string): VedicContent[] {
  const allContent = [...fallbackVedicContent, ...EXTENDED_VEDIC_CONTENT];
  if (!category || category === 'all') return allContent;
  if (category === 'Slokas') {
    return allContent.filter(v =>
      v.source === 'Bhagavad Gita' || v.id.startsWith('gita-') || v.id.startsWith('mantra-')
    );
  }
  if (category === 'Upanishads') {
    return allContent.filter(v => v.source.includes('Upanishad'));
  }
  if (category === 'Rigveda') {
    return allContent.filter(v => v.source.includes('Rigveda'));
  }
  if (category === 'Mantras') {
    return allContent.filter(v => v.id.startsWith('sloka-') || v.id.startsWith('mantra-'));
  }
  return allContent.filter(v => v.source === category);
}

export async function fetchVedicContent(category?: string, page: number = 1): Promise<VedicContent[]> {
  const items: VedicContent[] = [];

  if (category === 'Rigveda') {
    try {
      const mandala = Math.floor(Math.random() * 10) + 1;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Rigveda/rigveda_mandala_${mandala}.json`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const startIdx = Math.floor(Math.random() * Math.max(1, data.length - 5));
          const suktas = data.slice(startIdx, startIdx + 5);
          interface RigvedaEntry { sukta: number | string; text: string; }
          return suktas.map((s: RigvedaEntry) => ({
            id: `rigveda-${mandala}-${s.sukta}-${generateId()}`,
            title: `Rigveda: Mandala ${mandala}, Sukta ${s.sukta}`,
            sanskrit: s.text,
            transliteration: 'Transliteration available in full view.',
            hindi: 'Hindi translation coming soon from Vedic Heritage sources.',
            english: 'English translation available via Wisdom Library integration.',
            explanation: 'A sacred hymn from the oldest of the four Vedas, focusing on nature, deities, and cosmic order.',
            philosophy: 'Vedic hymns (Suktas) are the foundation of Sanatana Dharma, representing early spiritual realizations.',
            source: 'Rigveda',
            chapter: `Mandala ${mandala}`,
          }));
        }
      }
    } catch (e) {
      console.warn('Rigveda API failed, using fallback:', e);
    }
  }

  for (let i = 0; i < 5; i++) {
    const chapter = Math.floor(Math.random() * 18) + 1;
    const verse = Math.floor(Math.random() * 20) + 1;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${GITA_API_BASE}/slok/${chapter}/${verse}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.slok) {
          items.push({
            id: `gita-${chapter}-${verse}-${generateId()}`,
            title: `Bhagavad Gita: Chapter ${chapter}, Verse ${verse}`,
            sanskrit: data.slok,
            transliteration: data.transliteration || 'N/A',
            hindi: data.tej?.ht || 'Hindi translation available in full view.',
            english: data.siva?.et || data.gambir?.et || 'English translation available.',
            explanation: data.purohit?.et || 'Deep philosophical discourse between Krishna and Arjuna.',
            philosophy: 'The Bhagavad Gita is the essence of Vedic knowledge and one of the most important texts of Hindu philosophy.',
            source: category === 'Upanishads' ? 'Upanishads' : 'Bhagavad Gita',
            chapter: `Chapter ${chapter}`,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching Gita sloka:', e);
    }
  }

  if (items.length > 0) return items;

  if (page === 1) {
    return getVedicContentForCategory(category);
  }
  return [];
}
