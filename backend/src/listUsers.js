const mongoose = require("mongoose");
const fs = require("fs");

// MongoDB bağlantısı
mongoose
  .connect("mongodb://localhost:27017/reservation-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
    listUsers();
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// User modeli
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    role: String,
    specialty: String,
    image: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// Kullanıcıları listele
async function listUsers() {
  try {
    const users = await User.find({}).lean();

    console.log(`Toplam ${users.length} kullanıcı bulundu.`);

    // Sonuçları bir dosyaya yazdır
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    console.log("Kullanıcılar users.json dosyasına yazıldı.");

    // Telefon numarası olmayan kullanıcıları bul
    const usersWithoutPhone = users.filter((user) => !user.phone);
    console.log(
      `Telefon numarası olmayan kullanıcı sayısı: ${usersWithoutPhone.length}`
    );

    // Profil resmi olmayan veya varsayılan resmi olan kullanıcıları bul
    const usersWithDefaultImage = users.filter(
      (user) => !user.image || user.image === "/uploads/default-avatar.png"
    );
    console.log(
      `Profil resmi olmayan veya varsayılan resmi olan kullanıcı sayısı: ${usersWithDefaultImage.length}`
    );

    // Ayrıntılı bilgileri göster
    users.forEach((user, index) => {
      console.log(`\n--- Kullanıcı ${index + 1} ---`);
      console.log(`ID: ${user._id}`);
      console.log(`Ad: ${user.name || "Belirtilmemiş"}`);
      console.log(`E-posta: ${user.email || "Belirtilmemiş"}`);
      console.log(`Telefon: ${user.phone || "Belirtilmemiş"}`);
      console.log(`Rol: ${user.role || "Belirtilmemiş"}`);
      console.log(`Uzmanlık: ${user.specialty || "Belirtilmemiş"}`);
      console.log(`Profil Resmi: ${user.image || "Belirtilmemiş"}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Kullanıcıları listelerken hata:", error);
    process.exit(1);
  }
}
