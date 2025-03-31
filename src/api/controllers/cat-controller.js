import {addCat, findCatById, listAllCats} from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const {cat_name, weight, owner, birthdate} = req.body;
  const filename = req.file ? req.file.filename : null;

  if (!cat_name || !weight || !owner || !birthdate) {
    return res
      .status(400)
      .json({error: 'All fields except image are required'});
  }

  const newCat = {
    cat_name,
    weight: Number(weight),
    owner: Number(owner),
    filename,
    birthdate,
  };
  const createdCat = addCat(newCat);

  res.status(201).json({message: 'New cat added.', cat_id: createdCat.cat_id});
};

const putCat = (req, res) => {
  // not implemented in this example, this is future homework
  res.json({message: 'Cat item updated.'});
  res.sendStatus(200);
};

const deleteCat = (req, res) => {
  // not implemented in this example, this is future homework
  res.json({message: 'Cat item deleted.'});
  res.sendStatus(200);
};

export {getCat, getCatById, postCat, putCat, deleteCat};
