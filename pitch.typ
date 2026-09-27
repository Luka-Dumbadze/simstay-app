#set page(
  paper: "a4",
  margin: (x: 1.8cm, top: 2.2cm, bottom: 2.2cm),
  header: align(right, text(size: 8pt, fill: rgb("#64748b"))[
    *SIMUSTAY* | 3-წუთიანი საპრეზენტაციო პიტჩი & სლაიდების შპარგალკა
  ]),
  footer: context {
    let cur = counter(page).display()
    let tot = counter(page).final().first()
    align(center, text(size: 8pt, fill: rgb("#94a3b8"))[
      გვერდი #cur / #tot
    ])
  },
)

#set text(
  font: ("FiraGO", "Noto Sans", "Sylfaen", "DejaVu Sans"),
  lang: "ka",
  size: 9.2pt,
  spacing: 125%,
)

#set par(justify: true, leading: 0.65em)
#show raw: set text(font: ("Fira Code", "Cascadia Code", "DejaVu Sans Mono", "Consolas"), size: 8.2pt)

// ჰედერი და სათაური
#align(center)[
  #box(
    fill: rgb("#dc2626").lighten(88%),
    stroke: 0.5pt + rgb("#dc2626"),
    radius: 3pt,
    inset: (x: 8pt, y: 3pt),
    text(size: 8pt, weight: "bold", fill: rgb("#b91c1c"))[LIVE STAGE SCRIPT • 3-MINUTE PITCH],
  )
  #v(3pt)
  #text(size: 16pt, weight: "bold", fill: rgb("#0f172a"))[
    SimuStay: Word-for-Word საპრეზენტაციო გამოსვლა
  ] \
  #v(1pt)
  #text(size: 9.5pt, fill: rgb("#475569"))[
    KIU • ვეკუა-კომაროვი • GITA Startup Summer School-ის გაერთიანებული გუნდი
  ]
]

#v(4pt)

// გუნდის ემოციური ნარატივის ბარათი
#rect(
  width: 100%,
  fill: rgb("#f0fdf4"),
  stroke: (left: 3.5pt + rgb("#16a34a")),
  radius: (right: 4pt),
  inset: (x: 10pt, y: 7pt),
)[
  #text(weight: "bold", fill: rgb("#166534"))[გუნდის უძლიერესი ისტორია (ჟიურის ფავორიტი ნარატივი):] \
  KIU-ს სტუდენტები, ვეკუა-კომაროვის ყოფილი კონკურენტები და GITA Startup Summer School-ის მოწინააღმდეგე გუნდები, რომლებიც დღეს ერთად დგანან რეალური სტარტაპის შესაქმნელად. ეს არის ის, რაც GITA-ს ჟიურის პირდაპირ გულში ხვდება!
]

#v(4pt)

// სცენის 2 დაზღვევა
#rect(
  width: 100%,
  fill: rgb("#fffbeb"),
  stroke: (left: 3.5pt + rgb("#f59e0b")),
  radius: (right: 4pt),
  inset: (x: 10pt, y: 7pt),
)[
  #text(weight: "bold", fill: rgb("#92400e"))[⚠️ 2 მცირე დაზღვევა სცენისთვის (იურიდიული დაცვა):]
  + *Opera V5-სა და Cloud-ზე:* არ თქვათ _„ორაკლ ოპერას კლონი გავაკეთეთ“_. თქვით: _„შევქმენით სიმულატორი, რომელიც 100%-ით იმეორებს როგორც Opera Cloud-ის, ისე V5-ის საოპერაციო ლოგიკას, ფოლიოს გაყოფას და სამუშაო გარემოს — საავტორო უფლებების სრული დაცვით.“_
  + *პირველი თვის გადასახადზე:* თქვით, რომ თანხა იყოფა *ორ ეტაპად (50% გასვლისას, 50% — 30 დღის შემდეგ)*, რაც სასტუმროს აძლევს 100%-იან გარანტიას და რეკრუტერებზე 2-ჯერ იაფია.
]

#v(4pt)
#line(length: 100%, stroke: 0.5pt + rgb("#e2e8f0"))

== 🎙️ საბოლოო 3-წუთიანი საპრეზენტაციო ტექსტი (Word-for-Word Pitch)

