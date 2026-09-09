/**
 * ==========================================================================
 * SEKALI - APLIKASI MONITORING TAHFIZH, TAHSIN & ADAB HARIAN (VERSI 2.1)
 * Core Application Logic, State Management & Google Sheets Sync
 * ==========================================================================
 */

// 1. CONFIGURATION & STATE
const CONFIG = {
  SCRIPT_URL: localStorage.getItem('SEKALI_SCRIPT_URL') || '',
  STORAGE_KEY: 'SEKALI_APP_DATA_V2_1',
  USER_KEY: 'SEKALI_CURRENT_USER_ID',
  TIMEOUT_MS: 15000
};

// DAFTAR 40 HEADLINE MISI HARIAN (BANGUN TIDUR S.D. TIDUR KEMBALI) - RESMI & LENGKAP
const DAFTAR_40_HEADLINE = [
  {
    id: 'hl_1', no: 1, waktu: 'Pagi', judul: 'Bangun Tidur', iconTheme: 'amber',
    submisi: [
      { id: 'sub_1_1', judul: 'Ortu membisikkan salam lembut', bintang: 5 },
      { id: 'sub_1_2', judul: 'Ortu memanggil nama dengan lembut', bintang: 5 },
      { id: 'sub_1_3', judul: 'Ortu memeluk selama 60 detik', bintang: 5 },
      { id: 'sub_1_4', judul: 'Ortu tersenyum dan mendoakan kebaikan', bintang: 5 },
      // DROPDOWN 1: Cara Bangun
      {
        id: 'group_1_1',
        label: 'Cara Bangun',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_1_5', judul: 'Bangun Mandiri', bintang: 3 },
          { id: 'sub_1_6', judul: 'Dibangunkan', bintang: 1 }
        ]
      },
      // DROPDOWN 2: Waktu Bangun
      {
        id: 'group_1_2',
        label: 'Waktu Bangun',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_1_7', judul: 'Sebelum Adzan', bintang: 3 },
          { id: 'sub_1_8', judul: 'Saat Adzan', bintang: 2 },
          { id: 'sub_1_9', judul: 'Setelah Adzan', bintang: 1 }
        ]
      },
      { id: 'sub_1_10', judul: 'Ingat Allah & bersyukur', bintang: 1 },
      { id: 'sub_1_11', judul: 'Berdoa bangun tidur', bintang: 1 },
      { id: 'sub_1_12', judul: 'Segera beranjak ke kamar mandi', bintang: 1 },
      { id: 'sub_1_13', judul: 'Tidak tidur lagi', bintang: 5 },
      { id: 'sub_1_14', judul: 'Minum segelas air', bintang: 1 },
      { id: 'sub_1_15', judul: 'Merapikan seprai', bintang: 1 },
      { id: 'sub_1_16', judul: 'Membersihkan debu', bintang: 1 },
      { id: 'sub_1_17', judul: 'Melipat selimut', bintang: 1 },
      { id: 'sub_1_18', judul: 'Merapikan bantal', bintang: 1 },
    ]
  },
  {
    id: 'hl_2', no: 2, waktu: 'Pagi', judul: 'BAB/BAK', iconTheme: 'blue',
    submisi: [
      { id: 'sub_2_1', judul: 'Masuk dahulukan kaki kiri', bintang: 1 },
      { id: 'sub_2_2', judul: 'Ingat Allah & Taawudz', bintang: 1 },
      { id: 'sub_2_3', judul: 'Berdoa menukar pakaian', bintang: 1 },
      { id: 'sub_2_4', judul: 'Tidak ngobrol', bintang: 1 },
      { id: 'sub_2_5', judul: 'Tidak bernyanyi', bintang: 1 },
      { id: 'sub_2_6', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_2_7', judul: 'Duduk/jongkok', bintang: 1 },
      { id: 'sub_2_8', judul: 'Istinja dengan benar', bintang: 1 },
      { id: 'sub_2_9', judul: 'Berdoa memakai pakaian', bintang: 1 },
      { id: 'sub_2_10', judul: 'Keluar dahulukan kaki kanan', bintang: 1 },
      { id: 'sub_2_11', judul: 'Mengucap ghufranaka', bintang: 1 },
    ]
  },
  {
    id: 'hl_3', no: 3, waktu: 'Pagi', judul: 'Wudhu Shubuh', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_3_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_3_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_3_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_3_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_3_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_3_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_3_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_3_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_3_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_3_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_3_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_3_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_4', no: 4, waktu: 'Pagi', judul: 'Shalat Tahajud', iconTheme: 'indigo',
    submisi: [
      { id: 'sub_4_1', judul: 'Suci dari hadats & najis', bintang: 1 },
      { id: 'sub_4_2', judul: 'Berpakaian suci', bintang: 1 },
      // DROPDOWN 3: Rakaat Tahajud
      {
        id: 'group_4_1',
        label: 'Rakaat Tahajud',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_4_3', judul: 'Tidak tahajud', bintang: 0 },
          { id: 'sub_4_4', judul: 'Tahajud 2 rakaat', bintang: 2 },
          { id: 'sub_4_5', judul: 'Tahajud 4 rakaat', bintang: 4 },
          { id: 'sub_4_6', judul: 'Tahajud 6 rakaat', bintang: 6 },
          { id: 'sub_4_7', judul: 'Tahajud 8 rakaat', bintang: 8 }
        ]
      },
      // DROPDOWN 4: Rakaat Witir
      {
        id: 'group_4_2',
        label: 'Rakaat Witir',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_4_8', judul: 'Tidak witir', bintang: 0 },
          { id: 'sub_4_9', judul: 'Witir 1 rakaat', bintang: 1 },
          { id: 'sub_4_10', judul: 'Witir 3 rakaat', bintang: 3 }
        ]
      },
    ]
  },
  {
    id: 'hl_5', no: 5, waktu: 'Pagi', judul: 'Sahur puasa', iconTheme: 'orange',
    submisi: [
      { id: 'sub_5_1', judul: 'Melaksanakan sahur', bintang: 10 },
      { id: 'sub_5_2', judul: 'Makanan halal', bintang: 1 },
      { id: 'sub_5_3', judul: 'Makanan thayyib', bintang: 1 },
      { id: 'sub_5_4', judul: 'Minuman halal', bintang: 1 },
      { id: 'sub_5_5', judul: 'Minuman thayyib', bintang: 1 },
      { id: 'sub_5_6', judul: 'Ingat Allah & bersyukur', bintang: 2 },
      { id: 'sub_5_7', judul: 'Ucap basmalah & berdoa', bintang: 1 },
      { id: 'sub_5_8', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_5_9', judul: 'Tidak berjalan', bintang: 1 },
      { id: 'sub_5_10', judul: 'Tidak berbaring', bintang: 1 },
      { id: 'sub_5_11', judul: 'Tidak bersandar', bintang: 1 },
      { id: 'sub_5_12', judul: 'Duduk tenang', bintang: 1 },
      { id: 'sub_5_13', judul: 'Tangan kanan', bintang: 1 },
      { id: 'sub_5_14', judul: 'Tidak mencela', bintang: 1 },
      { id: 'sub_5_15', judul: 'Tidak bicara waktu mengunyah', bintang: 1 },
      { id: 'sub_5_16', judul: 'Tidak kecap-kecap', bintang: 1 },
      { id: 'sub_5_17', judul: 'Habis', bintang: 1 },
      { id: 'sub_5_18', judul: 'Tidak membuang makanan', bintang: 1 },
      { id: 'sub_5_19', judul: 'Ucap hamdalah', bintang: 1 },
      { id: 'sub_5_20', judul: 'Menyikat gigi', bintang: 1 },
    ]
  },
  {
    id: 'hl_6', no: 6, waktu: 'Pagi', judul: "Shalat shubuh", iconTheme: 'emerald',
    submisi: [
      { id: 'sub_6_1', judul: "Suci dari hadats & najis", bintang: 1 },
      { id: 'sub_6_2', judul: "Berpakaian suci", bintang: 1 },
      { id: 'sub_6_3', judul: "Masuk masjid kaki kanan", bintang: 1 },
      { id: 'sub_6_4', judul: "Ingat Allah & berdoa", bintang: 1 },
      { id: 'sub_6_5', judul: "Shalat tahiyyatul masjid", bintang: 2 },
      { id: 'sub_6_6', judul: "Shalat qabliyah", bintang: 2 },
      { id: 'sub_6_7', judul: "Melantunkan adzan/iqamat", bintang: 1 },
      { id: 'sub_6_8', judul: "Menjadi imam", bintang: 1 },
      { id: 'sub_6_9', judul: "Melaksanakan shalat shubuh", bintang: 10 },
      { id: 'sub_6_10', judul: "Wirid & doa", bintang: 1 },
      { id: 'sub_6_11', judul: "Berjamaah", bintang: 1 },
      { id: 'sub_6_12', judul: "Di masjid/mushala", bintang: 1 },
      { id: 'sub_6_13', judul: "Keluar masjid kaki kiri", bintang: 1 },
      { id: 'sub_6_14', judul: "Doa keluar masjid", bintang: 1 },
    ]
  },
  {
    id: 'hl_7', no: 7, waktu: 'Pagi', judul: "Tahfizh Shubuh", iconTheme: 'teal',
    submisi: [
      { id: 'sub_7_1', judul: 'Ucap Taawudz', bintang: 1 },
      { id: 'sub_7_2', judul: 'Ucap Basmalah', bintang: 1 },
      // DROPDOWN 5: Capaian Ziyadah (Shubuh)
      {
        id: 'group_7_1',
        label: 'Capaian Ziyadah',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_7_3', judul: 'Ziyadah 0 baris', bintang: 0 },
          { id: 'sub_7_6', judul: 'Ziyadah 10 baris', bintang: 10 }
        ]
      },
      { id: 'sub_7_7', judul: 'Tiqrar 20 kali', bintang: 5 },
      // DROPDOWN 6: Capaian Murajaah
      {
        id: 'group_7_2',
        label: 'Capaian Murajaah',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_7_8', judul: 'Tidak murajaah', bintang: 0 },
          { id: 'sub_7_9', judul: 'Murajaah 1 hal 10 kali', bintang: 5 },
          { id: 'sub_7_10', judul: 'Murajaah 2 hal 10 kali', bintang: 10 }
        ]
      },
    ]
  },
  {
    id: 'hl_8', no: 8, waktu: 'Pagi', judul: 'Bantu Orangtua', iconTheme: 'rose',
    submisi: [
      { id: 'sub_8_1', judul: 'Menyapu lantai', bintang: 5 },
      { id: 'sub_8_2', judul: 'Mengepel lantai', bintang: 5 },
      { id: 'sub_8_3', judul: 'Cuci alat makan', bintang: 5 },
      { id: 'sub_8_4', judul: 'Cuci/jemur baju', bintang: 5 },
      { id: 'sub_8_5', judul: 'Memasak', bintang: 5 },
      { id: 'sub_8_6', judul: 'Mengasuh adik', bintang: 5 },
    ]
  },
  {
    id: 'hl_9', no: 9, waktu: 'Pagi', judul: 'Kebersihan Diri', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_9_1', judul: 'Mandi pagi', bintang: 1 },
      { id: 'sub_9_2', judul: 'Menggunakan air bersih dan suci', bintang: 1 },
      { id: 'sub_9_3', judul: 'Keramas', bintang: 1 },
      { id: 'sub_9_4', judul: 'Pakai sabun', bintang: 1 },
      { id: 'sub_9_5', judul: 'Pakai shampoo', bintang: 1 },
    ]
  },
  {
    id: 'hl_10', no: 10, waktu: 'Pagi', judul: 'Sarapan Pagi', iconTheme: 'amber',
    submisi: [
      { id: 'sub_10_1', judul: 'Berpuasa', bintang: 20 },
      { id: 'sub_10_2', judul: 'Makanan halal', bintang: 1 },
      { id: 'sub_10_3', judul: 'Makanan thayyib', bintang: 1 },
      { id: 'sub_10_4', judul: 'Minuman halal', bintang: 1 },
      { id: 'sub_10_5', judul: 'Minuman thayyib', bintang: 1 },
      { id: 'sub_10_6', judul: 'Ingat Allah & bersyukur', bintang: 2 },
      { id: 'sub_10_7', judul: 'Ucap basmalah & berdoa', bintang: 1 },
      { id: 'sub_10_8', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_10_9', judul: 'Tidak berjalan', bintang: 1 },
      { id: 'sub_10_10', judul: 'Tidak berbaring', bintang: 1 },
      { id: 'sub_10_11', judul: 'Tidak bersandar', bintang: 1 },
      { id: 'sub_10_12', judul: 'Duduk tenang', bintang: 1 },
      { id: 'sub_10_13', judul: 'Tangan kanan', bintang: 1 },
      { id: 'sub_10_14', judul: 'Tidak mencela', bintang: 1 },
      { id: 'sub_10_15', judul: 'Tidak bicara waktu mengunyah', bintang: 1 },
      { id: 'sub_10_16', judul: 'Tidak kecap-kecap', bintang: 1 },
      { id: 'sub_10_17', judul: 'Habis', bintang: 1 },
      { id: 'sub_10_18', judul: 'Tidak membuang makanan', bintang: 1 },
      { id: 'sub_10_19', judul: 'Ucap hamdalah', bintang: 1 },
      { id: 'sub_10_20', judul: 'Menyikat gigi', bintang: 1 },
    ]
  },
  {
    id: 'hl_11', no: 11, waktu: 'Pagi', judul: 'Persiapan Sekolah', iconTheme: 'indigo',
    submisi: [
      { id: 'sub_11_1', judul: 'Pamit orangtua', bintang: 1 },
      { id: 'sub_11_2', judul: 'Cium tangan orang tua', bintang: 1 },
      { id: 'sub_11_3', judul: 'Minta doa orangtua', bintang: 1 },
      { id: 'sub_11_4', judul: 'Membaca doa keluar rumah', bintang: 1 },
    ]
  },
  {
    id: 'hl_12', no: 12, waktu: 'Pagi', judul: 'Kehadiran di sekolah', iconTheme: 'emerald',
    submisi: [
      { id: 'sub_12_1', judul: 'Bersalaman dengan guru', bintang: 1 },
      { id: 'sub_12_2', judul: 'Cium tangan guru', bintang: 1 },
      { id: 'sub_12_3', judul: 'Bersalaman dengan teman', bintang: 1 },
      // DROPDOWN 7: Waktu Kedatangan Sekolah
      {
        id: 'group_12_1',
        label: 'Waktu Kedatangan',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_12_4', judul: 'Datang 20 menit sebelum masuk', bintang: 10 },
          { id: 'sub_12_5', judul: 'Datang 10 menit sebelum masuk', bintang: 5 },
          { id: 'sub_12_6', judul: 'Terlambat', bintang: 1 }
        ]
      },
      { id: 'sub_12_7', judul: 'Berseragam lengkap', bintang: 10 },
    ]
  },
  {
    id: 'hl_13', no: 13, waktu: 'Pagi', judul: 'Apel/Senam', iconTheme: 'violet',
    submisi: [
      { id: 'sub_13_1', judul: 'Tertib', bintang: 1 },
      { id: 'sub_13_2', judul: 'Rapi', bintang: 1 },
      { id: 'sub_13_3', judul: 'Aktif/semangat', bintang: 1 },
      { id: 'sub_13_4', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_13_5', judul: 'Tidak mengganggu teman', bintang: 1 },
    ]
  },
  {
    id: 'hl_14', no: 14, waktu: 'Pagi', judul: 'Tahsin Sekolah', iconTheme: 'blue',
    submisi: [
      { id: 'sub_14_1', judul: 'Tertib', bintang: 1 },
      { id: 'sub_14_2', judul: 'Rapi', bintang: 1 },
      { id: 'sub_14_3', judul: 'Aktif/semangat', bintang: 1 },
      { id: 'sub_14_4', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_14_5', judul: 'Tidak mengganggu teman', bintang: 1 },
      // DROPDOWN 8 (Tahsin Sekolah)
      {
        id: 'group_14_1',
        label: 'Kelulusan Halaman',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_14_6', judul: 'Belum lulus', bintang: 1 },
          { id: 'sub_14_7', judul: 'Lulus 1 halaman', bintang: 10 },
          { id: 'sub_14_8', judul: 'Lulus 2 halaman', bintang: 20 }
        ]
      },
    ]
  },
  {
    id: 'hl_15', no: 15, waktu: 'Pagi', judul: 'Tahfizh Sekolah', iconTheme: 'teal',
    submisi: [
      { id: 'sub_15_1', judul: 'Ucap Taawudz', bintang: 1 },
      { id: 'sub_15_2', judul: 'Ucap Basmalah', bintang: 1 },
      // DROPDOWN 9: Capaian Ziyadah (Sekolah)
      {
        id: 'group_15_1',
        label: 'Capaian Ziyadah',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_15_3', judul: 'Ziyadah 0 baris', bintang: 0 },
          { id: 'sub_15_4', judul: 'Ziyadah 1 baris', bintang: 1 },
          { id: 'sub_15_5', judul: 'Ziyadah 5 baris', bintang: 5 },
          { id: 'sub_15_6', judul: 'Ziyadah 10 baris', bintang: 10 }
        ]
      },
      { id: 'sub_15_7', judul: 'Tiqrar 20 kali', bintang: 5 },
      // DROPDOWN 10: Capaian Murajaah (Sekolah)
      {
        id: 'group_15_2',
        label: 'Capaian Murajaah',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_15_8', judul: 'Tidak murajaah', bintang: 0 },
          { id: 'sub_15_9', judul: 'Murajaah 1 hal 10 kali', bintang: 5 },
          { id: 'sub_15_10', judul: 'Murajaah 2 hal 10 kali', bintang: 10 }
        ]
      },
      { id: 'sub_15_11', judul: 'Ucap hamdalah & doa', bintang: 1 },
    ]
  },
  {
    id: 'hl_16', no: 16, waktu: 'Pagi', judul: 'Wudhu Dhuha', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_16_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_16_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_16_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_16_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_16_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_16_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_16_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_16_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_16_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_16_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_16_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_16_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_17', no: 17, waktu: 'Siang', judul: 'Shalat Dhuha', iconTheme: 'amber',
    submisi: [
      { id: 'sub_17_1', judul: 'Suci dari hadats & najis', bintang: 1 },
      { id: 'sub_17_2', judul: 'Berpakaian suci', bintang: 1 },
      // DROPDOWN 11: Jumlah Rakaat Dhuha
      {
        id: 'group_17_1',
        label: 'Jumlah Rakaat Dhuha',
        tipe: 'dropdown',
        opsi: [
          { id: 'sub_17_3', judul: 'Dhuha 2 rakaat', bintang: 2 },
          { id: 'sub_17_4', judul: 'Dhuha 4 rakaat', bintang: 4 },
          { id: 'sub_17_5', judul: 'Dhuha 6 rakaat', bintang: 6 },
          { id: 'sub_17_6', judul: 'Dhuha 8 rakaat', bintang: 8 },
          { id: 'sub_17_7', judul: 'Dhuha 10 rakaat', bintang: 10 },
          { id: 'sub_17_8', judul: 'Dhuha 12 rakaat', bintang: 12 }
        ]
      },
      { id: 'sub_17_9', judul: 'Doa Dhuha', bintang: 1 },
      { id: 'sub_17_10', judul: 'Tertib', bintang: 1 },
      { id: 'sub_17_11', judul: 'Rapi', bintang: 1 },
      { id: 'sub_17_12', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_17_13', judul: 'Tidak mengganggu teman', bintang: 1 },
    ]
  },
  {
    id: 'hl_18', no: 18, waktu: 'Siang', judul: 'Snack Pagi', iconTheme: 'orange',
    submisi: [
      { id: 'sub_18_1', judul: 'Berpuasa', bintang: 20 },
      { id: 'sub_18_2', judul: 'Makanan halal', bintang: 1 },
      { id: 'sub_18_3', judul: 'Makanan thayyib', bintang: 1 },
      { id: 'sub_18_4', judul: 'Minuman halal', bintang: 1 },
      { id: 'sub_18_5', judul: 'Minuman thayyib', bintang: 1 },
      { id: 'sub_18_6', judul: 'Ingat Allah & bersyukur', bintang: 2 },
      { id: 'sub_18_7', judul: 'Ucap basmalah & berdoa', bintang: 1 },
      { id: 'sub_18_8', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_18_9', judul: 'Tidak berjalan', bintang: 1 },
      { id: 'sub_18_10', judul: 'Tidak berbaring', bintang: 1 },
      { id: 'sub_18_11', judul: 'Tidak bersandar', bintang: 1 },
      { id: 'sub_18_12', judul: 'Duduk tenang', bintang: 1 },
      { id: 'sub_18_13', judul: 'Tangan kanan', bintang: 1 },
      { id: 'sub_18_14', judul: 'Tidak mencela', bintang: 1 },
      { id: 'sub_18_15', judul: 'Tidak bicara waktu mengunyah', bintang: 1 },
      { id: 'sub_18_16', judul: 'Tidak kecap-kecap', bintang: 1 },
      { id: 'sub_18_17', judul: 'Habis', bintang: 1 },
      { id: 'sub_18_18', judul: 'Tidak membuang makanan', bintang: 1 },
      { id: 'sub_18_19', judul: 'Ucap hamdalah', bintang: 1 },
      { id: 'sub_18_20', judul: 'Menyikat gigi', bintang: 1 },
    ]
  },
  {
    id: 'hl_19', no: 19, waktu: 'Siang', judul: 'Materi Pelajaran Pertama', iconTheme: 'blue',
    submisi: [
      { id: 'sub_19_1', judul: 'Tertib', bintang: 1 },
      { id: 'sub_19_2', judul: 'Rapi', bintang: 1 },
      { id: 'sub_19_3', judul: 'Aktif/semangat', bintang: 1 },
      { id: 'sub_19_4', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_19_5', judul: 'Tidak mengganggu teman', bintang: 1 },
      { id: 'sub_19_6', judul: 'Memperhatikan guru', bintang: 1 },
      { id: 'sub_19_7', judul: 'Aktif bertanya', bintang: 1 },
      { id: 'sub_19_8', judul: 'Aktif menjawab', bintang: 1 },
      { id: 'sub_19_9', judul: 'Mencatat materi', bintang: 1 },
    ]
  },
  {
    id: 'hl_20', no: 20, waktu: 'Siang', judul: 'Qailulah', iconTheme: 'indigo',
    submisi: [
      { id: 'sub_20_1', judul: 'Rapi', bintang: 1 },
      { id: 'sub_20_2', judul: 'Tertib', bintang: 1 },
      { id: 'sub_20_3', judul: 'Berwudhu', bintang: 1 },
      { id: 'sub_20_4', judul: 'Tidak ngobrol', bintang: 1 },
      { id: 'sub_20_5', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_20_6', judul: 'Tidak mengganggu teman', bintang: 1 },
      { id: 'sub_20_7', judul: 'Tidur Qailulah', bintang: 10 },
      // Submisi Peringatan / Penalti (Bintang Negatif)
      { id: 'sub_20_8', judul: 'Mengobrol (Pelanggaran)', bintang: -10 },
      { id: 'sub_20_9', judul: 'Bercanda (Pelanggaran)', bintang: -15 },
      { id: 'sub_20_10', judul: 'Mengganggu teman (Pelanggaran)', bintang: -20 }
    ]
  },
  {
    id: 'hl_21', no: 21, waktu: 'Siang', judul: 'Wudhu Zhuhur', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_21_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_21_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_21_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_21_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_21_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_21_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_21_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_21_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_21_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_21_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_21_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_21_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_22', no: 22, waktu: 'Siang', judul: 'Shalat Zhuhur', iconTheme: 'emerald',
    submisi: [
      { id: 'sub_22_1', judul: "Suci dari hadats & najis", bintang: 1 },
      { id: 'sub_22_2', judul: "Berpakaian suci", bintang: 1 },
      { id: 'sub_22_3', judul: "Masuk masjid kaki kanan", bintang: 1 },
      { id: 'sub_22_4', judul: "Ingat Allah & berdoa", bintang: 1 },
      { id: 'sub_22_5', judul: "Shalat tahiyyatul masjid", bintang: 2 },
      { id: 'sub_22_6', judul: "Shalat qabliyah", bintang: 2 },
      { id: 'sub_22_7', judul: "Melantunkan adzan/iqamat", bintang: 1 },
      { id: 'sub_22_8', judul: "Menjadi imam", bintang: 1 },
      { id: 'sub_22_9', judul: "Melaksanakan shalat zhuhur", bintang: 10 },
      { id: 'sub_22_10', judul: "Wirid & doa", bintang: 1 },
      { id: 'sub_22_11', judul: "Berjamaah", bintang: 1 },
      { id: 'sub_22_12', judul: "Di masjid/mushala", bintang: 1 },
      { id: 'sub_22_13', judul: "Shalat Badiyah", bintang: 2 },
      { id: 'sub_22_14', judul: "Rapi", bintang: 1 },
      { id: 'sub_22_15', judul: "Tertib", bintang: 1 },
      { id: 'sub_22_16', judul: "Tidak bercanda", bintang: 1 },
      { id: 'sub_22_17', judul: "Tidak mengganggu teman", bintang: 1 },
      { id: 'sub_22_18', judul: "Keluar masjid kaki kiri", bintang: 1 },
      { id: 'sub_22_19', judul: "Doa keluar masjid", bintang: 1 },
    ]
  },
  {
    id: 'hl_23', no: 23, waktu: 'Siang', judul: 'Makan Siang', iconTheme: 'amber',
    submisi: [
      { id: 'sub_23_1', judul: 'Berpuasa', bintang: 20 },
      { id: 'sub_23_2', judul: 'Makanan halal', bintang: 1 },
      { id: 'sub_23_3', judul: 'Makanan thayyib', bintang: 1 },
      { id: 'sub_23_4', judul: 'Minuman halal', bintang: 1 },
      { id: 'sub_23_5', judul: 'Minuman thayyib', bintang: 1 },
      { id: 'sub_23_6', judul: 'Ingat Allah & bersyukur', bintang: 2 },
      { id: 'sub_23_7', judul: 'Ucap basmalah & berdoa', bintang: 1 },
      { id: 'sub_23_8', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_23_9', judul: 'Tidak berjalan', bintang: 1 },
      { id: 'sub_23_10', judul: 'Tidak berbaring', bintang: 1 },
      { id: 'sub_23_11', judul: 'Tidak bersandar', bintang: 1 },
      { id: 'sub_23_12', judul: 'Duduk tenang', bintang: 1 },
      { id: 'sub_23_13', judul: 'Tangan kanan', bintang: 1 },
      { id: 'sub_23_14', judul: 'Tidak mencela', bintang: 1 },
      { id: 'sub_23_15', judul: 'Tidak bicara waktu mengunyah', bintang: 1 },
      { id: 'sub_23_16', judul: 'Tidak kecap-kecap', bintang: 1 },
      { id: 'sub_23_17', judul: 'Habis', bintang: 1 },
      { id: 'sub_23_18', judul: 'Tidak membuang makanan', bintang: 1 },
      { id: 'sub_23_19', judul: 'Ucap hamdalah', bintang: 1 },
      { id: 'sub_23_20', judul: 'Menyikat gigi', bintang: 1 },
    ]
  },
  {
    id: 'hl_24', no: 24, waktu: 'Sore', judul: 'Materi Pelajaran Kedua', iconTheme: 'blue',
    submisi: [
      { id: 'sub_24_1', judul: 'Tertib', bintang: 1 },
      { id: 'sub_24_2', judul: 'Rapi', bintang: 1 },
      { id: 'sub_24_3', judul: 'Aktif/semangat', bintang: 1 },
      { id: 'sub_24_4', judul: 'Tidak bercanda', bintang: 1 },
      { id: 'sub_24_5', judul: 'Tidak mengganggu teman', bintang: 1 },
      { id: 'sub_24_6', judul: 'Memperhatikan guru', bintang: 1 },
      { id: 'sub_24_7', judul: 'Aktif bertanya', bintang: 1 },
      { id: 'sub_24_8', judul: 'Aktif menjawab', bintang: 1 },
      { id: 'sub_24_9', judul: 'Mencatat materi', bintang: 1 },
    ]
  },
  {
    id: 'hl_25', no: 25, waktu: 'Sore', judul: "Wudhu Ashar", iconTheme: 'cyan',
    submisi: [
      { id: 'sub_25_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_25_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_25_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_25_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_25_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_25_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_25_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_25_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_25_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_25_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_25_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_25_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_26', no: 26, waktu: 'Sore', judul: 'Shalat Ashar', iconTheme: 'emerald',
    submisi: [
      { id: 'sub_26_1', judul: "Suci dari hadats & najis", bintang: 1 },
      { id: 'sub_26_2', judul: "Berpakaian suci", bintang: 1 },
      { id: 'sub_26_3', judul: "Masuk masjid kaki kanan", bintang: 1 },
      { id: 'sub_26_4', judul: "Ingat Allah & berdoa", bintang: 1 },
      { id: 'sub_26_5', judul: "Shalat tahiyyatul masjid", bintang: 2 },
      { id: 'sub_26_6', judul: "Shalat qabliyah", bintang: 2 },
      { id: 'sub_26_7', judul: "Melantunkan adzan/iqamat", bintang: 1 },
      { id: 'sub_26_8', judul: "Menjadi imam", bintang: 1 },
      { id: 'sub_26_9', judul: "Melaksanakan shalat ashar", bintang: 10 },
      { id: 'sub_26_10', judul: "Wirid & doa", bintang: 1 },
      { id: 'sub_26_11', judul: "Berjamaah", bintang: 1 },
      { id: 'sub_26_12', judul: "Di masjid/mushala", bintang: 1 },
      { id: 'sub_26_13', judul: "Keluar masjid kaki kiri", bintang: 1 },
      { id: 'sub_26_14', judul: "Doa keluar masjid", bintang: 1 },
    ]
  },
  {
    id: 'hl_27', no: 27, waktu: 'Sore', judul: 'Pulang Sekolah', iconTheme: 'indigo',
    submisi: [
      { id: 'sub_27_1', judul: 'Pamit guru', bintang: 1 },
      { id: 'sub_27_2', judul: 'Pamit teman', bintang: 1 },
      { id: 'sub_27_3', judul: 'Mengucapkan salam masuk rumah', bintang: 1 },
      { id: 'sub_27_4', judul: 'Meletakkan sepatu & kaos kaki di tempatnya', bintang: 1 },
      { id: 'sub_27_5', judul: 'Meletakkan tas rapi di tempatnya', bintang: 1 },
      { id: 'sub_27_6', judul: 'Cium tangan orangtua', bintang: 1 },
    ]
  },
  {
    id: 'hl_28', no: 28, waktu: 'Sore', judul: 'Tahsin Sore', iconTheme: 'teal',
    submisi: [
      { id: 'sub_28_1', judul: 'Murajaah 1 halaman 3 kali', bintang: 5 },
      { id: 'sub_28_2', judul: 'Muthalaah 1 halaman 5 kali', bintang: 10 }
    ]
  },
  {
    id: 'hl_29', no: 29, waktu: 'Sore', judul: 'Bermain / Olahraga', iconTheme: 'violet',
    submisi: [
      { id: 'sub_29_1', judul: 'Bermain', bintang: 5 },
      { id: 'sub_29_2', judul: 'Olahraga', bintang: 5 },
      { id: 'sub_29_3', judul: 'Main ponsel (Pelanggaran)', bintang: -50 },
    ]
  },
  {
    id: 'hl_30', no: 30, waktu: 'Sore', judul: 'Bersih Diri Sore', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_30_1', judul: 'Mandi sore bersih', bintang: 1 },
      { id: 'sub_30_2', judul: 'Menggunakan air bersih dan suci', bintang: 1 },
      { id: 'sub_30_3', judul: 'Keramas', bintang: 1 },
      { id: 'sub_30_4', judul: 'Pakai sabun', bintang: 1 },
      { id: 'sub_30_5', judul: 'Pakai shampoo', bintang: 1 },
    ]
  },
  {
    id: 'hl_31', no: 31, waktu: 'Malam', judul: 'Makan Malam', iconTheme: 'amber',
    submisi: [
      { id: 'sub_31_1', judul: 'Tuntas Berpuasa', bintang: 20 },
      { id: 'sub_31_2', judul: 'Makanan halal', bintang: 1 },
      { id: 'sub_31_3', judul: 'Makanan thayyib', bintang: 1 },
      { id: 'sub_31_4', judul: 'Minuman halal', bintang: 1 },
      { id: 'sub_31_5', judul: 'Minuman thayyib', bintang: 1 },
      { id: 'sub_31_6', judul: 'Ingat Allah & bersyukur', bintang: 2 },
      { id: 'sub_31_7', judul: 'Ucap basmalah & berdoa', bintang: 1 },
      { id: 'sub_31_8', judul: 'Tidak berdiri', bintang: 1 },
      { id: 'sub_31_9', judul: 'Tidak berjalan', bintang: 1 },
      { id: 'sub_31_10', judul: 'Tidak berbaring', bintang: 1 },
      { id: 'sub_31_11', judul: 'Tidak bersandar', bintang: 1 },
      { id: 'sub_31_12', judul: 'Duduk tenang', bintang: 1 },
      { id: 'sub_31_13', judul: 'Tangan kanan', bintang: 1 },
      { id: 'sub_31_14', judul: 'Tidak mencela', bintang: 1 },
      { id: 'sub_31_15', judul: 'Tidak bicara waktu mengunyah', bintang: 1 },
      { id: 'sub_31_16', judul: 'Tidak kecap-kecap', bintang: 1 },
      { id: 'sub_31_17', judul: 'Habis', bintang: 1 },
      { id: 'sub_31_18', judul: 'Tidak membuang makanan', bintang: 1 },
      { id: 'sub_31_19', judul: 'Ucap hamdalah', bintang: 1 },
      { id: 'sub_31_20', judul: 'Menyikat gigi', bintang: 1 },
    ]
  },
  {
    id: 'hl_32', no: 32, waktu: 'Malam', judul: 'Wudhu Maghrib', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_32_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_32_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_32_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_32_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_32_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_32_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_32_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_32_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_32_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_32_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_32_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_32_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_33', no: 33, waktu: 'Malam', judul: 'Shalat Maghrib', iconTheme: 'emerald',
    submisi: [
      { id: 'sub_33_1', judul: "Suci dari hadats & najis", bintang: 1 },
      { id: 'sub_33_2', judul: "Berpakaian suci", bintang: 1 },
      { id: 'sub_33_3', judul: "Masuk masjid kaki kanan", bintang: 1 },
      { id: 'sub_33_4', judul: "Ingat Allah & berdoa", bintang: 1 },
      { id: 'sub_33_5', judul: "Shalat tahiyyatul masjid", bintang: 2 },
      { id: 'sub_33_6', judul: "Shalat qabliyah", bintang: 2 },
      { id: 'sub_33_7', judul: "Melantunkan adzan/iqamat", bintang: 1 },
      { id: 'sub_33_8', judul: "Menjadi imam", bintang: 1 },
      { id: 'sub_33_9', judul: "Melaksanakan shalat maghrib", bintang: 10 },
      { id: 'sub_33_10', judul: "Wirid & doa", bintang: 1 },
      { id: 'sub_33_11', judul: "Berjamaah", bintang: 1 },
      { id: 'sub_33_12', judul: "Di masjid/mushala", bintang: 1 },
      { id: 'sub_33_13', judul: "Shalat Badiyah", bintang: 2 },
      { id: 'sub_33_14', judul: "Rapi", bintang: 1 },
      { id: 'sub_33_15', judul: "Tertib", bintang: 1 },
      { id: 'sub_33_16', judul: "Tidak bercanda", bintang: 1 },
      { id: 'sub_33_17', judul: "Tidak mengganggu teman", bintang: 1 },
      { id: 'sub_33_18', judul: "Keluar masjid kaki kiri", bintang: 1 },
      { id: 'sub_33_19', judul: "Doa keluar masjid", bintang: 1 },
    ]
  },
  {
    id: 'hl_34', no: 34, waktu: 'Malam', judul: 'Tahsin Malam', iconTheme: 'teal',
    submisi: [
      { id: 'sub_34_1', judul: 'Murajaah 1 halaman 3 kali', bintang: 5 },
      { id: 'sub_34_2', judul: 'Muthalaah 1 halaman 5 kali', bintang: 10 }
    ]
  },
  {
    id: 'hl_35', no: 35, waktu: 'Malam', judul: 'Wudhu Isya', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_35_1', judul: 'Mengucap Basmalah', bintang: 1 },
      { id: 'sub_35_2', judul: 'Cuci telapak tangan', bintang: 1 },
      { id: 'sub_35_3', judul: 'Berkumur/madhmadhah', bintang: 1 },
      { id: 'sub_35_4', judul: 'Istinsyaq', bintang: 1 },
      { id: 'sub_35_5', judul: 'Istinsyar', bintang: 1 },
      { id: 'sub_35_6', judul: 'Niat wudhu', bintang: 1 },
      { id: 'sub_35_7', judul: 'Membasuh wajah', bintang: 1 },
      { id: 'sub_35_8', judul: 'Membasuh tangan & siku', bintang: 1 },
      { id: 'sub_35_9', judul: 'Mengusap kepala', bintang: 1 },
      { id: 'sub_35_10', judul: 'Mengusap telinga', bintang: 1 },
      { id: 'sub_35_11', judul: 'Membasuh kaki & matakaki', bintang: 1 },
      { id: 'sub_35_12', judul: 'Berdoa setelah wudhu', bintang: 1 },
    ]
  },
  {
    id: 'hl_36', no: 36, waktu: 'Malam', judul: 'Shalat Isya', iconTheme: 'emerald',
    submisi: [
      { id: 'sub_36_1', judul: "Suci dari hadats & najis", bintang: 1 },
      { id: 'sub_36_2', judul: "Berpakaian suci", bintang: 1 },
      { id: 'sub_36_3', judul: "Masuk masjid kaki kanan", bintang: 1 },
      { id: 'sub_36_4', judul: "Ingat Allah & berdoa", bintang: 1 },
      { id: 'sub_36_5', judul: "Shalat tahiyyatul masjid", bintang: 2 },
      { id: 'sub_36_6', judul: "Shalat qabliyah", bintang: 2 },
      { id: 'sub_36_7', judul: "Melantunkan adzan/iqamat", bintang: 1 },
      { id: 'sub_36_8', judul: "Menjadi imam", bintang: 1 },
      { id: 'sub_36_9', judul: "Melaksanakan shalat isya", bintang: 10 },
      { id: 'sub_36_10', judul: "Wirid & doa", bintang: 1 },
      { id: 'sub_36_11', judul: "Berjamaah", bintang: 1 },
      { id: 'sub_36_12', judul: "Di masjid/mushala", bintang: 1 },
      { id: 'sub_36_13', judul: "Shalat Badiyah", bintang: 2 },
      { id: 'sub_36_14', judul: "Rapi", bintang: 1 },
      { id: 'sub_36_15', judul: "Tertib", bintang: 1 },
      { id: 'sub_36_16', judul: "Tidak bercanda", bintang: 1 },
      { id: 'sub_36_17', judul: "Tidak mengganggu teman", bintang: 1 },
      { id: 'sub_36_18', judul: "Keluar masjid kaki kiri", bintang: 1 },
      { id: 'sub_36_19', judul: "Doa keluar masjid", bintang: 1 },
    ]
  },
  {
    id: 'hl_37', no: 37, waktu: 'Malam', judul: 'Muhasabah Diri & Istighfar', iconTheme: 'teal',
    submisi: [
      { id: 'sub_37_1', judul: 'Mengevaluasi dosa dan kesalahan seharian serta beristighfar', bintang: 3 },
      { id: 'sub_37_2', judul: 'Memaafkan kesalahan semua orang sebelum memejamkan mata', bintang: 3 }
    ]
  },
  {
    id: 'hl_38', no: 38, waktu: 'Malam', judul: 'Adab Bersuci Sebelum Tidur', iconTheme: 'cyan',
    submisi: [
      { id: 'sub_38_1', judul: 'Berwudhu sempurna sebelum naik ke tempat tidur', bintang: 3 },
      { id: 'sub_38_2', judul: 'Mengibaskan kasur 3 kali sesuai sunnah', bintang: 1 }
    ]
  },
  {
    id: 'hl_39', no: 39, waktu: 'Malam', judul: 'Membaca Surat Pilihan & Doa Tidur', iconTheme: 'blue',
    submisi: [
      { id: 'sub_39_1', judul: 'Membaca Surat Al-Mulk atau As-Sajdah sebelum tidur', bintang: 5 },
      { id: 'sub_39_2', judul: 'Membaca Ayat Kursi, 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas) & doa tidur', bintang: 3 }
    ]
  },
  {
    id: 'hl_40', no: 40, waktu: 'Malam', judul: 'Tidur Awal Sesuai Sunnah', iconTheme: 'indigo',
    submisi: [
      { id: 'sub_40_1', judul: 'Berbaring miring ke sisi kanan menghadap kiblat', bintang: 2 },
      { id: 'sub_40_2', judul: 'Tidur sebelum larut malam (tidak begadang sia-sia)', bintang: 3 }
    ]
  }
];

// DAFTAR MISI SEMESTERAN (+DIAMOND)
const DAFTAR_MISI_SEMESTER = [
  { id: 'sem_1', judul: 'Khatam 30 Juz Al-Qur\'an', deskripsi: 'Menyelesaikan tilawah 30 Juz penuh selama 1 semester', reward_diamond: 50, icon: '🏆' },
  { id: 'sem_2', judul: 'Tasmi\' Hafalan 1 Juz Sekali Duduk', deskripsi: 'Ujian memperdengarkan hafalan 1 juz bil-ghoib tanpa salah di hadapan ustadz', reward_diamond: 75, icon: '📜' },
  { id: 'sem_3', judul: 'Lulus Ujian Matan Tajwid', deskripsi: 'Hafal & memahami kaidah matan tajwid dasar (Tuhfatul Athfal)', reward_diamond: 40, icon: '🎓' },
  { id: 'sem_4', judul: 'Kehadiran Halaqah Sempurna 100%', deskripsi: 'Hadir penuh tanpa alfa maupun izin sepanjang semester berjalan', reward_diamond: 35, icon: '⭐' },
  { id: 'sem_5', judul: 'Tuntas Jilid Tahsin Lanjut', deskripsi: 'Menyelesaikan ujian jilid tahsin dan dinyatakan lulus bersanad/lanjut', reward_diamond: 30, icon: '📖' },
  { id: 'sem_6', judul: 'Menghafal 40 Hadits Arba\'in', deskripsi: 'Hafal 40 hadits pilihan karya Imam An-Nawawi dengan lafal & arti', reward_diamond: 60, icon: '💎' }
];

// 10 BARANG TOKO HADIAH PILIHAN PENGGUNA
const DAFTAR_TOKO_BARANG = [
  { id: 'tk_1', nama_hadiah: 'Buku Tulis Santri', stok: 25, harga_diamond: 15, icon: '📓', desc: 'Buku tulis isi tebal bergaris rapi' },
  { id: 'tk_2', nama_hadiah: 'Ballpoint Eksklusif', stok: 30, harga_diamond: 10, icon: '🖊️', desc: 'Ballpoint tinta hitam nyaman dipakai menulis faedah' },
  { id: 'tk_3', nama_hadiah: 'Sepatu Halaqah', stok: 5, harga_diamond: 120, icon: '👟', desc: 'Sepatu hitam bertali nyaman untuk ke sekolah/halaqah' },
  { id: 'tk_4', nama_hadiah: 'Kaos Kaki Tebal', stok: 20, harga_diamond: 20, icon: '🧦', desc: 'Kaos kaki putih/hitam menyerap keringat' },
  { id: 'tk_5', nama_hadiah: 'Tas Ransel Santri', stok: 4, harga_diamond: 100, icon: '🎒', desc: 'Tas punggung muat Al-Qur\'an dan kitab-kitab' },
  { id: 'tk_6', nama_hadiah: 'Baju Koko Putih', stok: 6, harga_diamond: 85, icon: '👔', desc: 'Baju koko katun adem dengan bordir rapi' },
  { id: 'tk_7', nama_hadiah: 'Sandal Wudhu Masjid', stok: 15, harga_diamond: 35, icon: '🩴', desc: 'Sandal jepit anti licin untuk wudhu dan aktivitas harian' },
  { id: 'tk_8', nama_hadiah: 'Madu Murni Alami', stok: 8, harga_diamond: 50, icon: '🍯', desc: 'Madu murni herbal penjaga stamina penghafal Qur\'an' },
  { id: 'tk_9', nama_hadiah: 'Kurma Ajwa Asli', stok: 10, harga_diamond: 45, icon: '🌴', desc: 'Kurma nabi premium kaya khasiat dan sunnah' },
  { id: 'tk_10', nama_hadiah: 'Habbatussauda Kapsul', stok: 12, harga_diamond: 40, icon: '🌿', desc: 'Habbatus sauda obat dari segala macam penyakit' }
];

// DATA AWAL (MOCK DATABASE LOKAL)
const DEFAULT_MOCK_DATA = {
  users: [
    { user_id: 'usr_1', nama: 'Ahmad Fauzi', role: 'siswa', level: 3, total_bintang: 85, total_diamond: 140, foto_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { user_id: 'usr_2', nama: 'Aisyah Humaira', role: 'siswa', level: 4, total_bintang: 120, total_diamond: 210, foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    { user_id: 'usr_3', nama: 'Fatih Rizky', role: 'siswa', level: 2, total_bintang: 45, total_diamond: 60, foto_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    { user_id: 'usr_4', nama: 'Ustadz Abdullah', role: 'guru', level: 99, total_bintang: 0, total_diamond: 0, foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { user_id: 'usr_5', nama: 'H. Mansur (Kepsek)', role: 'kepsek', level: 99, total_bintang: 0, total_diamond: 0, foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }
  ],
  tahfizh: [
    { id: 'tfz_1', tanggal: '2026-09-04', user_id: 'usr_1', surah: 'An-Naba', ayat: '1 - 20', kategori: "Muraja'ah", hasil: 'Mutqin', catatan_perbaikan: 'Alhamdulillah lancar dan makhraj fasih', input_by: 'usr_4' },
    { id: 'tfz_2', tanggal: '2026-09-03', user_id: 'usr_2', surah: 'Al-Mulk', ayat: '1 - 30', kategori: 'Ziyadah', hasil: 'Mutqin', catatan_perbaikan: 'Sangat baik, perhatikan ghunnah di ayat 12', input_by: 'usr_4' },
    { id: 'tfz_3', tanggal: '2026-09-02', user_id: 'usr_3', surah: 'At-Takatsur', ayat: '1 - 8', kategori: 'Ujian / Validasi', hasil: 'Jayyid', catatan_perbaikan: 'Cukup baik, perbaiki tanda waqaf', input_by: 'usr_4' },
    { id: 'tfz_4', tanggal: '2026-09-01', user_id: 'usr_1', surah: 'An-Nazi\'at', ayat: '1 - 15', kategori: 'Ziyadah', hasil: 'Mardud', catatan_perbaikan: 'Ayat 8-11 masih tersendat, diulang besok', input_by: 'usr_4' }
  ],
  tahsin: [
    { id: 'ths_1', tanggal: '2026-09-04', user_id: 'usr_1', jilid_buku: 'Iqro 5', halaman: '14', kategori: 'Setoran', hasil: 'Mutqin', catatan_perbaikan: 'Lanjut halaman 15, makhraj ra bagus', input_by: 'usr_4' },
    { id: 'ths_2', tanggal: '2026-09-03', user_id: 'usr_2', jilid_buku: 'Al-Qur\'an', halaman: 'Juz 1 Hal 5', kategori: 'Setoran', hasil: 'Mutqin', catatan_perbaikan: 'Tanda waqaf sudah diperhatikan', input_by: 'usr_4' },
    { id: 'ths_3', tanggal: '2026-09-02', user_id: 'usr_3', jilid_buku: 'Iqro 3', halaman: '20', kategori: 'Latihan Mandiri', hasil: 'Mengulang', catatan_perbaikan: 'Panjang pendek mad thabi\'i masih tertukar', input_by: 'usr_3' }
  ],
  toko: [ ...DAFTAR_TOKO_BARANG ],
  riwayat_tukar: [],
  checklist_harian: {} // Format: { "YYYY-MM-DD_userId": { checks: [], dropdowns: {} } }
};

// Global Application State
let appData = { ...DEFAULT_MOCK_DATA };
let currentUser = DEFAULT_MOCK_DATA.users[0];
let activeFilterTahfizh = 'all';
let activeFilterTahsin = 'all';
let activeFilterWaktuMisi = 'all';
let selectedHadiahForRedeem = null;

// ==========================================================================
// 2. HELPER IKON TAILWIND MODERN UNTUK SETIAP HEADLINE
// ==========================================================================

function getHeadlineIconSvg(hl) {
  const theme = hl.iconTheme || 'emerald';
  let badgeColors = 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
  let svgPath = '';

  if (theme === 'amber') {
    badgeColors = 'bg-amber-50 text-amber-600 border border-amber-200/60';
    // Sun / Sunrise icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
  } else if (theme === 'cyan' || theme === 'blue') {
    badgeColors = 'bg-sky-50 text-sky-600 border border-sky-200/60';
    // Water droplet icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />';
  } else if (theme === 'indigo') {
    badgeColors = 'bg-indigo-50 text-indigo-600 border border-indigo-200/60';
    // Moon / Night icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
  } else if (theme === 'rose') {
    badgeColors = 'bg-rose-50 text-rose-600 border border-rose-200/60';
    // Heart / Helping hands icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />';
  } else if (theme === 'teal') {
    badgeColors = 'bg-teal-50 text-teal-600 border border-teal-200/60';
    // Book / Quran icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />';
  } else if (theme === 'violet') {
    badgeColors = 'bg-violet-50 text-violet-600 border border-violet-200/60';
    // Activity / Sports icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />';
  } else if (theme === 'orange') {
    badgeColors = 'bg-orange-50 text-orange-600 border border-orange-200/60';
    // Food / Bowl icon
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />';
  } else {
    // Mosque / Minaret (Default Emerald)
    badgeColors = 'bg-emerald-50 text-emerald-600 border border-emerald-200/60';
    svgPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />';
  }

  return `
    <div class="hl-icon-badge ${badgeColors}">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${svgPath}
      </svg>
    </div>
  `;
}

// ==========================================================================
// 3. LIFECYCLE & INISIALISASI
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  loadLocalState();
  updateConnectionBanner();
  fetchDataFromSheet(false);
}

function loadLocalState() {
  const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      appData = {
        ...DEFAULT_MOCK_DATA,
        ...parsed,
        toko: (parsed.toko && parsed.toko.length === 10) ? parsed.toko : [ ...DAFTAR_TOKO_BARANG ]
      };
    } catch (e) {
      console.warn('Gagal membaca cache lokal:', e);
      appData = { ...DEFAULT_MOCK_DATA };
    }
  }

  const savedUserId = localStorage.getItem(CONFIG.USER_KEY);
  if (savedUserId && appData.users) {
    const found = appData.users.find(u => u.user_id === savedUserId);
    if (found) currentUser = found;
  }
}

function saveLocalState() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error('Gagal menyimpan cache lokal:', e);
  }
}

function updateConnectionBanner() {
  const banner = document.getElementById('connection-banner');
  const bannerText = document.getElementById('banner-text');
  const inputUrl = document.getElementById('cfg-script-url');
  
  if (inputUrl) inputUrl.value = CONFIG.SCRIPT_URL;

  if (!CONFIG.SCRIPT_URL) {
    banner.className = 'demo-banner flex items-center justify-between px-3 py-1 cursor-pointer';
    bannerText.innerHTML = '⚡ <b>Mode Demo (Lokal)</b> &bull; Klik untuk atur URL Spreadsheet';
  } else {
    banner.className = 'bg-emerald-700 text-white text-[11px] font-semibold flex items-center justify-between px-3 py-1 cursor-pointer';
    bannerText.innerHTML = '🟢 <b>Terhubung ke Google Spreadsheet</b>';
  }
}

// ==========================================================================
// 4. API CLIENT (KOMUNIKASI GOOGLE APPS SCRIPT / SPREADSHEET)
// ==========================================================================

async function fetchDataFromSheet(isManualRefresh = false) {
  if (isManualRefresh) {
    showToast('Memperbarui data dari Spreadsheet...', 'info');
  }

  if (!CONFIG.SCRIPT_URL) {
    renderAllViews();
    if (isManualRefresh) showToast('Data lokal berhasil disegarkan', 'info');
    return;
  }

  try {
    const fetchPromise = fetch(`${CONFIG.SCRIPT_URL}?action=loadAllData`, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Accept': 'application/json' }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Koneksi timeout (15 detik)')), CONFIG.TIMEOUT_MS)
    );

    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result && result.status === 'success' && result.data) {
      appData.users = result.data.users || appData.users;
      appData.tahfizh = result.data.tahfizh || appData.tahfizh;
      appData.tahsin = result.data.tahsin || appData.tahsin;
      if (result.data.toko && result.data.toko.length > 0) {
        appData.toko = result.data.toko;
      }
      appData.riwayat_tukar = result.data.riwayat_tukar || appData.riwayat_tukar;

      saveLocalState();
      
      if (appData.users && currentUser) {
        const refreshed = appData.users.find(u => u.user_id === currentUser.user_id);
        if (refreshed) currentUser = refreshed;
      }

      renderAllViews();
      if (isManualRefresh) showToast('Data berhasil disinkronkan dari Spreadsheet!', 'success');
    } else {
      throw new Error(result.message || 'Format data dari server tidak sesuai');
    }
  } catch (err) {
    console.warn('Gagal koneksi ke Spreadsheet, menggunakan cache lokal:', err);
    renderAllViews();
    showToast(`Gagal sinkron Spreadsheet (${err.message}). Menggunakan data lokal.`, 'error');
  }
}

