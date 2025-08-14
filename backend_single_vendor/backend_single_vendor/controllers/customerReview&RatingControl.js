const reviewRatingModel= require('../models/productreview&ratingModel');
///customer model
// const customerModel=require('../models/customerauthModel');
///product order model
const productOrderModel=require('../models/productOrder');
const { default: mongoose } = require('mongoose');
////////////////////////in this customer put the review and rating of product/////////////////////////////

const reviewOrRatingAdd = async (req, res) => {
    try {
        const { rating, review, customerId, productId, image } = req.body;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid customerId or productId",
                status: 400
            });
        }

        // Check if the user has purchased the product
        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(customerId),
                    productId: new mongoose.Types.ObjectId(productId)
                }
            }
        ];

        const result = await productOrderModel.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(404).json({
                message: "Invalid user or product not purchased",
                status: 404
            });
        }

        // Check for existing review
        const existingReview = await reviewRatingModel.findOne({
            customerId,
            productId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product",
                status: 400
            });
        }

        // Create new review
        const data = new reviewRatingModel({
            rating,
            review,
            image,
            customerId,
            productId
           
        });

        await data.save();

        // Populate customer and product details
        const populatedData = await reviewRatingModel.findById(data._id)
            .populate("customerId")
            .populate("productId");

        return res.status(200).json({
            message: "Review and rating saved successfully",
            data: populatedData,
            status: 200
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: 500
        });
    }
};


////review and rating view on customer part

const reviewOrRatingView = async (req, res) => {
  try {
    const { productId, customerId, rating } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID", status: 400 });
    }

    const matchStage = { productId: new mongoose.Types.ObjectId(productId) };
    if (rating) {
      let ratingsArray = [];

      if (Array.isArray(rating)) {
        
        ratingsArray = rating.map(r => parseInt(r));
      } else if (typeof rating === 'string') {
        try {
          const parsed = JSON.parse(rating);
          if (Array.isArray(parsed)) {
            ratingsArray = parsed.map(r => parseInt(r));
          } else {
            ratingsArray = rating.split(',').map(r => parseInt(r));
          }
        } catch (e) {
          ratingsArray = rating.split(',').map(r => parseInt(r));
        }
      }

      ratingsArray = ratingsArray.filter(r => !isNaN(r));
      if (ratingsArray.length > 0) {
        matchStage.rating = { $in: ratingsArray };
      }
    }


    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'customerinfos', 
          localField: 'customerId',
          foreignField: '_id',
          as: 'data'
        }
      },
      { $unwind: "$data" },
      {
        $addFields: {
          isCurrentUser: {
            $cond: [
              { $eq: ["$customerId", new mongoose.Types.ObjectId(customerId)] },
              1,
              0
            ]
          }
        }
      },
      { $sort: { isCurrentUser: -1, createdAt: -1 } },
      {
        $project: {
          _id: 1,
          rating: 1,
          review: 1,
          image: 1,
          createdAt: 1,
          "data.personalInfo.name": 1,
          "data.personalInfo.photo": 1,
          isCurrentUser: 1
        }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ];

    const result = await reviewRatingModel.aggregate(pipeline);
    const review = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Ratings summary
    const ratingDetails = await reviewRatingModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
          comments: {
            $sum: { $cond: [{ $ne: ["$review", ""] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // const ratingSummary = [
    //   {"5": { count: 0, comments: 0 }},
    //   {"4": { count: 0, comments: 0 }},
    //   {"3": { count: 0, comments: 0 }},
    //   {"2": { count: 0, comments: 0 }},
    //   {"1": { count: 0, comments: 0 }}
    // ];
    const ratingSummary = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: 0,
      comments: 0
    }));

    let totalRatingSum = 0;
    let totalReviews = 0;

    // ratingDetails.forEach(item => {
    //   const key = String(item._id);
    //   ratingSummary[key] = {
    //     count: item.count,
    //     comments: item.comments
    //   };
    //   totalRatingSum += item._id * item.count;
    //   totalReviews += item.count;
    // });
    ratingDetails.forEach(item => {
      const index = ratingSummary.findIndex(summary => summary.rating === item._id);
      if (index !== -1) {
        ratingSummary[index].count = item.count;
        ratingSummary[index].comments = item.comments;
    
        totalRatingSum += item._id * item.count;
        totalReviews += item.count;
      }
    });
    const overallRating = totalReviews ? parseFloat((totalRatingSum / totalReviews).toFixed(1)) : 0;

    return res.status(200).json({
      message: "Review and rating fetched successfully",
      status: 200,
      data: {
        review,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          perPage: limit
        },
        ratingSummary,
        overallRating,
        totalReviews
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      status: 500
    });
  }
};
  
////reviews and rating count on scale
//in this customers can see the number of users commnets for a specific product on scale of 5
const productRatingDetails = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID", status: 400 });
        }

        // Aggregation pipeline to calculate ratings distribution
        const ratingDetails = await reviewRatingModel.aggregate([
            {
                $match: { productId: mongoose.Types.ObjectId(productId) } 
            },
            {
                $group: {
                    _id: "$rating", 
                    count: { $sum: 1 }, 
                    comments: {
                        $sum: { $cond: [{ $ne: ["$review", ""] }, 1, 0] } 
                    }
                }
            },
            {
                $sort: { _id: -1 } 
            }
        ]);

        // Format the response
        const response = {
            productId,
            ratings: {
                "5": { count: 0, comments: 0 },
                "4": { count: 0, comments: 0 },
                "3": { count: 0, comments: 0 },
                "2": { count: 0, comments: 0 },
                "1": { count: 0, comments: 0 }
            }
        };

        ratingDetails.forEach(item => {
            response.ratings[item._id] = {
                count: item.count,
                comments: item.comments
            };
        });
        ///if no data found
        if(!response){
        return res.status(404).json({message:"No data found",status:404});
        }
        // Send the response
        return res.status(200).json({
            message: "Rating details fetched successfully",
            data: response,
            status: 200
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: 500
        });
    }
};





module.exports={reviewOrRatingAdd,reviewOrRatingView,productRatingDetails}