#align(center)[
  #text(size: 8.3pt, style: "italic", fill: rgb("#64748b"))[
    (სპიკერი საუბრობს თავდაჯერებულად, ენერგიულად, იყენებს ხელის ჟესტებს და ტაიმინგს მიჰყვება წამობრივად)
  ]
]

#v(2pt)

// ბლოკი 1
#rect(width: 100%, fill: rgb("#ffffff"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 9pt)[
  #grid(
    columns: (auto, 1fr, auto),
    gutter: 8pt,
    align: horizon,
    [#box(fill: rgb("#0284c7"), inset: (x: 6pt, y: 2.5pt), radius: 3pt, text(
      fill: white,
      weight: "bold",
      size: 8pt,
    )[0:00 – 0:40])],
    [#text(weight: "bold", size: 9.5pt, fill: rgb("#0f172a"))[პრობლემა და მენეჯერის ტკივილი]],
    [#box(fill: rgb("#f1f5f9"), stroke: 0.5pt + rgb("#cbd5e1"), inset: (x: 5pt, y: 2.5pt), radius: 3pt, text(
      size: 7.5pt,
      fill: rgb("#475569"),
      weight: "bold",
    )[კრიტერიუმი 1 • 5 ქულა])],
  )
  #v(2pt)
  #line(length: 100%, stroke: 0.5pt + rgb("#f1f5f9"))
  #v(2pt)
  „მოგესალმებით. სასტუმროებს მუდმივად სჭირდებათ ახალი კადრების დასაქმება, მითუმეტეს ზაფხულისა და ზამთრის პიკურ სეზონებზე.

  ჩვენმა კვლევამ აჩვენა, რომ გამოცდილი კადრის პოვნა ყველაზე მეტად ჭირს *Front Desk-ზე*. რატომ? იმიტომ, რომ Oracle Opera-ში, Cloudbeds-ში თუ სხვა რთულ სისტემებში მუშაობა წინასწარ თითქმის არავინ იცის!

  კვლევების მიხედვით, Front Desk-ის თანამშრომლების 80%-ზე მეტი არის *18-დან 25 წლამდე ახალგაზრდა*. მათთვის ეს ძირითადად *პირველი სამუშაოა*. როცა ახალბედა პირველ დღეს ჯდება ცოცხალ რეჟიმში, მის წინ დგას რიგი და უკან ადგას მენეჯერი — სტრესი და შფოთვა იმდენად მაღალია, რომ ინფორმაციის ათვისება ეცემა ნულამდე.

  შედეგად, სასტუმროს უფროსი მენეჯერი თითოეული ახალბედის მომზადებაზე ხარჯავს:
  - *82 საათს პირად დროს!*
  - *1,500-დან 2,700 ლარამდე ფინანსებს* (გაფუჭებულ ინვოისებსა და ზეგანაკვეთურ შრომაში);
  - და უზარმაზარ ენერგიას. \
  ხოლო სეზონის ბოლოს ეს კადრი მიდის და იწყება იგივე ციკლური კოშმარი.“
]

#v(4pt)