async function sendDataToScript(payload) {
  if (!CONFIG.SCRIPT_URL) {
    return simulateLocalBackend(payload);
  }

  const response = await fetch(CONFIG.SCRIPT_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok || result.status !== 'success') {
    throw new Error(result.message || 'Gagal menyimpan ke server');
  }
  return result;
}

function simulateLocalBackend(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const action = payload.action;

      if (action === 'simpanTahfizh') {
        const item = {
          id: 'tfz_' + Date.now(),
          ...payload.data,
          timestamp: new Date().toISOString()
        };
        if (!appData.tahfizh) appData.tahfizh = [];
        appData.tahfizh.unshift(item);
        saveLocalState();
        resolve({ status: 'success', message: 'Laporan Tahfizh berhasil dicatat!', data: item });
      } 
      else if (action === 'simpanTahsin') {
        const item = {
          id: 'ths_' + Date.now(),
          ...payload.data,
          timestamp: new Date().toISOString()
        };
        if (!appData.tahsin) appData.tahsin = [];
        appData.tahsin.unshift(item);
        saveLocalState();
        resolve({ status: 'success', message: 'Laporan Tahsin berhasil dicatat!', data: item });
      }
      else if (action === 'tukarHadiah') {
        const { user_id, hadiah_id } = payload.data;
        const hadiah = (appData.toko || []).find(t => t.id === hadiah_id);
        const user = (appData.users || []).find(u => u.user_id === user_id);

        if (!hadiah || !user) {
          resolve({ status: 'error', message: 'Hadiah atau pengguna tidak ditemukan' });
          return;
        }

        if ((user.total_diamond || 0) < hadiah.harga_diamond) {
          resolve({ status: 'error', message: 'Diamond kamu belum mencukupi' });
          return;
        }

        if (hadiah.stok <= 0) {
          resolve({ status: 'error', message: 'Stok barang ini sudah habis' });
          return;
        }

        user.total_diamond -= hadiah.harga_diamond;
        hadiah.stok = Math.max(0, hadiah.stok - 1);

        if (!appData.riwayat_tukar) appData.riwayat_tukar = [];
        appData.riwayat_tukar.unshift({
          id: 'trk_' + Date.now(),
          tanggal: new Date().toISOString().split('T')[0],
          user_id: user.user_id,
          nama_hadiah: hadiah.nama_hadiah,
          harga_diamond: hadiah.harga_diamond,
          status: 'Menunggu Pengambilan'
        });

        saveLocalState();
        resolve({ status: 'success', message: `Alhamdulillah! Berhasil menukar ${hadiah.nama_hadiah}!`, user: user });
      }
      else if (action === 'toggleChecklist' || action === 'toggleDropdownOption') {
        const { user_id, delta_bintang } = payload.data;
        const user = (appData.users || []).find(u => u.user_id === user_id);
        if (user && delta_bintang) {
          user.total_bintang = Math.max(0, (user.total_bintang || 0) + delta_bintang);
          user.level = Math.max(1, Math.floor(user.total_bintang / 50) + 1);
        }
        saveLocalState();
        resolve({ status: 'success', message: 'Catatan kebiasaan diperbarui' });
      }
      else if (action === 'klaimMisiSemester') {
        const { user_id, reward_diamond } = payload.data;
        const user = (appData.users || []).find(u => u.user_id === user_id);
        if (user) {
          user.total_diamond = (user.total_diamond || 0) + reward_diamond;
        }
        saveLocalState();
        resolve({ status: 'success', message: `Barakallah! +${reward_diamond} 💎 berhasil diraih!` });
      }
      else {
        resolve({ status: 'success', message: 'Aksi berhasil' });
      }
    }, 250);
  });
}

