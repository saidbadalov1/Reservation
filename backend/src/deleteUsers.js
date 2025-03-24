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
    fixUserImages();
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

// Profil fotoğrafı undefined olan veya boş olan kullanıcıları düzelt
async function fixUserImages() {
  try {
    // Profil fotoğrafı undefined veya boş olan kullanıcıları bul
    const usersWithoutImage = await User.find({
      $or: [{ image: { $exists: false } }, { image: null }, { image: "" }],
    }).lean();

    console.log(
      `Profil fotoğrafı olmayan kullanıcı sayısı: ${usersWithoutImage.length}`
    );

    if (usersWithoutImage.length > 0) {
      console.log("Profil fotoğrafı olmayan kullanıcılar:");
      usersWithoutImage.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`
        );
      });

      // Onarımı onayla
      console.log("\nDİKKAT: Bu işlem kullanıcı profillerini güncelleyecek!");
      console.log(
        "Profil fotoğrafı olmayan kullanıcılara varsayılan avatar atanacaktır."
      );
      console.log(
        "Güncelleme işlemini gerçekleştirmek için kodu düzenleyin ve `GUNCELLEME_ONAYI = true` yapın.\n"
      );

      // Güvenlik için varsayılan olarak false
      const GUNCELLEME_ONAYI = true;

      if (GUNCELLEME_ONAYI) {
        // Varsayılan profil fotoğrafını ayarla
        const updateResult = await User.updateMany(
          {
            $or: [
              { image: { $exists: false } },
              { image: null },
              { image: "" },
            ],
          },
          { $set: { image: "/uploads/default-avatar.png" } }
        );

        console.log(
          `${updateResult.modifiedCount} kullanıcının profil fotoğrafı güncellendi.`
        );
      }
    } else {
      console.log("Profil fotoğrafı eksik olan kullanıcı bulunamadı.");
    }

    console.log("\nİşlem tamamlandı.");
    process.exit(0);
  } catch (error) {
    console.error("Kullanıcı profillerini güncellerken hata:", error);
    process.exit(1);
  }
}