// ბლოკი 2
#rect(width: 100%, fill: rgb("#ffffff"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 9pt)[
  #grid(
    columns: (auto, 1fr, auto),
    gutter: 8pt,
    align: horizon,
    [#box(fill: rgb("#0284c7"), inset: (x: 6pt, y: 2.5pt), radius: 3pt, text(
      fill: white,
      weight: "bold",
      size: 8pt,
    )[0:40 – 1:20])],
    [#text(weight: "bold", size: 9.5pt, fill: rgb("#0f172a"))[გამოსავალი: SimSTAY და როგორ მუშაობს]],
    [#box(fill: rgb("#f1f5f9"), stroke: 0.5pt + rgb("#cbd5e1"), inset: (x: 5pt, y: 2.5pt), radius: 3pt, text(
      size: 7.5pt,
      fill: rgb("#475569"),
      weight: "bold",
    )[კრიტერიუმი 2 • 5 ქულა])],
  )
  #v(2pt)
  #line(length: 100%, stroke: 0.5pt + rgb("#f1f5f9"))
  #v(2pt)
  „წარმოიდგინეთ ციფრული გარემო, რომელიც ნებისმიერ სასტუმროს სისტემას გარდაქმნის ინტერაქტიულ სიმულაციად. *გაიცანით SimSTAY!*

  ჩვენ ვქმნით სავარჯიშო გარემოს, რომელიც ზუსტად იმეორებს სასტუმროს რეალურ ოპერაციულ სამუშაო მაგიდას. სტუდენტი რეალურ სამსახურში მისვლამდე გადის სრულ სიმულაციას.

  სისტემაში უკვე ჩაშენებულია ორი ყველაზე პოპულარული სისტემის საოპერაციო ლოგიკა: *Oracle Opera Cloud-ი და Opera V5*, რომლის გადართვაც ერთი ღილაკით ხდება. ასევე ინტეგრირებულია *WhatsApp-ი და Telegram-ი*, რადგან რეალური სასტუმრო სწორედ ამ არხებით ურთიერთობს პერსონალთან.

  *სამუშაო ნაკადი უმარტივესია:* WhatsApp-ზე ან Telegram-ზე შემოგდის ტასკი და ამ ტასკს აგვარებ ოპერაციულ სისტემაში. შიგნით კი ჩაშენებულია *ინტელექტუალური ავტოპილოტი*: თუ ვარჯიშისას რამეს არასწორად აკეთებ — ავტოპილოტი მომენტალურად გაჩერებს, გისწორებს შეცდომას და გაჩვენებს, როგორ გააკეთო სწორად.“
]

#pagebreak()

// ბლოკი 3
#rect(width: 100%, fill: rgb("#ffffff"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 9pt)[
  #grid(
    columns: (auto, 1fr, auto),
    gutter: 8pt,
    align: horizon,
    [#box(fill: rgb("#16a34a"), inset: (x: 6pt, y: 2.5pt), radius: 3pt, text(
      fill: white,
      weight: "bold",
      size: 8pt,
    )[1:20 – 2:00])],
    [#text(weight: "bold", size: 9.5pt, fill: rgb("#0f172a"))[ცოცხალი დემო (Live Desktop)]],
    [#box(fill: rgb("#dcfce7"), stroke: 0.5pt + rgb("#16a34a"), inset: (x: 5pt, y: 2.5pt), radius: 3pt, text(
      size: 7.5pt,
      fill: rgb("#166534"),
      weight: "bold",
    )[კრიტერიუმი 5 • 10 ქულა!])],
  )
  #v(2pt)
  #text(size: 8.2pt, style: "italic", fill: rgb("#64748b"))[(ეკრანზე ჩანს თქვენი SimStay OS-ის ცოცხალი დესკტოპი)]
  #v(2pt)
  #line(length: 100%, stroke: 0.5pt + rgb("#f1f5f9"))
  #v(2pt)
  „სიტყვების ნაცვლად — გაჩვენებთ რეალურ, მომუშავე სისტემას.

  ეკრანზე ხედავთ *SimStay OS-ს*:
  1. მარცხნივ შემოდის სტუმრის შეტყობინება WhatsApp-ში: _„ოთახს კომპანია იხდის, მინიბარი ჩემზეა“_.
  2. სტუდენტი აკეთებს Check-in-ს და ფოლიოს გაყოფას Opera-ს დაფაზე.
  3. თუ სტუდენტი შეცდომით მინიბარსაც კომპანიას დააწერს — *ავტოპილოტი მომენტალურად ბლოკავს ოპერაციას და აჩვენებს სასტუმროს კონკრეტულ წესს!*
  4. სტუდენტი ასწორებს შეცდომას, აჭერს Check-out-ს $arrow.r$ მობილურზე დამლაგებელს წამში მოსდის დავალება $arrow.r$ ოთახი დალაგდა $arrow.r$ PMS-ის დაფაზე სტატუსი მყისიერად ხდება მწვანე!

  მასალის გავლის შემდეგ, მონაწილეები აბარებენ თეორიულ და პრაქტიკულ გამოცდას, რის მიხედვითაც იქმნება *რეიტინგული ბაზა* და სასტუმრო იღებს საუკეთესო, შემოწმებულ კადრებს.“
]

#v(4pt)

