const { v4: uuidv4 } = require('uuid')

module.exports = (courseId) => [
  {
    id: uuidv4(),
    no: 1,
    description:
        'Kursus ramah pemula untuk belajar pengembangan web dengan React JS tanpa perlu latar belakang IT.',
    courseId: courseId[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Fokus pada membangun pemahaman yang kuat tentang React JS bagi peserta tanpa pengalaman teknis.',
    courseId: courseId[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Merangsang kreativitas peserta untuk membangun antarmuka web yang menakjubkan menggunakan React JS.',
    courseId: courseId[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Kursus ini menginspirasi dan membimbing Anda untuk menjadi kreatif dalam seni desain antarmuka pengguna (UI) dan pengalaman pengguna (UX), membuka pintu ke dunia desain yang inovatif.',
    courseId: courseId[1].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Mengajak Anda mengeksplorasi dan mengaktualisasikan ekspresi kreativitas dalam desain UI/UX, memahami lebih dari sekadar estetika visual, tetapi juga aspek-aspek fungsional dan pengalaman pengguna secara keseluruhan.',
    courseId: courseId[1].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Melalui kursus ini, Anda akan belajar bagaimana menguasai seni desain yang menginspirasi, menciptakan pengalaman pengguna yang lebih dari sekadar menarik, tetapi juga memuaskan dan efektif.',
    courseId: courseId[1].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Kursus tingkat mahir untuk memahami dan menguasai pengembangan aplikasi Android menggunakan bahasa tingkat rendah Assembly x86.',
    courseId: courseId[2].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Fokus pada pembangunan aplikasi Android dengan tingkat efisiensi tinggi melalui penerapan bahasa assembly x86.',
    courseId: courseId[2].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Menawarkan pengalaman mendalam dalam menjelajahi dan menguasai bahasa tingkat rendah Assembly x86 untuk pengembangan aplikasi Android.',
    courseId: courseId[2].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Memahami dan mengimplementasikan Restful API dengan bahasa C memungkinkan pengoptimalan performa tinggi. Dengan mengendalikan sumber daya secara langsung, API yang dihasilkan cenderung lebih efisien dan responsif',
    courseId: courseId[3].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Bahasa C memberikan tingkat kontrol yang tinggi terhadap perangkat keras dan memori. Hal ini memungkinkan pengembang untuk secara langsung mengelola sumber daya dan mengoptimalkan kinerja API, menciptakan solusi yang lebih efisien.',
    courseId: courseId[3].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Menguasai pembuatan Restful API dengan bahasa C tidak hanya membuka pintu ke dunia API, tetapi juga meningkatkan pemahaman mendalam tentang manajemen memori, manipulasi byte, dan konsep-konsep tingkat rendah. Keahlian ini dapat menjadi landasan yang kuat untuk eksplorasi lebih lanjut dalam pengembangan perangkat lunak.',
    courseId: courseId[3].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Di course ini menawarkan pembelajaran intensif dalam waktu 24 jam, memungkinkan Anda untuk menguasai bahasa pemrograman Go (Golang) dengan cepat dan efisien.',
    courseId: courseId[4].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Setelah menyelesaikan kursus, Anda akan memiliki keterampilan mendalam dalam pengembangan back-end menggunakan Golang, membuka peluang untuk menciptakan aplikasi server yang tangguh dan andal.',
    courseId: courseId[4].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Mahir dalam Golang dalam waktu singkat dapat meningkatkan nilai dan daya saing Anda di pasar kerja, memberikan peluang baru dalam pengembangan perangkat lunak berbasis server.',
    courseId: courseId[4].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Merupakan petualangan kode seru untuk menjelajahi dan memahami Android Studio, alat utama dalam pengembangan aplikasi Android.',
    courseId: courseId[5].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Mengajak Anda memahami konsep-konsep dasar pengembangan aplikasi Android, memungkinkan Anda untuk membuat aplikasi yang sesuai dengan standar industri.',
    courseId: courseId[5].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Kursus ini memberikan pengalaman praktis langsung, membantu Anda menghadapi tantangan dunia nyata dalam pengembangan aplikasi mobile dengan Android Studio.',
    courseId: courseId[5].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Anda akan berada dalam sebuah perjalanan pengembangan kreativitas yang membawa Anda untuk benar-benar menguasai seni desain antarmuka pengguna (UI) dan pengalaman pengguna (UX), lebih dari sekadar memahami warna dan bentuk.',
    courseId: courseId[6].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Course ini membuka pintu ke kreativitas tanpa batas dalam desain, memberikan wawasan mendalam tentang bagaimana merancang pengalaman yang menarik dan fungsional untuk pengguna.',
    courseId: courseId[6].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Selain fokus pada warna dan bentuk, Anda akan diajak untuk mengeksplorasi aspek-aspek mendalam dalam desain UI/UX, termasuk strategi interaksi, arsitektur informasi, dan pemahaman mendalam tentang pengguna.',
    courseId: courseId[6].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Sebuah panduan lengkap untuk mengelola produk dengan bijak, membimbing Anda melalui konsep-konsep inti dan praktik terbaik dalam dunia Product Management.',
    courseId: courseId[7].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Memberikan wawasan mendalam tentang strategi produktif yang membantu Anda mengambil keputusan yang tepat, merencanakan pengembangan produk, dan meningkatkan kinerja produk secara keseluruhan.',
    courseId: courseId[7].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Melalui kursus ini, Anda akan mengembangkan keahlian manajemen produk yang diperlukan untuk sukses dalam lingkungan bisnis yang kompetitif, dari perencanaan hingga peluncuran dan iterasi produk.',
    courseId: courseId[7].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Melibatkan Anda dalam perjalanan seru untuk memahami dan menguasai dunia pengembangan aplikasi iOS menggunakan bahasa pemrograman Swift.',
    courseId: courseId[8].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Kursus ini tidak hanya mengajarkan teknis pengembangan aplikasi iOS, tetapi juga merancang pengalaman yang memikat bagi pengguna, menciptakan aplikasi yang benar-benar menarik.',
    courseId: courseId[8].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Memberikan fondasi yang kuat dalam penggunaan bahasa Swift, memungkinkan Anda untuk membangun aplikasi iOS yang inovatif dan responsif dengan keahlian yang mengesankan.',
    courseId: courseId[8].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: uuidv4(),
    no: 1,
    description:
        'Membimbing Anda melalui petualangan lengkap dalam dunia Data Science, dari konsep dasar hingga tingkat lanjut, memberikan pemahaman menyeluruh tentang analisis dan pengelolaan data.',
    courseId: courseId[9].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Kursus ini mengajak Anda untuk mengeksplorasi dunia data dari awal hingga akhir, melibatkan Anda dalam teknik analisis data, visualisasi, dan pemahaman mendalam tentang tren dan pola.',
    courseId: courseId[9].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Melalui petualangan ini, Anda akan mengembangkan keahlian menyeluruh dalam Data Science, memungkinkan Anda untuk mengatasi tantangan analisis data dengan keyakinan dan kreativitas.',
    courseId: courseId[9].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Mengajak Anda belajar pengembangan aplikasi Android dengan pendekatan yang penuh keseruan dan kreativitas, menciptakan pengalaman belajar yang menghibur.',
    courseId: courseId[10].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Kursus ini tidak hanya membahas teknis pengembangan, tetapi juga mendorong kreativitas dalam penulisan kode, memberikan kesempatan untuk merancang aplikasi yang tidak hanya fungsional, tetapi juga menarik secara visual.',
    courseId: courseId[10].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Melalui pengalaman belajar yang menghibur, Anda akan menjelajahi dunia pengembangan aplikasi Android dengan semangat baru, merasakan kegembiraan dalam setiap baris kode yang ditulis.',
    courseId: courseId[10].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 1,
    description:
        'Kursus ini menyajikan panduan menyeluruh dalam mengelola produk dengan bijak, membantu Anda memahami prinsip-prinsip dan praktik terbaik dalam dunia manajemen produk.',
    courseId: courseId[11].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 2,
    description:
        'Memberikan wawasan mendalam tentang strategi produk yang cerdas, memungkinkan Anda untuk membuat keputusan yang informasional, merencanakan pengembangan produk, dan mengoptimalkan kinerja produk secara efektif.',
    courseId: courseId[11].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    no: 3,
    description:
        'Dengan fokus pada keahlian manajemen produk, kursus ini memberdayakan Anda dengan keterampilan yang diperlukan untuk sukses dalam mengelola produk, mulai dari perencanaan hingga peluncuran dan iterasi produk.',
    courseId: courseId[11].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