// ==========================================================================
// 5. RENDERING & UI MANAGERS
// ==========================================================================

function renderAllViews() {
  updateHeaderProfile();
  renderDashboard();
  renderMisi();
  renderTahfizh();
  renderTahsin();
  renderToko();
  applyRoleAccess();
}

function switchPage(pageId, btn) {
  document.querySelectorAll('.page-content').forEach(el => el.classList.add('hidden'));
  const targetPage = document.getElementById('page-' + pageId);
  if (targetPage) targetPage.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(el => {
    el.classList.remove('active', 'text-emerald-600');
    el.classList.add('text-slate-400');
  });

  if (btn) {
    btn.classList.add('active', 'text-emerald-600');
    btn.classList.remove('text-slate-400');
  }
}

function updateHeaderProfile() {
  if (!appData.users || !currentUser) return;
  
  const me = appData.users.find(u => u.user_id === currentUser.user_id) || currentUser;
  currentUser = me;

  const elName = document.getElementById('user-name');
  const elLevel = document.getElementById('user-level');
  const elStar = document.getElementById('user-star');
  const elDiamond = document.getElementById('user-diamond');
  const elImg = document.getElementById('user-img');
  const elRoleBadge = document.getElementById('user-role-badge');
  const elGreeting = document.getElementById('dash-greeting-name');
  const elTokoDiamond = document.getElementById('toko-user-diamond');

  if (elName) elName.innerText = me.nama || 'Pengguna';
  if (elGreeting) elGreeting.innerText = me.nama || 'Sahabat Qur\'an';
  if (elLevel) elLevel.innerText = me.role === 'siswa' ? `Level ${me.level || 1}` : (me.role === 'guru' ? 'Pengajar' : 'Pimpinan');
  if (elStar) elStar.innerText = me.total_bintang || 0;
  if (elDiamond) elDiamond.innerText = me.total_diamond || 0;
  if (elTokoDiamond) elTokoDiamond.innerText = me.total_diamond || 0;
  if (elImg && me.foto_url) elImg.src = me.foto_url;
  
  if (elRoleBadge) {
    elRoleBadge.innerText = me.role || 'siswa';
    if (me.role === 'guru') {
      elRoleBadge.className = 'absolute -bottom-1 -right-1 text-[8px] bg-blue-600 text-white font-extrabold px-1.5 rounded-full uppercase';
    } else if (me.role === 'kepsek') {
      elRoleBadge.className = 'absolute -bottom-1 -right-1 text-[8px] bg-purple-600 text-white font-extrabold px-1.5 rounded-full uppercase';
    } else {
      elRoleBadge.className = 'absolute -bottom-1 -right-1 text-[8px] bg-amber-400 text-slate-900 font-extrabold px-1 rounded-full uppercase';
    }
  }

  document.querySelectorAll('.select-siswa').forEach(select => {
    select.innerHTML = '';
    const siswas = (appData.users || []).filter(u => u.role === 'siswa');
    if (siswas.length === 0) {
      select.innerHTML = '<option value="">Tidak ada data siswa</option>';
    } else {
      siswas.forEach(s => {
        const isSelected = (s.user_id === me.user_id) ? 'selected' : '';
        select.innerHTML += `<option value="${s.user_id}" ${isSelected}>${s.nama} (${s.user_id})</option>`;
      });
    }
  });
}