// ბლოკი 4
#rect(width: 100%, fill: rgb("#ffffff"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 9pt)[
  #grid(
    columns: (auto, 1fr, auto),
    gutter: 8pt,
    align: horizon,
    [#box(fill: rgb("#0284c7"), inset: (x: 6pt, y: 2.5pt), radius: 3pt, text(
      fill: white,
      weight: "bold",
      size: 8pt,
    )[2:00 – 2:35])],
    [#text(weight: "bold", size: 9.5pt, fill: rgb("#0f172a"))[ბიზნეს მოდელი და ეკონომიკა]],
    [#box(fill: rgb("#f1f5f9"), stroke: 0.5pt + rgb("#cbd5e1"), inset: (x: 5pt, y: 2.5pt), radius: 3pt, text(
      size: 7.5pt,
      fill: rgb("#475569"),
      weight: "bold",
    )[კრიტერიუმი 3 • 5 ქულა])],
  )
  #v(2pt)
  #line(length: 100%, stroke: 0.5pt + rgb("#f1f5f9"))
  #v(2pt)
  „ჩვენი ბიზნეს მოდელი რევოლუციურია: ჩვენ ადამიანებს *სრულიად უფასოდ გადავამზადებთ*, ხოლო სასტუმროს ვაწვდით 100%-ით მომზადებული კადრების ბაზას.

  *როგორ ვშოულობთ ფულს?*
  სანაცვლოდ, სასტუმრო გვიხდის *დასაქმებული ადამიანის პირველი თვის ხელფასის ტოლ თანხას* (დაახლოებით 1,500–1,800 ლარს).
  რატომ უღირს ეს სასტუმროს? იმიტომ, რომ ჩვეულებრივი რეკრუტერი 2 თვის ხელფასს ითხოვს, მენეჯერი 82 საათს ხარჯავს და კადრი პირველ თვეში გარბის.
  SimSTAY-ს კადრმა პირველივე წუთიდან იცის თავისი საქმე, მოხსნილი აქვს შფოთვა და მისი წასვლა გამორიცხულია! ინვესტიციას სასტუმრო *პირველ 20 დღეში სრულად იბრუნებს!*“
]

#v(4pt)

// ბლოკი 5
#rect(width: 100%, fill: rgb("#ffffff"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 9pt)[
  #grid(
    columns: (auto, 1fr, auto),
    gutter: 8pt,
    align: horizon,
    [#box(fill: rgb("#7c3aed"), inset: (x: 6pt, y: 2.5pt), radius: 3pt, text(
      fill: white,
      weight: "bold",
      size: 8pt,
    )[2:35 – 3:00])],
    [#text(weight: "bold", size: 9.5pt, fill: rgb("#0f172a"))[გუნდი, ტრექშენი და გრანტი]],
    [#box(fill: rgb("#ede9fe"), stroke: 0.5pt + rgb("#7c3aed"), inset: (x: 5pt, y: 2.5pt), radius: 3pt, text(
      size: 7.5pt,
      fill: rgb("#6d28d9"),
      weight: "bold",
    )[კრიტერიუმები 4 & 6 • 10 ქულა])],
  )
  #v(2pt)
  #line(length: 100%, stroke: 0.5pt + rgb("#f1f5f9"))
  #v(2pt)
  „ვინ ვართ ჩვენ? ჩვენ ვართ *ქუთაისის საერთაშორისო უნივერსიტეტის (KIU)* სტუდენტები. წარსულში ვეკუა-კომაროვის ოლიმპიადებიდან ვეჯიბრებოდით ერთმანეთს, შემდეგ *GITA-ს Startup Summer School-ში* სამივე მოწინააღმდეგე გუნდებში ვიყავით, დღეს კი აქ წარმოგიდექით გაერთიანებულები!

  ჩვენი უსამართლო უპირატესობა ისაა, რომ უკვე ვესაუბრეთ ორ უდიდეს ქართულ რიზორთს — *ამბასადორი კაჭრეთსა და ბიოლის*, და ისინი *უკვე შევითანხმეთ SimSTAY-ს საპილოტე გატესტვაზე!*

  *რაში გამოვიყენებთ GITA-ს 10,000-ლარიან გრანტს?*
  - *3,500 ₾* — სერვერები და AI ტოკენები;
  - *2,500 ₾* — კახეთის სასტუმროებში საველე დანერგვა და პირდაპირი კომუნიკაცია;
  - *2,000 ₾* — იურიდიული ბაზა და მონაცემთა დაცვა;
  - *2,000 ₾* — მარკეტინგი და სტუდენტების მოზიდვა.

  SimSTAY აქრობს ციკლურ გადამზადებას და ქმნის პროფესიონალების ახალ თაობას. დიდი მადლობა!“
]

