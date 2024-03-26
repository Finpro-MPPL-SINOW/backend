const { v4: uuidv4 } = require('uuid')

module.exports = (userIds) => {
  const data = []
  userIds.forEach((userId) => {
    data.push({
      id: uuidv4(),
      type: 'Promosi',
      title: 'Dapatkan potongan 50% untuk kategori UI/UX',
      content: 'Segera dapatkan potongan sebelum kehabisan',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Pengumuman',
      title: 'Versi lebih baru tersedia',
      content:
        'Versi 1.1.2 kini sudah tersedia, update aplikasi untuk menikmati fitur baru',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Promosi',
      title:
        'Dapatkan potongan 10% untuk kategori Data Science selama bulan April',
      content: 'Segera dapatkan potongan sebelum kehabisan',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Promosi',
      title: 'Diskon Ramadan Dapatkan potongan 35%',
      content: 'Ngabuburit bersama SINOW nikmati potongan harga hingga 35%',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Notifikasi',
      title: 'Data profil berhasil diperbarui',
      content: 'Data profil diperbarui pada tanggal 21/11/2023 12:00',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Notifikasi',
      title: 'Password berhasil diubah',
      content: 'passwsord berhasil diubah pada tanggal 23/11/2023 12:00',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    data.push({
      id: uuidv4(),
      type: 'Notifikasi',
      title: 'Pembayaran sukses',
      content: 'Sukses membeli course "Belajar Android Dasar"',
      userId: userId.id,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })
  return data
}
