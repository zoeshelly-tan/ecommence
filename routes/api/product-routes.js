const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { sync } = require('../../models/Tag');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProduct = await Product.findAll({
      include: [
        {
          model: Category,
          attribute: ['category_name'],
        },
        {
          model: Tag,
          attribute: ['tag_name'],
        }
      ]
    })
    res.status(200).json(allProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: {
        model: Category,
        attribute: ['product_id'],
      }
    })
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  //create a product
  //send product to res

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        console.log("hello")
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update({ product_id: req.body.product_id },
    { where: { id: req.params.id } },
  )
    .then((productData) => {
      if (!productData) {
        res.status(404).json({ message: "There is no match product" });
        return;
      }
      res.json(productData)
    }).catch(err => res.status(500).json(err))
});
//   // update product date
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       // find all associated tags from ProductTag
//       return ProductTag.findById({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
//       // get list of current tag_ids
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
//       // create filtered list of new tag_ids
//       const newProductTags = req.body.tagIds
//         .filter((tag_id) => !productTagIds.includes(tag_id))
//         .map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    await Product.destroy({
      where: { id: req.params.id },
    })
      .then(productData => {
        if (!productData) {
          res.status(404).json({ message: "There is no product found under this ID" });
          return;
        }
        res.json(productData);
      })
  }
  catch (err) {
    res.status(500).json
  }
});

module.exports = router;