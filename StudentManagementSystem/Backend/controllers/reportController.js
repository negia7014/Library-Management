const Report = require('../models/report');

exports.getReports = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const issuedBooks = await Transaction.countDocuments({ returned: false });
    const returnedBooks = await Transaction.countDocuments({ returned: true });
    const activeMemberships = await Membership.countDocuments({ active: true });
    const pendingFines = await Transaction.find({ fine: { $gt: 0 }, finePaid: false }).countDocuments();

    const reportData = {
      totalBooks,
      issuedBooks,
      returnedBooks,
      activeMemberships,
      pendingFines
    };

    const newReport = new Report(reportData);
    await newReport.save();

    res.json(reportData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating report' });
  }
};
