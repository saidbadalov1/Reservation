import multer from "multer";
import path from "path";
import fs from "fs";

// Yükleme klasörü oluştur
const uploadsDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Depolama ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Dosya adındaki boşlukları ve özel karakterleri temizle
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, "profile-" + uniqueSuffix + extension);
  },
});

// Dosya filtresi
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Sadece resim dosyalarını kabul et
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Sadəcə şəkil faylları yükləyə bilərsiniz"));
  }
};

// Multer upload nesnesi
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
