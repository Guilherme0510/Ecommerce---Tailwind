import userModel from "../models/userModel.js";

// Função para adicionar itens ao carrinho
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, {cartData})

    res.json({success: true, message: "Added To Cart"})

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Função para atualizar o carrinho
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Função para obter os dados do carrinho do usuário
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    let cartData = await userModel.findById(userId);
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
