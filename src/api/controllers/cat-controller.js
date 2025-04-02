import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  req.body.filename = req.file.filename;
  const result = await addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const result = await modifyCat(req.body, req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(404);
  }
};

const getCatByOwnerId = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const cats = await listAllCats();
    const filteredCats = cats.filter((cat) => cat.ownerId === ownerId);
    if (filteredCats.length > 0) {
      res.json(filteredCats);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.status(500).json({error: 'Internal Server Error'});
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat, getCatByOwnerId};
