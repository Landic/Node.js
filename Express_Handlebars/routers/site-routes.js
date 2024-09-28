import {Router} from "express";
import { products } from "../data/products.js";
import { createProduct } from "../middlewars/product-middleware.js";
const siteRouter = Router();

siteRouter.route('/').get((req,res)=>{
    res.status(200).json(products);
})
.post(createProduct, (req,res)=>{
    res.status(201).json(req.new_product);
});

siteRouter.get('/:id', (req,res,next)=>{
    const id = +req.params.id;
    if(!isNaN(id)){
        res.status(200).json(products.find((el)=>el.id === id));
    }
    next();
});

export default siteRouter;