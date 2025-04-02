import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  console.log('todo: tee kuvakäsittely', req.file);
  if (!req.file) {
    console.log(req.file);
    next();
    return;
  }

  let extension = 'jpg';
  if (req.file.mimetype === 'image/png') {
    // if (req.file.mimetype.includes('/png')) {
    extension = 'png';
  }

  await sharp(req.file.path)
    .resize(100, 100)
    .toFile(`${req.file.path}_thumb.${extension}`);
  console.log(req.file);
  next();
};

export default createThumbnail;