#pagebreak()

== 🖥️ სლაიდების მზა შპარგალკა (Slides Breakdown)

#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#0369a1"))[სლაიდი 1: Front Desk კრიზისი] \
      - 29,101 დასაქმებული | 80% ახალგაზრდა (18-25).
      - მაღალი შფოთვა პირველ სამუშაოზე.
      - *მენეჯერის დანაკარგი:* 82 სთ სწავლებაში | 1,800 ₾ ფინანსური ზარალი.
    ]
  ],
  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#0369a1"))[სლაიდი 2: გამოსავალი — SimSTAY] \
      - SimSTAY ლოგო და ბრენდინგი.
      - *მთავარი მესიჯი:* „ნებისმიერი PMS სისტემის გარდაქმნა სიმულაციად სამსახურში მისვლამდე“.
    ]
  ],

  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#0369a1"))[სლაიდი 3: როგორ მუშაობს (The Flow)] \
      - WhatsApp / Telegram ტასკი $arrow.r$
      - Opera Cloud / V5 ოპერაცია $arrow.r$
      - ინტელექტუალური ავტოპილოტის მყისიერი შესწორება.
    ]
  ],
  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#16a34a"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#166534"))[სლაიდი 4: LIVE DEMO (ეკრანის ჩვენება)] \
      - ცოცხალი Next.js სისტემა.
      - ამბასადორი კაჭრეთის ქეისი.
      - ფოლიოს გაყოფა და მობილური ჩაბარება.
    ]
  ],

  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#0369a1"))[სლაიდი 5: ბიზნეს მოდელი] \
      - *სტუდენტებს:* სრულიად უფასო გადამზადება.
      - *სასტუმროებს:* 1-ლი თვის ხელფასის 100% (გარანტირებული კადრი).
      - *Payback სასტუმროსთვის:* 20 დღე!
    ]
  ],
  [
    #rect(width: 100%, height: 100%, fill: rgb("#f8fafc"), stroke: 0.5pt + rgb("#cbd5e1"), radius: 4pt, inset: 7pt)[
      #text(weight: "bold", fill: rgb("#0369a1"))[სლაიდი 6: ტრექშენი & გრანტი (10,000 ₾)] \
      - *პილოტი შეთანხმებულია:* Ambassadori Kachreti & Bioli Wellness Resort!
      - *ბიუჯეტი:* 3.5k სერვერი/AI | 2.5k კახეთის პილოტი | 2k იურიდიული | 2k მარკეტინგი.
    ]
  ],
)

#v(4pt)

#rect(
  width: 100%,
  fill: rgb("#f8fafc"),
  stroke: 0.5pt + rgb("#7c3aed"),
  radius: 4pt,
  inset: 8pt,
)[
  #text(weight: "bold", fill: rgb("#6d28d9"))[სლაიდი 7: გუნდი — KIU, ვეკუა-კომაროვი, GITA Summer School] \
  დამფუძნებლების სამი ფოტო და წარწერა: *„ოლიმპიადების კონკურენტებიდან ერთიან სტარტაპ გუნდამდე“*.
]

#v(6pt)

// დასკვნითი სამოტივაციო ბლოკი
#rect(
  width: 100%,
  fill: rgb("#f0fdf4"),
  stroke: (left: 3.5pt + rgb("#16a34a")),
  inset: (x: 12pt, y: 9pt),
  radius: (right: 4pt),
)[
  #text(weight: "bold", fill: rgb("#166534"))[სპიკერის ბოლო შეხსენება:] \
  გაიარეთ ეს ტექსტი წამმზომით 2-ჯერ. თქვენ გაქვთ *იდეალური დრამატურგია, ცოცხალი ემოცია, რკინისებური ლოგიკა და ფანტასტიკური გუნდის ისტორია*. \
  _გადით სცენაზე და მოიგეთ! 🚀_
]
