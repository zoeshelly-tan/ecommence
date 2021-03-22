const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
   await Category.findAll({
      include:{
        model: Product,
        attribute:['product_name','id','price','stock','category_id']
      }
    }).then ((categoryData)=>res.json(categoryData))
  } catch(err) {
      console.log(err);
      res.status(500).json(err);
    };
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    await Category.findOne({ where:{id:req.params.id },
    include:{
      model:Product,
      attribute:['category_id'],
    },
    })
    .then((categoryData)=>res.json(categoryData))
  } catch(err){
    res.status(500).json(err);
  } 
  });

router.post('/', (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create({
      ...req.body,
      category_name:req.session.category_name,
    });
    res.status(200).json(newCategory);    
  } catch (err){
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  try{
    await Category.update({category_name:req.body.category_name},
     { where:{id:req.params.id,}},
)
.then((categoryData)=>{
  if(!categoryData){
    res.status(404).json({message:"There is no category found under this ID."});
    return;
  }
  res.json(categoryData)
})}
catch (err){
  res.status(500).json(err);
}});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try{
    await Category.destroy({
      where:{
        id:req.params.id
      }
    })
    .then(categoryData => {
      if(!categoryData){
        res.status(404).json({message:"There is no category found under this ID."});
        return;
      }
      res.json(categoryData);
    })
    
  }
      catch(err){
        res.status(500).json(err);
  }
});

module.exports = router;