function renderDashboard() {
  if (!appData.users) return;

  const userTahfizh = (appData.tahfizh || []).filter(i => i.user_id === currentUser.user_id);
  const userTahsin = (appData.tahsin || []).filter(i => i.user_id === currentUser.user_id);
  const totalSetoran = userTahfizh.length + userTahsin.length;
  const mutqinCount = userTahfizh.filter(i => i.hasil === 'Mutqin').length + userTahsin.filter(i => i.hasil === 'Mutqin').length;
  const mutqinPersen = totalSetoran > 0 ? Math.round((mutqinCount / totalSetoran) * 100) : 0;

  const statSetoran = document.getElementById('stat-total-setoran');
  const statMutqin = document.getElementById('stat-mutqin');
  const statPersen = document.getElementById('stat-persen-mutqin');
  if (statSetoran) statSetoran.innerText = totalSetoran;
  if (statMutqin) statMutqin.innerText = mutqinCount;
  if (statPersen) statPersen.innerText = mutqinPersen + '%';

  const siswas = (appData.users || []).filter(u => u.role === 'siswa');
  const topBintang = [...siswas].sort((a, b) => (b.total_bintang || 0) - (a.total_bintang || 0)).slice(0, 3);
  
  const elLeaderPekan = document.getElementById('dash-leader-pekanan');
  if (elLeaderPekan) {
    if (topBintang.length > 0) {
      elLeaderPekan.innerText = `${topBintang[0].nama} (${topBintang[0].total_bintang || 0} ⭐)`;
    } else {
      elLeaderPekan.innerText = 'Belum ada data';
    }
  }

  let htmlBintang = '';
  topBintang.forEach((u, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
    const isJuara1 = idx === 0 ? '<span class="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded ml-1">Kandidat +30 💎</span>' : '';
    htmlBintang += `
      <div class="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <div class="flex items-center space-x-2">
          <span>${medal}</span>
          <span class="font-medium text-slate-700">${u.nama}</span>
          ${isJuara1}
        </div>
        <span class="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">${u.total_bintang || 0} ⭐</span>
      </div>`;
  });
  const elListBintang = document.getElementById('list-top-bintang');
  if (elListBintang) elListBintang.innerHTML = htmlBintang || '<p class="text-slate-400 text-center py-2">Belum ada data siswa</p>';

  const tahfizhCounts = {};
  (appData.tahfizh || []).forEach(item => {
    if (item.hasil === 'Mutqin') {
      tahfizhCounts[item.user_id] = (tahfizhCounts[item.user_id] || 0) + 1;
    }
  });

  const topTahfizh = siswas.map(s => ({
    ...s,
    mutqinCount: tahfizhCounts[s.user_id] || 0
  })).sort((a, b) => b.mutqinCount - a.mutqinCount).slice(0, 3);

  let htmlTahfizh = '';
  topTahfizh.forEach((u, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
    htmlTahfizh += `
      <div class="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <div class="flex items-center space-x-2">
          <span>${medal}</span>
          <span class="font-medium text-slate-700">${u.nama}</span>
        </div>
        <span class="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">${u.mutqinCount} Mutqin</span>
      </div>`;
  });
  const elListTahfizh = document.getElementById('list-top-tahfizh');
  if (elListTahfizh) elListTahfizh.innerHTML = htmlTahfizh || '<p class="text-slate-400 text-center py-2">Belum ada laporan tahfizh</p>';

  const tahsinCounts = {};
  (appData.tahsin || []).forEach(item => {
    if (item.hasil === 'Mutqin') {
      tahsinCounts[item.user_id] = (tahsinCounts[item.user_id] || 0) + 1;
    }
  });

  const topTahsin = siswas.map(s => ({
    ...s,
    mutqinCount: tahsinCounts[s.user_id] || 0
  })).sort((a, b) => b.mutqinCount - a.mutqinCount).slice(0, 3);

  let htmlTahsin = '';
  topTahsin.forEach((u, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
    htmlTahsin += `
      <div class="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
        <div class="flex items-center space-x-2">
          <span>${medal}</span>
          <span class="font-medium text-slate-700">${u.nama}</span>
        </div>
        <span class="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">${u.mutqinCount} Mutqin</span>
      </div>`;
  });
  const elListTahsin = document.getElementById('list-top-tahsin');
  if (elListTahsin) elListTahsin.innerHTML = htmlTahsin || '<p class="text-slate-400 text-center py-2">Belum ada laporan tahsin</p>';
}

