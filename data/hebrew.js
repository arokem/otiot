/**
 * Hebrew letters + nikud data for Otiot flashcards.
 *
 * Letter scope (MVP): 22 base letters (Aleph–Tav) + 5 final forms.
 * Nikud scope: practical teaching set (common vowels + shin/sin dots + dagesh).
 *   This is not an exhaustive enumeration of every Unicode niqqud codepoint,
 *   but covers the marks most used for recognition/pronunciation practice.
 */
(function () {
  /** @type {{id:string,char:string,label:string,kind:'base'|'final',baseId?:string}[]} */
  const lettersBase = [
    { id: 'aleph', char: 'א', label: 'Aleph', kind: 'base' },
    { id: 'bet', char: 'ב', label: 'Bet', kind: 'base' },
    { id: 'gimel', char: 'ג', label: 'Gimel', kind: 'base' },
    { id: 'dalet', char: 'ד', label: 'Dalet', kind: 'base' },
    { id: 'he', char: 'ה', label: 'He', kind: 'base' },
    { id: 'vav', char: 'ו', label: 'Vav', kind: 'base' },
    { id: 'zayin', char: 'ז', label: 'Zayin', kind: 'base' },
    { id: 'het', char: 'ח', label: 'Het', kind: 'base' },
    { id: 'tet', char: 'ט', label: 'Tet', kind: 'base' },
    { id: 'yod', char: 'י', label: 'Yod', kind: 'base' },
    { id: 'kaf', char: 'כ', label: 'Kaf', kind: 'base' },
    { id: 'lamed', char: 'ל', label: 'Lamed', kind: 'base' },
    { id: 'mem', char: 'מ', label: 'Mem', kind: 'base' },
    { id: 'nun', char: 'נ', label: 'Nun', kind: 'base' },
    { id: 'samekh', char: 'ס', label: 'Samekh', kind: 'base' },
    { id: 'ayin', char: 'ע', label: 'Ayin', kind: 'base' },
    { id: 'pe', char: 'פ', label: 'Pe', kind: 'base' },
    { id: 'tsadi', char: 'צ', label: 'Tsadi', kind: 'base' },
    { id: 'qof', char: 'ק', label: 'Qof', kind: 'base' },
    { id: 'resh', char: 'ר', label: 'Resh', kind: 'base' },
    { id: 'shin', char: 'ש', label: 'Shin', kind: 'base' },
    { id: 'tav', char: 'ת', label: 'Tav', kind: 'base' },
  ];

  /** @type {{id:string,char:string,label:string,kind:'final',baseId:string}[]} */
  const finalForms = [
    { id: 'kaf_final', char: 'ך', label: 'Kaf (sofit)', kind: 'final', baseId: 'kaf' },
    { id: 'mem_final', char: 'ם', label: 'Mem (sofit)', kind: 'final', baseId: 'mem' },
    { id: 'nun_final', char: 'ן', label: 'Nun (sofit)', kind: 'final', baseId: 'nun' },
    { id: 'pe_final', char: 'ף', label: 'Pe (sofit)', kind: 'final', baseId: 'pe' },
    { id: 'tsadi_final', char: 'ץ', label: 'Tsadi (sofit)', kind: 'final', baseId: 'tsadi' },
  ];

  /** All letter forms used for card generation */
  const letterForms = [...lettersBase, ...finalForms];

  /**
   * Niqqud marks (teaching set).
   * symbol is the combining/standalone mark character as used after a base letter in display strings.
   */
  const nikudMarks = [
    { id: 'patach', symbol: 'ַ', name: 'Patach' },
    { id: 'kamatz', symbol: 'ָ', name: 'Kamatz' },
    { id: 'segol', symbol: 'ֶ', name: 'Segol' },
    { id: 'tzere', symbol: 'ֵ', name: 'Tzere' },
    { id: 'hiriq', symbol: 'ִ', name: 'Hiriq' },
    { id: 'cholam', symbol: 'ֹ', name: 'Cholam' },
    { id: 'kubutz', symbol: 'ֻ', name: 'Kubutz' },
    { id: 'shuruk_note', symbol: 'וּ', name: 'Shuruk (וּ)', composite: true },
    { id: 'sheva', symbol: 'ְ', name: 'Sheva' },
    { id: 'chataf_patach', symbol: 'ֲ', name: 'Chataf Patach' },
    { id: 'chataf_kamatz', symbol: 'ֳ', name: 'Chataf Kamatz' },
    { id: 'chataf_segol', symbol: 'ֱ', name: 'Chataf Segol' },
    { id: 'dagesh', symbol: 'ּ', name: 'Dagesh / Mapiq' },
    { id: 'shin_dot', symbol: 'ׁ', name: 'Shin dot' },
    { id: 'sin_dot', symbol: 'ׂ', name: 'Sin dot' },
  ];

  /** @type {{id:string,mode:'letters'|'nikud',display:string,speakText:string,label:string,baseChar:string,nikudId?:string,nikudName?:string}[]} */
  const cards = [];

  // Letters-only cards
  for (const lf of letterForms) {
    cards.push({
      id: `letters_${lf.id}`,
      mode: 'letters',
      display: lf.char,
      speakText: lf.char,
      label: lf.label,
      baseChar: lf.char,
    });
  }

  // Letters + nikud cards (all forms × all marks in set)
  for (const lf of letterForms) {
    for (const nk of nikudMarks) {
      const display = lf.char + nk.symbol;
      cards.push({
        id: `nikud_${lf.id}_${nk.id}`,
        mode: 'nikud',
        display,
        speakText: display,
        label: `${lf.label} + ${nk.name}`,
        baseChar: lf.char,
        nikudId: nk.id,
        nikudName: nk.name,
      });
    }
  }

  window.HEBREW_DATA = {
    lettersBase,
    finalForms,
    letterForms,
    nikudMarks,
    cards,
  };
})();
