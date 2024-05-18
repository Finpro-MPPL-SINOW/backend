/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require('uuid')
const categories = require('../seed_data/categories')

const randomUsers = (usersData) => {
  const users = usersData[0]
  for (let i = users.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = users[i]
    users[i] = users[j]
    users[j] = temp
  }
  const pickUser = users[Math.floor(Math.random() * users.length)]
  return pickUser.id
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', categories, {})

    const users = await queryInterface.sequelize.query(
      `SELECT id FROM public."Users" WHERE role = 'admin'`,
    )

    const categoryIds = await queryInterface.sequelize.query(
      `SELECT id FROM public."Categories"`,
    )

    const courses = [
      {
        id: uuidv4(),
        name: 'Belajar Front End Web menggunakan React JS Tanpa Background IT 🔥',
        imageUrl:
          'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'pemula',
        rating: 4.3,
        categoryId: categoryIds[0][2].id,
        description: `Selamat datang di kursus yang akan membawa Anda melewati perjalanan menakjubkan dalam dunia pengembangan web! Apakah Anda belum memiliki latar belakang di dunia IT? Tidak masalah! Kursus ini dirancang khusus untuk para pemberani yang ingin menjelajahi keindahan pengembangan front-end menggunakan React JS tanpa harus menjadi ahli teknologi informasi.\n\nDalam petualangan ini, kami akan membimbing Anda dari dasar-dasar, memberikan pemahaman yang kokoh tentang React JS, dan membekali Anda dengan keterampilan untuk membangun antarmuka web yang menakjubkan dan dinamis. Bersiaplah untuk merasakan sensasi code-reactivity dan menyaksikan aplikasi web Anda menjadi hidup!\n\nApa pun latar belakang Anda, dari seniman hingga petualang baru di dunia IT, kursus ini akan membuka pintu ke dunia React JS dengan pendekatan yang ramah dan bersemangat. Saksikan bagaimana ide-ide kreatif Anda menjadi kenyataan di web!\n\nAyo, bersiaplah untuk mengejar impian web development Anda tanpa batasan, tanpa batasan background IT! `,
        classCode: 'FSW100',
        totalModule: 16,
        totalDuration: 520,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Joni',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Menjadi Kreatif dengan UI/UX Design 🔥',
        imageUrl:
          'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'pemula',
        rating: 4.7,
        categoryId: categoryIds[0][0].id,
        description: `Selamat datang di course Menjadi Kreatif dengan UI/UX Design, di mana Anda akan diajak untuk meresapi keindahan dan kreativitas dalam dunia desain antarmuka pengguna (UI) dan pengalaman pengguna (UX)! Apakah Anda seorang pemula yang penasaran atau seorang desainer berpengalaman yang ingin mengeksplorasi lebih dalam, kursus ini dirancang untuk memperkaya wawasan Anda dalam seni desain.\n\nMulai dari prinsip-prinsip dasar desain hingga teknik-teknik tingkat lanjut dalam UX, kami akan membimbing Anda melalui setiap tahap dengan tutorial interaktif, proyek-praktek, dan tantangan kreatif. Temukan rahasia menciptakan antarmuka yang memukau, pengalaman pengguna yang intuitif, dan desain yang tak terlupakan.\n\nBergabunglah dengan kami dalam eksplorasi kombinasi antara estetika dan fungsionalitas, memahami psikologi pengguna, dan menciptakan desain yang tak terlupakan. Dengan panduan kami, Anda akan belajar bagaimana menghadirkan desain yang tidak hanya indah tetapi juga meningkatkan kenyamanan dan kepuasan pengguna.\n\nAyo, bergabunglah dengan kami sekarang dan menjadi kreatif dalam dunia UI/UX Design! 🎨🚀`,
        classCode: 'UIUX100',
        totalModule: 11,
        totalDuration: 310,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Aceng',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Android Assembly Mastery: Membangun Aplikasi Android dengan Bahasa Tingkat Rendah Assembly x86 💀💀',
        imageUrl:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'mahir',
        rating: 4.6,
        categoryId: categoryIds[0][3].id,
        description: `Selamat datang di kursus Android Assembly Mastery: Membangun Aplikasi Android dengan Bahasa Tingkat Rendah Assembly x86 — petualangan kode yang melampaui batasan dan membawa Anda ke lapisan terdalam dari pemrograman. Apakah Anda siap untuk menjelajahi dunia yang penuh tantangan dan keunikan dalam menciptakan aplikasi Android menggunakan bahasa assembly x86?\n\nDalam kursus ini, kami akan membimbing Anda melalui perjalanan epik dalam menggali fondasi bahasa assembly x86 dan menerapkannya secara langsung pada pengembangan aplikasi Android. Temukan seni dan kekuatan yang tersembunyi di balik kode rendah ini, serta bagaimana memanfaatkannya untuk menciptakan aplikasi yang efisien dan tangguh.\n\nBukan hanya pembahasan konsep-konsep dasar, tetapi juga eksplorasi mendalam tentang manipulasi byte, manajemen memori, dan teknik-teknik tingkat rendah lainnya yang memberikan keunggulan unik dalam dunia pengembangan Android.\n\nMari bersama-sama merajut kisah epik ini, membawa konsep-konsep assembly x86 ke dunia aplikasi Android, dan saksikan bagaimana kode rendah ini dapat menciptakan solusi yang luar biasa. Bersiaplah untuk memahami keindahan dalam setiap instruksi dan merajut karya yang tak terlupakan dalam dunia Android dengan bahasa assembly x86! 🚀💻`,
        classCode: 'AND100',
        totalModule: 9,
        totalDuration: 300,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Cecep',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Membuat Restful API dengan menggunakan Bahasa C ☠️',
        imageUrl:
          'https://images.unsplash.com/photo-1537884944318-390069bb8665?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'mahir',
        rating: 4.5,
        categoryId: categoryIds[0][2].id,
        description: `Selamat datang, para petualang kode! Apakah Anda siap untuk memasuki dunia yang penuh misteri, tantangan, dan keberanian dalam membuat Restful API menggunakan bahasa pemrograman C? Bersiaplah untuk mengembara melalui kode-kode piramida dan menavigasi lautan sintaksis!\n\nDalam kursus ini, kami akan membimbing Anda melalui petualangan epik dalam menciptakan Restful API yang tangguh menggunakan kekuatan C. Kami tidak hanya akan membahas konsep-konsep dasar, tetapi juga menyelami perairan yang lebih dalam tentang manajemen memori, manipulasi byte, dan segala hal seru yang dapat Anda lakukan dengan bahasa C.\n\nAyo sambut badai kode bersama-sama! Bersiaplah untuk menulis baris-baris keren, menaklukkan bug-bug jahat, dan menciptakan API yang legendaris. Bahkan, emoji tengkorak ☠️ di judul ini hanya akan menjadi saksi bisu dari keseruan perjalanan Anda.\n\nIngatlah, petualangan ini bukan hanya tentang menciptakan API, tetapi juga tentang menemukan keajaiban dalam setiap kurung kurawal dan melibatkan diri dalam cerita seru dalam dunia pemrograman. Ayo mulai petualangan Anda menuju puncak lautan kode!`,
        classCode: 'BE100',
        totalModule: 6,
        totalDuration: 200,
        type: 'premium',
        price: 800000,
        promoDiscountPercentage: 15,
        courseBy: 'Ucup',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mahir Back End Golang Dalam Waktu 24 Jam ⚡️',
        imageUrl:
          'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'menengah',
        rating: 4.8,
        categoryId: categoryIds[0][2].id,
        description: `Selamat datang di kursus akseleratif kami, di mana kami akan membawa Anda dari pemula menjadi ahli di dunia back-end development menggunakan bahasa pemrograman Golang dalam waktu hanya 24 jam! Apakah Anda siap untuk terjun ke dalam pelajaran intensif yang akan mempercepat pemahaman Anda tentang server-side development?\n\nDalam setiap jam pembelajaran, kami akan membimbing Anda melalui konsep-konsep kunci Golang, memberikan wawasan mendalam tentang pengembangan server, dan menunjukkan cara membangun aplikasi back-end yang tangguh dan efisien. Tanpa perlu waktu lama, Anda akan menjadi master di balik layar, menguasai kekuatan Golang untuk menyajikan layanan back-end yang responsif dan andal.\n\nKami percaya bahwa belajar tidak harus membosankan, jadi mari jadikan perjalanan ini seru dan efektif. Bersiaplah untuk mengejar keahlian back-end Anda dalam waktu singkat, dan buktikan bahwa Anda bisa menjadi penguasa Golang dalam 24 jam!\n\nSiapkan diri Anda untuk melompat ke dunia back-end development dengan kecepatan kilat, dan saksikan kemajuan yang memukau dalam perjalanan Anda menjadi ahli Golang! 🚀`,
        classCode: 'BE101',
        totalModule: 5,
        totalDuration: 160,
        type: 'premium',
        price: 1200000,
        promoDiscountPercentage: 20,
        courseBy: 'Joni',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Petualangan Kode di Android Studio: Jelajahi Dunia Pengembangan Aplikasi Android! 🖥️🖥️',
        imageUrl:
          'https://images.unsplash.com/photo-1639507986194-48ef61205b61?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'menengah',
        rating: 4.4,
        categoryId: categoryIds[0][3].id,
        description: `Selamat datang di Petualangan Kode di Android Studio! Siap-siap untuk menjelajahi dunia ajaib pengembangan aplikasi Android dengan senyuman di wajah! 🚀📱 Dalam kursus ini, kita akan memasuki labirin kode tanpa batas dan mengubah ide kreatif menjadi aplikasi canggih. Bersiaplah untuk menemukan trik-trik Android Studio yang menyenangkan dan membuatmu terkesima. Jangan khawatir, tidak ada kode yang terlalu serius di sini - hanya seni rahasia menyusun petualangan digitalmu sendiri! 🗺️✨`,
        classCode: 'AND101',
        totalModule: 5,
        totalDuration: 120,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Mamat',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mengembangkan Kreativitas: Menguasai UI/UX Design dengan Lebih dari Sekadar Warna dan Bentuk! 🌈✨',
        imageUrl:
          'https://images.unsplash.com/photo-1577760258779-e787a1733016?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'mahir',
        rating: 4.7,
        categoryId: categoryIds[0][0].id,
        description: `Selamat datang di dunia kreativitas tanpa batas di dalam kategori UI/UX Design kami! Di sini, kami mengajak Anda untuk menggali lebih dalam daripada sekadar warna dan bentuk, melainkan merangkul seni dan ilmu di balik antarmuka pengguna (UI) dan pengalaman pengguna (UX).\n\nDari pemula hingga tingkat lanjut, kami menawarkan panduan langkah demi langkah, proyek-proyek mendalam, dan tantangan desain yang menginspirasi. Temukan rahasia menciptakan desain yang memikat perhatian, pengalaman pengguna yang intuitif, dan sentuhan kreatif yang membedakan desain Anda dari yang lain.\n\nMari kita menjelajahi perpaduan antara seni dan fungsionalitas, memahami psikologi pengguna, dan menciptakan desain yang tak terlupakan. Dengan panduan kami, Anda akan belajar bagaimana menciptakan desain yang tidak hanya indah tetapi juga meningkatkan kenyamanan dan kepuasan pengguna.\n\nBergabunglah dengan kami untuk meresapi keindahan dan tantangan dalam merancang antarmuka yang tak terlupakan, dan buktikan bahwa UI/UX design dapat menjadi seni yang mengilhami! 🚀🎨`,
        classCode: 'UIUX102',
        totalModule: 5,
        totalDuration: 170,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Tono',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mengelola Produk dengan Bijak: Panduan Komprehensif untuk Product Management 🚀📈',
        imageUrl:
          'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'pemula',
        rating: 4.3,
        categoryId: categoryIds[0][1].id,
        description: `Selamat datang di course Mengelola Produk dengan Bijak: Panduan Komprehensif untuk Product Management! Sambutlah keceriaan dalam mengelola produk dengan bijak! 🌟 Dalam panduan komprehensif ini, kita akan menyelami dunia Product Management dengan semangat yang penuh warna. Mulai dari mengatur ide-ide kreatif hingga meluncurkan produk unggulan, kursus ini akan memandu langkah-langkah cerdas untuk mengelola produk dengan senyum di bibir. Bersiaplah untuk merayakan setiap sprint dan memecahkan teka-teki tantangan pengelolaan produk dengan kreativitas. Jadi, siapkan dirimu untuk perjalanan yang menyenangkan dan berguna dalam dunia mengelola produk! 🚀📈`,
        classCode: 'PM100',
        totalModule: 5,
        totalDuration: 170,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Ucup',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Melaju di Dunia iOS dengan Swift: Petualangan Pengembangan Aplikasi yang Memikat 🚀📱',
        imageUrl:
          'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'mahir',
        rating: 4.6,
        categoryId: categoryIds[0][4].id,
        description: `Selamat datang di course Melaju di Dunia iOS dengan Swift, di mana kita akan mempercepat laju pengembangan aplikasi iOS dengan menggunakan alat utama, yaitu Swift! Bersiaplah untuk menjelajahi segala yang Swift tawarkan dalam pembuatan aplikasi yang memikat dan inovatif.\n\nDari pemula hingga tingkat lanjut, kami menyediakan panduan lengkap dan praktis untuk membimbing Anda melewati kurva pembelajaran Swift. Temukan cara membuat antarmuka yang indah dan responsif, memahami prinsip-prinsip desain iOS, dan mengimplementasikan logika aplikasi yang cerdas.\n\nKami akan membimbing Anda melalui proses menggunakan Xcode, alat resmi pengembangan iOS, dan menunjukkan trik-trik dan teknik-teknik terbaik dalam pengembangan aplikasi Swift. Bersama-sama, kita akan merancang aplikasi iOS yang tidak hanya terampil dalam segi fungsional tetapi juga menawan dalam pengalaman pengguna.\n\nJadilah bagian dari petualangan pengembangan iOS ini, dan buktikan bahwa Anda bisa melajukan karir pengembangan aplikasi dengan kecepatan penuh menggunakan Swift! 😎🚀`,
        classCode: 'IOS110',
        totalModule: 5,
        totalDuration: 160,
        type: 'premium',
        price: 2000000,
        promoDiscountPercentage: 0,
        courseBy: 'Aceng',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mengeksplorasi Dunia Data: Petualangan Data Science dari A-Z 📊🚀',
        imageUrl:
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'pemula',
        rating: 4.6,
        categoryId: categoryIds[0][5].id,
        description: `Selamat datang di course Mengeksplorasi Dunia Data, di mana Anda akan diajak untuk meresapi petualangan data science yang mendalam dan menarik! Apakah Anda seorang pemula yang ingin memahami dasar-dasar atau seorang praktisi data yang ingin mengasah keterampilan, course ini dirancang untuk Anda.\n\nDari pengumpulan data hingga model machine learning, kami menyajikan panduan lengkap tentang konsep-konsep dan teknik-teknik yang diperlukan dalam dunia data science. Temukan cara menyajikan data dengan visualisasi yang kuat, mengidentifikasi pola-pola tersembunyi, dan mengambil keputusan berbasis data yang cerdas.\n\nKami akan membimbing Anda melalui penggunaan alat-alat seperti Python, Jupyter Notebooks, dan framework machine learning populer. Dapatkan wawasan mendalam tentang analisis statistik, pembelajaran mesin, dan teknik pengolahan besar data.\n\nAyo, bergabunglah dengan kami dalam menjelajahi dunia data science dari A-Z dan buktikan bahwa kekuatan pengetahuan data dapat membawa perubahan signifikan! 📈💻`,
        classCode: 'DS110',
        totalModule: 5,
        totalDuration: 145,
        type: 'premium',
        price: 2000000,
        promoDiscountPercentage: 50,
        courseBy: 'Cecep',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Belajar Pengembangan Aplikasi Android dengan Keseruan dan Kreativitas 🌟📱',
        imageUrl:
          'https://plus.unsplash.com/premium_photo-1682145730713-34bba6d3d14a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'menengah',
        rating: 4.9,
        categoryId: categoryIds[0][3].id,
        description: `Selamat datang di course Merajut Mimpi di Dunia Android, di mana Anda akan menjelajahi keindahan dan kreativitas dalam pengembangan aplikasi Android! Apakah Anda seorang pemula yang penasaran atau seorang pengembang berpengalaman yang ingin mengeksplorasi lebih dalam, kategori ini menyajikan petualangan menyenangkan dalam dunia Android development.\n\nMulai dari pengenalan dasar-dasar Android Studio hingga pembuatan aplikasi yang canggih, kami membawa Anda melalui setiap langkah dengan panduan interaktif, proyek-praktek, dan tantangan kreatif. Temukan cara membuat antarmuka pengguna yang menawan, mengintegrasikan fitur-fitur Android yang menarik, dan mendistribusikan aplikasi Anda ke dunia.\n\nBersama kami, Anda akan merasakan kegembiraan dalam menciptakan aplikasi Android yang tak terlupakan. Belajarlah dengan cara yang inspiratif, kreatif, dan penuh semangat, dan saksikan bagaimana ide-ide Anda menjadi kenyataan di dunia Android yang dinamis ini!\n\nBergabunglah sekarang dan raih impian Anda dalam merajut mimpi di dunia Android! 🚀📲`,
        classCode: 'AND104',
        totalModule: 5,
        totalDuration: 170,
        type: 'gratis',
        price: 0,
        promoDiscountPercentage: 0,
        courseBy: 'Yudi',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mengelola Produk dengan Bijak',
        imageUrl:
          'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        videoPreviewUrl:
          'https://ik.imagekit.io/96gmelvyq/Video-preview.mp4?updatedAt=1701743141010',
        level: 'pemula',
        rating: 5,
        categoryId: categoryIds[0][1].id,
        description: `Selamat datang di course Mengelola Produk dengan Bijak, di mana Anda akan mendapatkan panduan komprehensif untuk menjadi seorang Product Manager yang sukses. Dalam dunia yang terus berkembang ini, mengelola produk dengan bijak adalah keterampilan kunci yang membutuhkan kombinasi antara keahlian bisnis, pemahaman pelanggan, dan ketangkasan teknologi.\n\nDari perencanaan hingga peluncuran produk, kami menyajikan sumber daya mendalam dan studi kasus nyata untuk membimbing Anda melalui setiap tahapan manajemen produk. Pelajari cara merumuskan strategi produk yang efektif, mengidentifikasi kebutuhan pelanggan, dan memimpin tim menuju kesuksesan produk yang berkelanjutan.\n\nBergabunglah dengan kami dalam menjelajahi konsep-konsep seperti roadmapping, analisis persaingan, dan pengembangan fitur, serta cara mengukur keberhasilan produk. Segera menjadi ahli dalam seni mengelola produk dengan bijak dan membawa produk Anda ke puncak kesuksesan di pasar yang kompetitif ini! 🌟📊`,
        classCode: 'PM201',
        totalModule: 5,
        totalDuration: 135,
        type: 'premium',
        price: 2500000,
        promoDiscountPercentage: 0,
        courseBy: 'Rahmat',
        createdBy: await randomUsers(users),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await queryInterface.bulkInsert('Courses', courses, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Courses', null, {})
  },
}
