import multer from "multer";

// for uploading the file to server

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "News-letter"+ "-" + Date.now() + ".pdf");
  },
});

const upload = multer({ storage: storage });

export default upload;
