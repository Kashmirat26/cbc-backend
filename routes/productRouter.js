import express from 'express';
import { createProduct, getProducts, deleteProduct, updateProduct, getProductById, searchProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/",createProduct)
productRouter.get("/", getProducts)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/:productId", getProductById)
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)

export default productRouter;