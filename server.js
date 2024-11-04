    const express = require('express');
    const bodyParser = require('body-parser');
    const routes = require('./routes'); // Nhập các route từ tệp routes.js

    const app = express();
    const PORT = 3210;

    // Sử dụng body-parser để phân tích cú pháp JSON
    app.use(bodyParser.json());

    // Sử dụng các route
    app.use('/api', routes);  

    // Khởi động server
    app.listen(PORT, () => {
        console.log(`Webhook server is running on http://localhost:${PORT}`);
    });
    