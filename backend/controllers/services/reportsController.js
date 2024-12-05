import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import activityModel from '../../models/activity.js';
import itineraryModel from '../../models/itinerary.js';
import productModel from '../../models/product.js';
import advertiserModel from '../../models/advertiser.js';
import tourGuideModel from '../../models/tourGuide.js';
import sellerModel from '../../models/seller.js';

const reportsDir = path.resolve('./reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const generateRevenuePDF = async (req, res) => {
    try {
        let { startDate, endDate, productId, creator, seller, month } = req.query;

        // Filters
        const dateFilter = {};
        if (month) {
            const year = new Date().getFullYear();
            const monthIndex = parseInt(month) - 1;
            startDate = new Date(year, monthIndex, 1);
            endDate = new Date(year, monthIndex + 1, 0);
        } else {
            if (startDate && endDate) {
                dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
            }

            if (!startDate && endDate) {
                startDate = new Date(0);
            } else if (startDate && !endDate) {
                endDate = new Date();
            } else if (!startDate && !endDate) {
                startDate = new Date(0);
                endDate = new Date();
            }
        }

        let creatorId;
        if (creator) {
            creatorId = req.user._id
        }

        let sellerId;
        if (seller) {
            sellerId = req.user._id
        }

        let activities = [];
        let itineraries = [];
        let products = [];
        let activityRevenue = 0;
        let itineraryRevenue = 0;
        let productRevenue = 0;
        let productFound;
        let tourGuideFound;
        let advertiserFound;
        let sellerFound;

        // Conditional data fetching
        if (productId) {
            // Fetch product-specific data
            products = await productModel.find({ _id: productId });
            productRevenue = products.reduce(
                (total, product) =>
                    total +
                    product.SalesReport.filter((record) =>
                        record.date >= new Date(startDate) && record.date <= new Date(endDate)
                    ).reduce((subTotal, record) => subTotal + record.price * record.quantity, 0),
                0
            );
            productFound = products[0];
        } else if (creatorId) {
            // Check if creatorId belongs to a tour guide or advertiser
            const tourGuide = await tourGuideModel.findById(creatorId);
            const advertiser = !tourGuide && (await advertiserModel.findById(creatorId));

            if (tourGuide) {
                // Fetch itineraries for tour guide
                itineraries = await itineraryModel.find({ creatorId });
                itineraryRevenue = itineraries.reduce(
                    (total, itinerary) =>
                        total +
                        itinerary.SalesReport.filter((record) =>
                            new Date(record.date) >= new Date(startDate) && record.date <= new Date(endDate)
                        ).reduce((subTotal, record) => subTotal + record.price * record.quantity, 0),
                    0
                );
                tourGuideFound = tourGuide;
            } else if (advertiser) {
                // Fetch activities for advertiser
                activities = await activityModel.find({ creatorId });
                activityRevenue = activities.reduce(
                    (total, activity) =>
                        total +
                        activity.SalesReport.filter((record) =>
                            new Date(record.date) >= new Date(startDate) && record.date <= new Date(endDate)
                        ).reduce((subTotal, record) => subTotal + record.price * record.quantity, 0),
                    0
                );
                advertiserFound = advertiser;
            } else {
                return res.status(404).send({ error: "Creator ID not found." });
            }
        } else if (sellerId) {
            // Fetch seller-specific data
            products = await productModel.find({ Seller: sellerId });
            productRevenue = products.reduce(
                (total, product) =>
                    total +
                    product.SalesReport.filter((record) =>
                        new Date(record.date) >= new Date(startDate) && record.date <= new Date(endDate)
                    ).reduce((subTotal, record) => subTotal + record.price * record.quantity, 0),
                0
            );
            sellerFound = await sellerModel.findById(sellerId);
        } else {
            // Default case: Fetch everything
            activities = await activityModel.find();
            itineraries = await itineraryModel.find();
            products = await productModel.find();

            const calculateRevenue = (salesReport) =>
                salesReport
                    .filter((record) => new Date(record.date) >= new Date(startDate) && record.date <= new Date(endDate))
                    .reduce((total, record) => total + record.price * record.quantity, 0);

            activityRevenue = activities.reduce((total, activity) => total + calculateRevenue(activity.SalesReport), 0);
            itineraryRevenue = itineraries.reduce(
                (total, itinerary) => total + calculateRevenue(itinerary.SalesReport),
                0
            );
            productRevenue = products.reduce((total, product) => total + calculateRevenue(product.SalesReport), 0);
        }

        const totalRevenue = activityRevenue + itineraryRevenue + productRevenue;

        // Apply 10% app rate
        const appRate = 0.1;
        const netRevenue = totalRevenue * (1 - appRate);
        const appEarnings = totalRevenue * appRate;

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const fileName = `sales_report_${Date.now()}.pdf`;
        const filePath = path.join('./reports', fileName);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Add Logo
        const logoPath = './assets/logo.png'; // Update with your logo path
        doc.image(logoPath, 40, 32, { width: 100 });

        // Title
        doc.fillColor('#36827f').fontSize(20).font('Helvetica-Bold').text('Sales Report', { align: 'center' });
        doc.moveDown(2);

        // Filters Information
        doc.fillColor('black').fontSize(14).text(
            `Date Range: ${startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'All Dates'} to ${endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'All Dates'}`,
            { align: 'center' }
        );
        doc.moveDown();
        if (productId) {
            doc.text(`Filtered Product: ${productFound?.Name || 'NA'}`, { align: 'center' });
        } else if (creatorId) {
            doc.text(
                `Filtered Creator: ${tourGuideFound ? `${tourGuideFound?.username || 'NA'}` : advertiserFound ? `${advertiserFound?.username || 'NA'}` : 'Creator Not Found'}`,
                { align: 'center' }
            );
        } else if (sellerId) {
            doc.text(`Filtered Seller: ${sellerFound?.username || 'NA'}`, { align: 'center' });
        } else {
            doc.text('Filtered Products: All Products', { align: 'center' });
            doc.text('Filtered Creators: All Creators', { align: 'center' });
        }
        doc.moveDown();

        // Revenue Summary
        if (!productId && !sellerId) {
            doc.text(`Activity Revenue: $${activityRevenue.toFixed(2)}`, { align: 'center' });
            doc.text(`Itinerary Revenue: $${itineraryRevenue.toFixed(2)}`, { align: 'center' });
        }
        if (!creatorId) {
            doc.text(`Product Revenue: $${productRevenue.toFixed(2)}`, { align: 'center' });
        }
        doc.moveDown();

        doc.text(`Total Revenue (Gross): $${totalRevenue.toFixed(2)}`, { align: 'center' });
        doc.text(`Net Revenue (After 10% App Rate): $${netRevenue.toFixed(2)}`, { align: 'center' });
        doc.text(`App Earnings (10% Rate): $${appEarnings.toFixed(2)}`, { align: 'center' });
        doc.moveDown();

        doc.text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });
        doc.moveDown(2);

        // Footer
        doc.fillColor('white').fontSize(10).text('2024 TripTomania - All Rights Reserved', 0, doc.page.height - 40, {
            align: 'center',
        });

        doc.end();

        // Respond once PDF is ready
        writeStream.on('finish', () => {
            res.download(filePath, fileName, (err) => {
                if (err) {
                    fs.unlinkSync(filePath); // Cleanup in case of error
                    res.status(500).send({ error: 'Error downloading file.' });
                }
                fs.unlinkSync(filePath); // Cleanup after successful download
            });
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const generateTouristCountPDF = async (req, res) => {
    try {
        let { eventId, startDate, endDate, month } = req.query;
        const creatorId = req.user._id;
        const creatorType = req.user.type;

        if (creatorType !== 'tourGuide' && creatorType !== 'advertiser') {
            return res.status(403).send({ error: 'You are not authorized to access this report.' });
        }

        let events = [];
        let reportType = '';
        let totalTouristCount = 0;

        // Create date filter if provided
        const dateFilter = {};

        if (month) {
            const year = new Date().getFullYear();
            const monthIndex = parseInt(month) - 1; // JavaScript months are zero-indexed
            startDate = new Date(year, monthIndex, 1); // First day of the month
            endDate = new Date(year, monthIndex + 1, 1); // First day of the next month
            endDate.setHours(0, 0, 0, 0); // Midnight, start of the next day

            dateFilter.$gte = new Date(startDate);
            dateFilter.$lt = new Date(endDate);
        } else {
            if (!startDate && endDate) {
                dateFilter.$gte = new Date(0);
                dateFilter.$lte = new Date(endDate);
            } else if (!endDate && startDate) {
                dateFilter.$gte = new Date(startDate);
                dateFilter.$lte = new Date();
            } else if (!startDate && !endDate) {
                dateFilter.$gte = new Date(0);
                dateFilter.$lte = new Date();
            } else {
                dateFilter.$gte = new Date(startDate);
                dateFilter.$lte = new Date(endDate);
            }
        }

        // Fetch and validate events based on the creator type and date range
        if (creatorType === 'tourGuide') {
            reportType = 'Itineraries';

            if (eventId) {
                // Fetch a specific itinerary
                events = await itineraryModel.find({
                    _id: eventId,
                    creatorId,
                    Start_date: { ...dateFilter, $lte: new Date() }, // Only past start dates
                });
            } else {
                // Fetch all itineraries for the tour guide
                events = await itineraryModel.find({
                    creatorId,
                    Start_date: { ...dateFilter, $lte: new Date() }, // Only past start dates
                });
            }
        } else if (creatorType === 'advertiser') {
            reportType = 'Activities';

            if (eventId) {
                // Fetch a specific activity
                events = await activityModel.find({
                    _id: eventId,
                    creatorId,
                    date: { ...dateFilter, $lte: new Date() }, // Only past dates
                });
            } else {
                // Fetch all activities for the advertiser
                events = await activityModel.find({
                    creatorId,
                    date: { ...dateFilter, $lte: new Date() }, // Only past dates
                });
            }
        }

        if (events.length) {
            // Calculate total tourist count
            events.forEach((event) => {
                totalTouristCount += event.bookingMade.length;
            });
        }

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const fileName = `tourist_count_report_${Date.now()}.pdf`;
        const filePath = path.join('./reports', fileName);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Add Logo
        const logoPath = './assets/logo.png'; // Update with your logo path
        doc.image(logoPath, 40, 32, { width: 100 });

        // Title
        doc.fillColor('#36827f').fontSize(20).font('Helvetica-Bold').text('Tourist Count Report', { align: 'center' });
        doc.moveDown(2);

        // Report Summary
        doc.fillColor('black').fontSize(14).text(`Report Type: ${reportType}`, { align: 'center' });

        if (events.length) {
            doc.text(`Total Tourist Count: ${totalTouristCount}`, { align: 'center' });
        } else {
            doc.text('No events found', { align: 'center' });
        }
        doc.moveDown();

        // Event Details Table
        if (events.length) {
            doc.fontSize(12).text('Event Details:', { underline: true });
            events.forEach((event, index) => {
                const eventName = event.name || 'Unnamed Event';
                const eventTouristCount = event.bookingMade.length;
                const eventDate =
                    creatorType === 'advertiser' ? event.date : event.Start_date;

                doc.text(
                    `${index + 1}. Event Name: ${eventName} | Tourists: ${eventTouristCount} | Date: ${new Date(
                        eventDate
                    ).toLocaleDateString()}`,
                    {
                        align: 'left',
                    }
                );
            });
        }
        doc.moveDown();

        // Date Range Filter
        const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : 'All Dates';
        const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : 'All Dates';
        doc.text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`, { align: 'center' });
        doc.moveDown(2);

        // Footer
        doc.fillColor('white').fontSize(10).text('2024 TripTomania - All Rights Reserved', 0, doc.page.height - 40, {
            align: 'center',
        });

        doc.end();

        // Respond once PDF is ready
        writeStream.on('finish', () => {
            res.download(filePath, fileName, (err) => {
                if (err) {
                    fs.unlinkSync(filePath); // Cleanup in case of error
                    res.status(500).send({ error: 'Error downloading file.' });
                }
                fs.unlinkSync(filePath); // Cleanup after successful download
            });
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export default { generateRevenuePDF, generateTouristCountPDF };
