const router = require('express').Router();
const { Category, Product } = require('../../models');
const { request } = require("express");

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const allCategory = await Category.findAll({
      include: [{
        model: Product,
        attribute: ['product_name', 'id', 'price', 'stock', 'category_id']
      }]
    })
    res.status(200).json(allCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  };
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: {
        model: Product,
        attribute: ['category_id'],
      },
    })
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(err => res.status(500).json(err))
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    let categoryData = await Category.update({ category_name: req.body.category_name },
      { where: { id: req.params.id } },
    )
    if (!categoryData) {
      res.status(404).json({ message: "There is no category found under this ID." });
      return;
    }
    res.json(categoryData)
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    await Category.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(categoryData => {
        if (!categoryData) {
          res.status(404).json({ message: "There is no category found under this ID." });
          return;
        }
        res.json(categoryData);
      })

  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
