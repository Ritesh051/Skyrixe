const productModel=require('../models/newproductaddModel');

////////////////search-bar for website for searching category-wise product and from all category as wel

const searchProductCategory=async(req,res)=>{
    try {
        const { search,city } = req.query;
        ////pagination part
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        
        ///check along with search
        if(search){
            const pipeline=[
                {
                    $match:{
                        "productDetails.productname":{ $regex: search, $options: "i" },
                        availableCities:{ $regex: new RegExp(`\\b${city}\\b`, 'i') } 
                    }
                },
                {
                    $sort:{createdAt:-1 }
                },
                {
                    $facet: {
                        data: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{ $count: "count" }]
                    }
                }
            ];

            ///executing pipeline
            const result= await productModel.aggregate(pipeline);
            const product = result[0]?.data || [];
            const totalCount = result[0]?.totalCount[0]?.count || 0;
            const totalPages = Math.ceil(totalCount / limit);
            ///if no product found
            if (product.length === 0) {
                return res.status(200).json({
                message: "No Product found",
                status: 200,
                data: {
                    product: [],
                    meta: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: totalCount,
                        perPage: limit,
                    },
                },
            });
        }
        ///return success
        return res.status(200).json({
            message: "Product retrieved successfully",
            status: 200,
            data: {
                product: product,
                meta: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalCount,
                    perPage: limit,
                },
            },
        });
         }
        // else{
        //    const secondPipeline=[
        //     {
        //         $match:{},
        //         availableCities:{ $regex: new RegExp(`\\b${city}\\b`, 'i') }
        //     },
        //     {
        //         $sort:{createdAt:-1}
        //     },
        //     {
        //         $facet: {
        //             data: [{ $skip: skip }, { $limit: limit }],
        //             totalCount: [{ $count: "count" }]
        //         }
        //     }
        //    ];

        //    ///executing pipeline
        //    const result= await productModel.aggregate(secondPipeline)
        //    const product = result[0]?.data || [];
        //     const totalCount = result[0]?.totalCount[0]?.count || 0;
        //     const totalPages = Math.ceil(totalCount / limit);
        //     ///if no product found
        //     if (product.length === 0) {
        //         return res.status(200).json({
        //         message: "No Product found",
        //         status: 200,
        //         data: {
        //             product: [],
        //             meta: {
        //                 currentPage: page,
        //                 totalPages: totalPages,
        //                 totalItems: totalCount,
        //                 perPage: limit,
        //             },
        //         },
        //     });
        // }
        // ///return success
        // return res.status(200).json({
        //     message: "Product retrieved successfully",
        //     status: 200,
        //     data: {
        //         product: product,
        //         meta: {
        //             currentPage: page,
        //             totalPages: totalPages,
        //             totalItems: totalCount,
        //             perPage: limit,
        //         },
        //     },
        // }); 
        //  }
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error",status:500})
    }
}

module.exports={searchProductCategory}