// ==========================================================================
// 6. HALAMAN MISI (DUKUNGAN DROPDOWN GROUPS & PENALTI)
// ==========================================================================

function switchMisiSubTab(tab) {
  const btnHarian = document.getElementById('tab-misi-harian-btn');
  const btnSemester = document.getElementById('tab-misi-semester-btn');
  const viewHarian = document.getElementById('subtab-misi-harian');
  const viewSemester = document.getElementById('subtab-misi-semester');

  if (tab === 'harian') {
    btnHarian.className = 'flex-1 py-1.5 rounded-lg bg-white text-emerald-700 shadow-sm transition-all text-center';
    btnSemester.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 transition-all text-center';
    viewHarian.classList.remove('hidden');
    viewSemester.classList.add('hidden');
  } else {
    btnSemester.className = 'flex-1 py-1.5 rounded-lg bg-white text-blue-700 shadow-sm transition-all text-center';
    btnHarian.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 transition-all text-center';
    viewSemester.classList.remove('hidden');
    viewHarian.classList.add('hidden');
  }
}

function filterHeadlineWaktu(waktu, btn) {
  activeFilterWaktuMisi = waktu;
  document.querySelectorAll('.filter-waktu-btn').forEach(b => {
    b.className = 'filter-waktu-btn px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-[11px]';
  });
  if (btn) {
    btn.className = 'filter-waktu-btn px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]';
  }
  renderMisi();
}

