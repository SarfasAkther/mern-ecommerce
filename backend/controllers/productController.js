const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 8
        } = req.query;

        let filter = {};

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            filter.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        // Sorting
        let sortOption = {};

        if (sort === "priceAsc") {
            sortOption.price = 1;
        }

        if (sort === "priceDesc") {
            sortOption.price = -1;
        }

        if (sort === "newest") {
            sortOption._id = -1;
        }

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        // Total matching products
        const totalProducts =
            await Product.countDocuments(filter);

        const totalPages =
            Math.ceil(totalProducts / limitNumber);

        res.json({
            products,
            currentPage: pageNumber,
            totalPages,
            totalProducts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            image: req.body.image
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "mern-ecommerce"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.json({
            imageUrl: result.secure_url
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: id }
        }).limit(4);

        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getRelatedProducts
};