// routes.js
const express = require('express');
const { Logging } = require('@google-cloud/logging');
const router = express.Router();

// Khởi tạo Google Cloud Logging
const logging = new Logging({
    projectId: 'netbox-lab', // Thay bằng ID dự án của bạn
    keyFilename: 'C:\\Users\\toan3\\Downloads\\netbox-lab-b517cda52da3.json' // Đường dẫn đến tệp JSON của Service Account
});

// Tạo log
const log = logging.log('webhook-logs');

// Hàm ghi log vào Google Cloud
async function writeLog(severity, message) {
    const metadata = { severity };
    const entry = log.entry(metadata, { message });
    await log.write(entry);
    console.log(`Logged: ${message}`);
}

// Route GET để kiểm tra server
router.get('/main', (req,res) => {
    const message = "Hello from main";
    const date = new Date();
    const formattedDate = date.toLocaleString();
    writeLog('Test Server');
    res.json({ message, formattedDate });
});

// Route POST để nhận yêu cầu webhook từ NetBox
router.post('/webhook/devices', async (req, res) => {
    if (!req.body) {
        console.log('Không nhận được webhook request');
        await writeLog('ERROR', 'Không nhận được webhook request');
        return res.status(400).send('No data received');
    }
    console.log('Received webhook request');
    const date = new Date();
    const formattedDate = date.toLocaleString();
    const event = req.body;

    // Kiểm tra loại sự kiện và ghi log
    if (event.event === 'created' && event.model === 'device') {
        const message = `Thiết bị mới đã được tạo: ${req.body.data.name}, Được tạo lúc: ${formattedDate}`;
        console.log(message);
        await writeLog('INFO', message);
        res.status(200).send('Webhook received');
    } else if (event.event === 'updated' && event.model === 'device') {
        const message = `Thiết bị đã được cập nhật: ${req.body.data.name}, Được cập nhật lúc: ${formattedDate}`;
        console.log(message);
        await writeLog('INFO', message);
        res.status(200).send('Webhook received for update');
    } else if (event.event === 'deleted' && event.model === 'device') {
        const message = `Thiết bị đã bị xóa: ${req.body.data.name}, Được xóa lúc: ${formattedDate}`;
        console.log(message);
        await writeLog('INFO', message);
        res.status(200).send('Webhook received for deletion');
    } else {
        const message = 'Sự kiện không hợp lệ hoặc không phải là thiết bị.';
        console.log(message);
        await writeLog('WARNING', message);
        res.status(400).send('Invalid event type');
    }
});

module.exports = router;
