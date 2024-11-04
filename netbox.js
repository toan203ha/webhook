const axios = require('axios');

const nb_host = "35.232.22.210"; // Địa chỉ của NetBox
const token = "11a967c0e618e490c1ba2f0fe9844849f2736e75"; // Token xác thực

/**
 * Gửi yêu cầu PATCH để cập nhật interface trong NetBox.
 * @param {number} interface_id - ID của interface cần cập nhật.
 * @param {string} name - Tên mới của interface.
 * @param {Array<number>} tagged_vlans - Danh sách VLAN đã gán cho interface.
 * @returns {Promise} - Trả về promise với kết quả trả về từ NetBox.
 */
async function updateInterface(interface_id, name, tagged_vlans) {
    const patch_url = `https://${nb_host}/api/dcim/interfaces/${interface_id}/`;

    const data = {
        name: name,
        tagged_vlans: tagged_vlans
    };

    try {
        const response = await axios.patch(patch_url, data, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Tắt xác thực SSL
        });

        return response; // Trả về phản hồi từ NetBox
    } catch (error) {
        throw new Error(`Có lỗi xảy ra khi gửi yêu cầu: ${error.message}`);
    }
}

module.exports = {
    updateInterface
};
