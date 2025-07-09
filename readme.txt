1. Request Real time calculation 
2. Discount at factor rate
3. in Discount section show the Discount amount with percentage 
4. DiscountStatus Completed / disable  
5. Popup close any postions and text replace and Repayments replace Payments
6. Admin custommer support show with all details 

Funding & Balance Tracker

export const getAllDiscounts = asyncHandler(async (req, res) => {
  const { customerId } = req.query;

  let filter = {};
  if (customerId) {
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: "Invalid customerId format" });
    }
    filter.customerId = new mongoose.Types.ObjectId(customerId);
  }

  const data = await DiscountModel.find(filter).populate(
    "customerId",
    "customerName email approvedAmount totalRepayment"
  );

  const today = new Date();

  const result = await Promise.all(
    data.map(async (item) => {
      const approvedAmount = parseFloat(item.customerId?.approvedAmount || 0);
      const totalRepayment = parseFloat(item.customerId?.totalRepayment || 0);
      const factorRateAmount = totalRepayment - approvedAmount;

      const discountTen = parseFloat(item.discountTen || 0);
      const discountFive = parseFloat(item.discountFive || 0);

      const TenDicountAmount = (factorRateAmount * discountTen) / 100;
      const FiveDicountAmount = (factorRateAmount * discountFive) / 100;

      let discountTenStatus = "N/A";
      if (item.startDateTen && item.endDateTen) {
        if (today > item.endDateTen) {
          discountTenStatus = "Expired";
        } else if (today >= item.startDateTen && today <= item.endDateTen) {
          discountTenStatus = "Active";
        }
      }

      let discountFiveStatus = "N/A";
      if (item.startDateFive && item.endDateFive) {
        if (today > item.endDateFive) {
          discountFiveStatus = "Expired";
        } else if (today >= item.startDateFive && today <= item.endDateFive) {
          discountFiveStatus = "Active";
        }
      }

      await DiscountModel.findByIdAndUpdate(
        item._id,
        {
          discountTenStatus,
          discountFiveStatus,
        },
        { new: true }
      );

      return {
        customerId: item.customerId?._id,
        _id: item?._id,
        customerName: item.customerId?.customerName,
        email: item.customerId?.email,
        discountTen: item.discountTen,
        startDateTen: item.startDateTen,
        endDateTen: item.endDateTen,
        discountTenStatus,
        discountFive: item.discountFive,
        startDateFive: item.startDateFive,
        endDateFive: item.endDateFive,
        discountFiveStatus,
        earlyPayoffStatus: item.earlyPayoffStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        TenDicountAmount: TenDicountAmount.toFixed(2),
        FiveDicountAmount: FiveDicountAmount.toFixed(2),
      };
    })
  );

  res.status(200).json({ success: true, data: result });
});