function getTodayChecklistKey() {
  const today = new Date().toISOString().split('T')[0];
  return `${today}_${currentUser.user_id}`;
}

function getTodayChecklistState() {
  if (!appData.checklist_harian) appData.checklist_harian = {};
  const key = getTodayChecklistKey();
  
  // Normalisasi data jika masih format array lama
  if (Array.isArray(appData.checklist_harian[key])) {
    appData.checklist_harian[key] = {
      checks: appData.checklist_harian[key],
      dropdowns: {}
    };
  } else if (!appData.checklist_harian[key]) {
    appData.checklist_harian[key] = {
      checks: [],
      dropdowns: {}
    };
  }

  return appData.checklist_harian[key];
}

function renderMisi() {
  render40HeadlineMisi();
  renderMisiSemesteran();
}

function render40HeadlineMisi() {
  const container = document.getElementById('list-40-headline-misi');
  if (!container) return;

  const state = getTodayChecklistState();
  const completedChecks = state.checks || [];
  const selectedDropdowns = state.dropdowns || {};

  let filtered = DAFTAR_40_HEADLINE;
  if (activeFilterWaktuMisi !== 'all') {
    filtered = DAFTAR_40_HEADLINE.filter(h => h.waktu === activeFilterWaktuMisi);
  }

  // Hitung total progres dan bintang hari ini
  let completedHeadlineCount = 0;
  let totalBintangEarnedToday = 0;

  DAFTAR_40_HEADLINE.forEach(hl => {
    let hlDone = true;
    let hlHasItems = false;

    hl.submisi.forEach(item => {
      hlHasItems = true;
      if (item.tipe === 'dropdown') {
        const chosenId = selectedDropdowns[item.id];
        if (!chosenId) {
          hlDone = false;
        } else {
          const opt = item.opsi.find(o => o.id === chosenId);
          if (opt) totalBintangEarnedToday += opt.bintang;
        }
      } else {
        if (completedChecks.includes(item.id)) {
          totalBintangEarnedToday += item.bintang;
        } else {
          hlDone = false;
        }
      }
    });

    if (hlHasItems && hlDone) {
      completedHeadlineCount++;
    }
  });

  const elProgressText = document.getElementById('misi-harian-progress-text');
  const elStarEarned = document.getElementById('misi-harian-star-earned');
  if (elProgressText) elProgressText.innerText = `${completedHeadlineCount} dari 40 Headline Selesai`;
  if (elStarEarned) elStarEarned.innerText = `${totalBintangEarnedToday >= 0 ? '+' : ''}${totalBintangEarnedToday} ⭐ Hari Ini`;

  let html = '';
  filtered.forEach(hl => {
    let totalItems = 0;
    let doneItems = 0;

    let subHtml = '';
    hl.submisi.forEach(item => {
      totalItems++;

      // KASUS 1: DROPDOWN GROUP
      if (item.tipe === 'dropdown') {
        const chosenId = selectedDropdowns[item.id] || '';
        const isChosen = !!chosenId;
        if (isChosen) doneItems++;

        const currentChosenOpt = item.opsi.find(o => o.id === chosenId);
        const currentPoints = currentChosenOpt ? currentChosenOpt.bintang : 0;

        let optionsHtml = `<option value="">-- Pilih ${item.label} --</option>`;
        item.opsi.forEach(opt => {
          const sign = opt.bintang >= 0 ? '+' : '';
          const isSelected = opt.id === chosenId ? 'selected' : '';
          optionsHtml += `<option value="${opt.id}" ${isSelected}>${opt.judul} (${sign}${opt.bintang} ⭐)</option>`;
        });

        subHtml += `
          <div class="dropdown-group-box ${isChosen ? 'filled' : ''} space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-700 flex items-center space-x-1">
                <span>📋</span>
                <span>${item.label}</span>
              </span>
              <span class="text-[10px] font-bold ${isChosen ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded' : 'text-slate-400'}">
                ${isChosen ? `+${currentPoints} ⭐` : 'Wajib Pilih'}
              </span>
            </div>
            <select class="dropdown-group-select" onchange="handleDropdownChange('${hl.id}', '${item.id}', this)">
              ${optionsHtml}
            </select>
          </div>
        `;
      } 
      // KASUS 2: CHECKBOX REGULER
      else {
        const isChecked = completedChecks.includes(item.id);
        if (isChecked) doneItems++;

        const isPenalty = item.bintang < 0;
        const sign = item.bintang > 0 ? '+' : '';
        const badgeColor = isPenalty 
          ? 'text-rose-700 bg-rose-100 border border-rose-200' 
          : 'text-amber-700 bg-amber-50 border border-amber-200';

        subHtml += `
          <div class="submisi-item flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50/80 transition-all ${isPenalty ? 'penalty' : ''} ${isChecked ? 'checked' : ''}">
            <label class="flex items-center space-x-2.5 flex-1 cursor-pointer">
              <input type="checkbox" class="submisi-checkbox" ${isChecked ? 'checked' : ''} onchange="toggleSubmisiCheck('${item.id}', ${item.bintang}, this)">
              <span class="submisi-title text-xs font-medium ${isPenalty ? 'text-rose-800' : 'text-slate-700'} leading-snug">
                ${isPenalty ? '⚠️ ' : ''}${item.judul}
              </span>
            </label>
            <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ml-2 whitespace-nowrap ${badgeColor}">
              ${sign}${item.bintang} ⭐
            </span>
          </div>
        `;
      }
    });

    const isAllDone = totalItems > 0 && doneItems === totalItems;
    const iconSvg = getHeadlineIconSvg(hl);

    html += `
      <div id="headline-card-${hl.id}" class="headline-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
        <div onclick="toggleHeadlineAccordion('${hl.id}')" class="p-3 cursor-pointer flex items-center justify-between hover:bg-slate-50/50">
          <div class="flex items-center space-x-2.5">
            ${iconSvg}
            <div>
              <div class="flex items-center space-x-1.5">
                <span class="text-[10px] font-bold text-slate-400">#${hl.no}</span>
                <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${hl.waktu === 'Pagi' ? 'bg-amber-100 text-amber-800' : hl.waktu === 'Siang' ? 'bg-blue-100 text-blue-800' : hl.waktu === 'Sore' ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'}">${hl.waktu}</span>
              </div>
              <h3 class="font-bold text-xs text-slate-800 leading-snug mt-0.5">${hl.judul}</h3>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-[10px] font-bold ${isAllDone ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'} px-2 py-0.5 rounded-full">
              ${isAllDone ? '✓ Lengkap' : `${doneItems}/${totalItems}`}
            </span>
            <svg class="chevron-icon w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <div class="headline-content border-t border-slate-100 px-3 py-2.5 space-y-2">
          ${subHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function toggleHeadlineAccordion(headlineId) {
  const card = document.getElementById(`headline-card-${headlineId}`);
  if (card) {
    card.classList.toggle('open');
  }
}

// Handler Dropdown Group Selection
async function handleDropdownChange(headlineId, groupId, selectElement) {
  if (currentUser.role !== 'siswa' && currentUser.role !== 'guru') {
    showToast('Hanya siswa atau guru yang dapat memilih opsi!', 'info');
    return;
  }

  const newSubId = selectElement.value;
  const state = getTodayChecklistState();
  if (!state.dropdowns) state.dropdowns = {};

  const oldSubId = state.dropdowns[groupId] || '';

  // Cari Headline dan Group
  const hl = DAFTAR_40_HEADLINE.find(h => h.id === headlineId);
  const group = hl?.submisi.find(s => s.id === groupId);
  if (!group || !group.opsi) return;

  const oldOpt = group.opsi.find(o => o.id === oldSubId);
  const newOpt = group.opsi.find(o => o.id === newSubId);

  const oldPoints = oldOpt ? oldOpt.bintang : 0;
  const newPoints = newOpt ? newOpt.bintang : 0;
  const delta = newPoints - oldPoints;

  // Simpan pilihan ke state lokal
  if (newSubId) {
    state.dropdowns[groupId] = newSubId;
  } else {
    delete state.dropdowns[groupId];
  }
  saveLocalState();

  // Update total bintang siswa
  if (delta !== 0) {
    const user = appData.users.find(u => u.user_id === currentUser.user_id);
    if (user) {
      user.total_bintang = Math.max(0, (user.total_bintang || 0) + delta);
      user.level = Math.max(1, Math.floor(user.total_bintang / 50) + 1);
      currentUser = { ...user };
    }
  }

  if (newOpt) {
    const sign = delta >= 0 ? '+' : '';
    showToast(`${group.label}: ${newOpt.judul} (${sign}${delta} ⭐)`, delta >= 0 ? 'success' : 'info');
  } else {
    showToast(`${group.label} direset (${delta} ⭐)`, 'info');
  }

  // Kirim ke backend/script
  await sendDataToScript({
    action: 'toggleDropdownOption',
    data: {
      user_id: currentUser.user_id,
      date: new Date().toISOString().split('T')[0],
      group_id: groupId,
      submisi_id: newSubId,
      delta_bintang: delta
    }
  });

  updateHeaderProfile();
  renderDashboard();
  render40HeadlineMisi();
}

// Handler Checkbox Reguler
async function toggleSubmisiCheck(submisiId, bintang, checkbox) {
  if (currentUser.role !== 'siswa' && currentUser.role !== 'guru') {
    showToast('Hanya siswa atau guru yang dapat mencatat kebiasaan harian!', 'info');
    checkbox.checked = !checkbox.checked;
    return;
  }

  const isChecked = checkbox.checked;
  const state = getTodayChecklistState();
  if (!state.checks) state.checks = [];

  const list = state.checks;
  let delta = 0;

  if (isChecked) {
    if (!list.includes(submisiId)) list.push(submisiId);
    delta = bintang;
    if (bintang < 0) {
      showToast(`Peringatan: Poin berkurang ${bintang} ⭐`, 'error');
    } else {
      showToast(`Alhamdulillah! +${bintang} ⭐ diraih!`, 'success');
    }
  } else {
    const idx = list.indexOf(submisiId);
    if (idx !== -1) list.splice(idx, 1);
    delta = -bintang;
    showToast(`Centang dibatalkan (${delta >= 0 ? '+' : ''}${delta} ⭐)`, 'info');
  }

  saveLocalState();

  // Update poin siswa
  const user = appData.users.find(u => u.user_id === currentUser.user_id);
  if (user) {
    user.total_bintang = Math.max(0, (user.total_bintang || 0) + delta);
    user.level = Math.max(1, Math.floor(user.total_bintang / 50) + 1);
    currentUser = { ...user };
  }

  await sendDataToScript({
    action: 'toggleChecklist',
    data: {
      user_id: currentUser.user_id,
      date: new Date().toISOString().split('T')[0],
      submisi_id: submisiId,
      is_checked: isChecked,
      delta_bintang: delta
    }
  });

  updateHeaderProfile();
  renderDashboard();
  render40HeadlineMisi();
}

function renderMisiSemesteran() {
  const container = document.getElementById('list-misi-semester');
  if (!container) return;

  let html = '';
  DAFTAR_MISI_SEMESTER.forEach(m => {
    html += `
      <div class="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between touch-card">
        <div class="flex items-start space-x-2.5 flex-1 pr-2">
          <span class="text-2xl pt-0.5">${m.icon}</span>
          <div>
            <h3 class="font-bold text-xs text-slate-800 leading-snug">${m.judul}</h3>
            <p class="text-[10px] text-slate-500 mt-0.5 leading-relaxed">${m.deskripsi}</p>
          </div>
        </div>
        <div class="text-right flex flex-col items-end space-y-1">
          <div class="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
            +${m.reward_diamond} 💎
          </div>
          <button onclick="promptKlaimMisiSemester('${m.id}', ${m.reward_diamond}, '${m.judul}')" class="text-[10px] font-bold text-blue-600 hover:text-blue-700 active:scale-95 bg-blue-50 px-2.5 py-1 rounded-lg">
            Klaim
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function promptKlaimMisiSemester(misiId, diamond, judul) {
  if (currentUser.role !== 'siswa') {
    showToast('Hanya akun siswa yang dapat mengklaim reward misi semester!', 'info');
    return;
  }

  const konfirmasi = confirm(`Klaim reward ${diamond} 💎 untuk misi semesteran "${judul}"? Pastikan ustadz telah memvalidasi kelulusan Anda.`);
  if (!konfirmasi) return;

  const res = await sendDataToScript({
    action: 'klaimMisiSemester',
    data: {
      user_id: currentUser.user_id,
      misi_id: misiId,
      reward_diamond: diamond
    }
  });

  showToast(res.message || `Barakallah! +${diamond} 💎 berhasil ditambahkan!`, 'success');
  updateHeaderProfile();
  renderDashboard();
  renderToko();
}

// ==========================================================================
// 7. HALAMAN TAHFIZH & TAHSIN (MURNI JURNAL - TANPA REWARD BINTANG)
// ==========================================================================

function filterTahfizh(filterType, btn) {
  activeFilterTahfizh = filterType;
  document.querySelectorAll('.filter-tfz-btn').forEach(b => {
    b.className = 'filter-tfz-btn px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-[11px]';
  });
  if (btn) {
    btn.className = 'filter-tfz-btn px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold text-[11px]';
  }
  renderTahfizh();
}

function renderTahfizh() {
  if (!appData.tahfizh) return;
  let list = appData.tahfizh;

  if (currentUser.role === 'siswa') {
    list = list.filter(i => i.user_id === currentUser.user_id);
  }

  if (activeFilterTahfizh !== 'all') {
    list = list.filter(i => i.hasil === activeFilterTahfizh);
  }

  const badgeCount = document.getElementById('badge-tahfizh-count');
  if (badgeCount) badgeCount.innerText = `${list.length} Laporan`;

  let html = '';
  list.forEach(item => {
    let statusBadge = '';
    if (item.hasil === 'Mutqin') {
      statusBadge = '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">Mutqin</span>';
    } else if (item.hasil === 'Jayyid') {
      statusBadge = '<span class="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">Jayyid</span>';
    } else {
      statusBadge = '<span class="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">Mardud</span>';
    }

    const siswaName = (appData.users || []).find(u => u.user_id === item.user_id)?.nama || item.user_id;
    const katBadge = item.kategori ? `<span class="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mr-1">${item.kategori}</span>` : '';

    html += `
      <div class="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5 touch-card">
        <div class="flex justify-between items-start">
          <div>
            ${currentUser.role !== 'siswa' ? `<div class="text-[10px] font-bold text-emerald-700 mb-0.5">👤 ${siswaName}</div>` : ''}
            <div>
              ${katBadge}
              <h3 class="font-bold text-xs text-slate-800 inline-block">${item.surah} (Ayat ${item.ayat})</h3>
            </div>
          </div>
          ${statusBadge}
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
          <span>📅 ${item.tanggal || '-'}</span>
          <span>Dicatat oleh: ${item.input_by === currentUser.user_id ? 'Saya' : (item.input_by || 'Ustadz')}</span>
        </div>
        ${item.catatan_perbaikan ? `
          <div class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-1 border border-slate-100">
            <span class="font-bold text-slate-700">Catatan Tajwid:</span> ${item.catatan_perbaikan}
          </div>` : ''}
      </div>`;
  });

  const elListTahfizh = document.getElementById('list-tahfizh');
  if (elListTahfizh) elListTahfizh.innerHTML = html || '<div class="text-center py-6 text-slate-400 text-xs">Belum ada laporan tahfizh pada kategori ini.</div>';
}

function filterTahsin(filterType, btn) {
  activeFilterTahsin = filterType;
  document.querySelectorAll('.filter-ths-btn').forEach(b => {
    b.className = 'filter-ths-btn px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-[11px]';
  });
  if (btn) {
    btn.className = 'filter-ths-btn px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold text-[11px]';
  }
  renderTahsin();
}

function renderTahsin() {
  if (!appData.tahsin) return;
  let list = appData.tahsin;

  if (currentUser.role === 'siswa') {
    list = list.filter(i => i.user_id === currentUser.user_id);
  }

  if (activeFilterTahsin !== 'all') {
    list = list.filter(i => i.hasil === activeFilterTahsin);
  }

  const badgeCount = document.getElementById('badge-tahsin-count');
  if (badgeCount) badgeCount.innerText = `${list.length} Laporan`;

  let html = '';
  list.forEach(item => {
    let statusBadge = '';
    if (item.hasil === 'Mutqin') {
      statusBadge = '<span class="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">Mutqin</span>';
    } else {
      statusBadge = '<span class="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">Mengulang</span>';
    }

    const siswaName = (appData.users || []).find(u => u.user_id === item.user_id)?.nama || item.user_id;
    const katBadge = item.kategori ? `<span class="text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mr-1">${item.kategori}</span>` : '';

    html += `
      <div class="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 space-y-1.5 touch-card">
        <div class="flex justify-between items-start">
          <div>
            ${currentUser.role !== 'siswa' ? `<div class="text-[10px] font-bold text-blue-700 mb-0.5">👤 ${siswaName}</div>` : ''}
            <div>
              ${katBadge}
              <h3 class="font-bold text-xs text-slate-800 inline-block">${item.jilid_buku} - Hal ${item.halaman}</h3>
            </div>
          </div>
          ${statusBadge}
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
          <span>📅 ${item.tanggal || '-'}</span>
          <span>Dicatat oleh: ${item.input_by === currentUser.user_id ? 'Saya' : (item.input_by || 'Ustadz')}</span>
        </div>
        ${item.catatan_perbaikan ? `
          <div class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-1 border border-slate-100">
            <span class="font-bold text-slate-700">Catatan Bacaan:</span> ${item.catatan_perbaikan}
          </div>` : ''}
      </div>`;
  });

  const elListTahsin = document.getElementById('list-tahsin');
  if (elListTahsin) elListTahsin.innerHTML = html || '<div class="text-center py-6 text-slate-400 text-xs">Belum ada laporan tahsin pada kategori ini.</div>';
}

// ==========================================================================
// 8. HALAMAN TOKO HADIAH
// ==========================================================================

function renderToko() {
  const container = document.getElementById('list-toko');
  if (!container) return;

  const catalog = (appData.toko && appData.toko.length === 10) ? appData.toko : DAFTAR_TOKO_BARANG;
  appData.toko = catalog;

  let html = '';
  catalog.forEach(t => {
    const isAffordable = (currentUser.total_diamond || 0) >= t.harga_diamond && t.stok > 0;
    const btnStyle = isAffordable 
      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer active:scale-95'
      : 'bg-slate-200 text-slate-400 cursor-not-allowed';

    html += `
      <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between touch-card">
        <div>
          <div class="w-full h-16 bg-amber-50/60 rounded-xl mb-2 flex items-center justify-center text-3xl">
            ${t.icon || '🎁'}
          </div>
          <h3 class="font-bold text-xs text-slate-800 leading-snug line-clamp-1">${t.nama_hadiah}</h3>
          <p class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">${t.desc || ''}</p>
          <div class="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
            <span>Stok: <b class="${t.stok > 0 ? 'text-slate-700' : 'text-rose-500'}">${t.stok}</b></span>
            <span class="font-bold text-amber-600">${t.harga_diamond} 💎</span>
          </div>
        </div>
        <button onclick="promptTukarHadiah('${t.id}')" ${!isAffordable ? 'disabled' : ''} class="w-full mt-2.5 py-1.5 font-bold text-[10px] rounded-xl shadow-sm transition-all ${btnStyle}">
          ${t.stok === 0 ? 'Stok Habis' : `${t.harga_diamond} 💎 Tukar`}
        </button>
      </div>`;
  });

  container.innerHTML = html;
}

function promptTukarHadiah(hadiahId) {
  const hadiah = (appData.toko || []).find(t => t.id === hadiahId);
  if (!hadiah) return;

  if ((currentUser.total_diamond || 0) < hadiah.harga_diamond) {
    showToast(`Diamond kamu belum cukup! Butuh ${hadiah.harga_diamond} 💎`, 'error');
    return;
  }

  selectedHadiahForRedeem = hadiah;

  const modal = document.getElementById('modalTukarHadiah');
  document.getElementById('tukar-icon').innerText = hadiah.icon || '🎁';
  document.getElementById('tukar-title').innerText = `Tukar ${hadiah.nama_hadiah}?`;
  document.getElementById('tukar-desc').innerText = `Stok tersisa: ${hadiah.stok}. Saldo diamond kamu saat ini: ${currentUser.total_diamond} 💎.`;
  document.getElementById('tukar-cost').innerText = `${hadiah.harga_diamond} 💎`;

  const btnConfirm = document.getElementById('btn-confirm-tukar');
  btnConfirm.onclick = executeTukarHadiah;

  tutupSemuaModal();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

async function executeTukarHadiah() {
  if (!selectedHadiahForRedeem) return;

  const btnConfirm = document.getElementById('btn-confirm-tukar');
  btnConfirm.disabled = true;
  btnConfirm.innerHTML = '<span class="btn-spinner"></span> Memproses...';

  try {
    const res = await sendDataToScript({
      action: 'tukarHadiah',
      data: {
        user_id: currentUser.user_id,
        hadiah_id: selectedHadiahForRedeem.id
      }
    });

    showToast(res.message || 'Hadiah berhasil ditukarkan!', 'success');
    tutupSemuaModal();
    updateHeaderProfile();
    renderToko();
  } catch (err) {
    console.error('Error tukar hadiah:', err);
    showToast('Gagal menukar hadiah: ' + err.message, 'error');
  } finally {
    btnConfirm.disabled = false;
    btnConfirm.innerText = 'Tukar Sekarang';
    selectedHadiahForRedeem = null;
  }
}

// ==========================================================================
// 9. SUBMIT FORM TAHFIZH & TAHSIN
// ==========================================================================

function openModalPilihan() {
  tutupSemuaModal();
  const el = document.getElementById('modalPilihan');
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }
}

function bukaForm(jenis) {
  tutupSemuaModal();
  const today = new Date().toISOString().split('T')[0];

  if (jenis === 'tahfizh') {
    const tgl = document.getElementById('tfz-tanggal');
    if (tgl) tgl.value = today;
    const m = document.getElementById('modalTahfizh');
    if (m) {
      m.classList.remove('hidden');
      m.classList.add('flex');
    }
  } else if (jenis === 'tahsin') {
    const tgl = document.getElementById('ths-tanggal');
    if (tgl) tgl.value = today;
    const m = document.getElementById('modalTahsin');
    if (m) {
      m.classList.remove('hidden');
      m.classList.add('flex');
    }
  }
}

function tutupSemuaModal() {
  const modals = ['modalPilihan', 'modalTahfizh', 'modalTahsin', 'modalTukarHadiah', 'modalUserSwitch', 'modalPengaturan'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });
}

function handleBackdropClick(e, modalId) {
  if (e.target.id === modalId) {
    tutupSemuaModal();
  }
}

async function submitFormTahfizh() {
  const btn = document.getElementById('btn-submit-tfz');
  const surah = document.getElementById('tfz-surah')?.value.trim();
  const ayat = document.getElementById('tfz-ayat')?.value.trim();
  const userId = document.getElementById('tfz-user')?.value || currentUser.user_id;

  if (!surah || !ayat) {
    showToast('Mohon lengkapi nama Surah dan Ayat!', 'error');
    return;
  }

  const payloadData = {
    tanggal: document.getElementById('tfz-tanggal')?.value || new Date().toISOString().split('T')[0],
    user_id: userId,
    surah: surah,
    ayat: ayat,
    kategori: document.getElementById('tfz-kategori')?.value || 'Ziyadah',
    hasil: document.getElementById('tfz-hasil')?.value || 'Mutqin',
    catatan_perbaikan: document.getElementById('tfz-catatan')?.value.trim() || '',
    input_by: currentUser.user_id
  };

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="btn-spinner"></span> Menyimpan...';

  try {
    const res = await sendDataToScript({
      action: 'simpanTahfizh',
      data: payloadData
    });

    showToast(res.message || 'Laporan Tahfizh berhasil dicatat!', 'success');
    
    document.getElementById('tfz-surah').value = '';
    document.getElementById('tfz-ayat').value = '';
    document.getElementById('tfz-catatan').value = '';

    tutupSemuaModal();
    renderTahfizh();
    renderDashboard();
  } catch (err) {
    console.error('Error simpan tahfizh:', err);
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

async function submitFormTahsin() {
  const btn = document.getElementById('btn-submit-ths');
  const jilid = document.getElementById('ths-jilid')?.value.trim();
  const halaman = document.getElementById('ths-halaman')?.value.trim();
  const userId = document.getElementById('ths-user')?.value || currentUser.user_id;

  if (!jilid || !halaman) {
    showToast('Mohon lengkapi Jilid / Buku dan Halaman!', 'error');
    return;
  }

  const payloadData = {
    tanggal: document.getElementById('ths-tanggal')?.value || new Date().toISOString().split('T')[0],
    user_id: userId,
    jilid_buku: jilid,
    halaman: halaman,
    kategori: document.getElementById('ths-kategori')?.value || 'Setoran',
    hasil: document.getElementById('ths-hasil')?.value || 'Mutqin',
    catatan_perbaikan: document.getElementById('ths-catatan')?.value.trim() || '',
    input_by: currentUser.user_id
  };

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<span class="btn-spinner"></span> Menyimpan...';

  try {
    const res = await sendDataToScript({
      action: 'simpanTahsin',
      data: payloadData
    });

    showToast(res.message || 'Laporan Tahsin berhasil dicatat!', 'success');

    document.getElementById('ths-jilid').value = '';
    document.getElementById('ths-halaman').value = '';
    document.getElementById('ths-catatan').value = '';

    tutupSemuaModal();
    renderTahsin();
    renderDashboard();
  } catch (err) {
    console.error('Error simpan tahsin:', err);
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

// ==========================================================================
// 10. USER SWITCHER & ROLE ACCESS
// ==========================================================================

function applyRoleAccess() {
  const fab = document.getElementById('fab-add');
  if (!fab) return;

  if (currentUser.role === 'kepsek') {
    fab.classList.add('hidden');
  } else {
    fab.classList.remove('hidden');
  }
}

function openModalUserSwitch() {
  tutupSemuaModal();
  const listContainer = document.getElementById('list-user-switcher');
  if (!listContainer) return;

  let html = '';
  (appData.users || []).forEach(u => {
    const isActive = u.user_id === currentUser.user_id;
    const roleBadge = u.role === 'guru' 
      ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Ustadz/Guru</span>'
      : u.role === 'kepsek'
      ? '<span class="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">Kepsek</span>'
      : '<span class="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Siswa</span>';

    html += `
      <div onclick="switchUser('${u.user_id}')" class="p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isActive ? 'border-emerald-500 bg-emerald-50/70' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}">
        <div class="flex items-center space-x-2.5">
          <img src="${u.foto_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-8 h-8 rounded-full object-cover">
          <div>
            <div class="font-bold text-xs text-slate-800">${u.nama}</div>
            <div class="flex items-center space-x-1.5 mt-0.5">
              ${roleBadge}
              ${u.role === 'siswa' ? `<span class="text-[10px] text-slate-400">Level ${u.level || 1} &bull; ${u.total_bintang || 0} ⭐ &bull; ${u.total_diamond || 0} 💎</span>` : ''}
            </div>
          </div>
        </div>
        ${isActive ? '<span class="text-emerald-600 font-bold text-xs">Aktif</span>' : ''}
      </div>`;
  });

  listContainer.innerHTML = html;
  const modal = document.getElementById('modalUserSwitch');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function switchUser(userId) {
  const target = (appData.users || []).find(u => u.user_id === userId);
  if (target) {
    currentUser = target;
    localStorage.setItem(CONFIG.USER_KEY, userId);
    tutupSemuaModal();
    renderAllViews();
    showToast(`Beralih akun ke: ${target.nama} (${target.role})`, 'info');
  }
}

// ==========================================================================
// 11. PENGATURAN KONEKSI SPREADSHEET
// ==========================================================================

function openModalPengaturan() {
  tutupSemuaModal();
  const inputUrl = document.getElementById('cfg-script-url');
  if (inputUrl) inputUrl.value = CONFIG.SCRIPT_URL;
  const modal = document.getElementById('modalPengaturan');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function simpanPengaturanUrl() {
  const inputUrl = document.getElementById('cfg-script-url');
  const url = inputUrl ? inputUrl.value.trim() : '';

  CONFIG.SCRIPT_URL = url;
  localStorage.setItem('SEKALI_SCRIPT_URL', url);

  updateConnectionBanner();
  tutupSemuaModal();

  if (url) {
    showToast('URL Spreadsheet disimpan! Menghubungkan...', 'info');
    fetchDataFromSheet(true);
  } else {
    showToast('Mode demo diaktifkan (tanpa Google Sheets)', 'info');
    renderAllViews();
  }
}

function resetToDemo() {
  localStorage.removeItem('SEKALI_SCRIPT_URL');
  localStorage.removeItem(CONFIG.STORAGE_KEY);
  CONFIG.SCRIPT_URL = '';
  appData = { ...DEFAULT_MOCK_DATA };
  currentUser = DEFAULT_MOCK_DATA.users[0];

  updateConnectionBanner();
  tutupSemuaModal();
  renderAllViews();
  showToast('Data dikembalikan ke pengaturan awal mode demo.', 'info');
}

// ==========================================================================
// 12. TOAST NOTIFICATION UTILITY
// ==========================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <span>${icon}</span>
      <span>${message}</span>
    </div>
    <button class="text-white/60 hover:text-white ml-2 text-base leading-none" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
