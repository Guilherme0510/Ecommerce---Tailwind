import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js'

// Função para adicionar produto
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Verificando se há arquivos de imagem no request
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    // Upload das imagens usando Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Verifica se sizes está no formato correto e faz a conversão se necessário
    const sizesArray = Array.isArray(sizes) ? sizes : (() => {
      try {
        return JSON.parse(sizes);
      } catch (error) {
        console.error("Error parsing sizes:", error);
        return []; // Retorne um array vazio ou trate o erro conforme necessário
      }
    })();

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: sizesArray, // Aqui usamos o array convertido
      image: imagesUrl,
      date: Date.now()
    }

    console.log("Product Data:", productData);
    
    const product = new productModel(productData);
    await product.save();

    res.json({success: true, message: "Product Added"});
  } catch (error) {
    console.log("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Função para listar produtos
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({success: true, products});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// Função para remover produto
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({success: true, message: "Product Removed"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

// Função para obter informações de um único produto
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({success: true, product});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
